$(function () {
  "use strict";

  const $list = $("#task-list");
  const $form = $("#task-form");
  let pendingSearch = null;

  function escapeText(value) {
    return $("<div>").text(value == null ? "" : String(value)).text();
  }

  function renderTask(task) {
    const $item = $("<li>", { class: "task-item", "data-task-id": task.id });
    const $check = $("<input>", { type: "checkbox", class: "task-toggle" }).prop("checked", task.completed);
    const $title = $("<span>", { class: "task-title" }).text(task.title);
    const $delete = $("<button>", { type: "button", class: "delete-task", text: "删除" });
    $item.toggleClass("is-done", task.completed).append($check, $title, $delete);
    return $item;
  }

  function renderList(response) {
    $list.empty();
    response.data.forEach(function (task) { $list.append(renderTask(task)); });
    $("#task-count").text(response.meta.total + " 个任务");
    $("#empty-state").prop("hidden", response.data.length > 0);
  }

  function loadTasks(query) {
    if (pendingSearch) pendingSearch.abort();
    $("#loading").prop("hidden", false);
    pendingSearch = $.getJSON("/api/tasks", { q: query || "" })
      .done(renderList)
      .fail(function (xhr, status) { if (status !== "abort") handleError(xhr); })
      .always(function () { $("#loading").prop("hidden", true); });
  }

  function handleError(xhr) {
    const payload = xhr.responseJSON || {};
    const error = payload.error || {};
    showToast(error.message || "请求失败，请稍后重试");
    if (error.fields && error.fields.title) $("#title-error").text(error.fields.title);
  }

  function showToast(message) {
    const $toast = $("#toast").stop(true, true).text(message).addClass("show");
    setTimeout(function () { $toast.removeClass("show"); }, 2200);
  }

  function debounce(fn, delay) {
    let timer;
    return function () {
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(null, args); }, delay);
    };
  }

  $form.on("submit", function (event) {
    event.preventDefault();
    const title = $("#title").val().trim();
    $("#title-error").text("");
    if (!title) return $("#title-error").text("请输入任务标题");

    const $button = $form.find("button").prop("disabled", true).text("添加中…");
    $.ajax({
      url: "/api/tasks",
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({ title: title })
    }).done(function (response) {
      $list.prepend(renderTask(response.data));
      $("#title").val("").focus();
      $("#empty-state").prop("hidden", true);
      loadTasks($("#search").val());
    }).fail(handleError).always(function () {
      $button.prop("disabled", false).text("添加任务");
    });
  });

  $list.on("change", ".task-toggle", function () {
    const $check = $(this);
    const $row = $check.closest(".task-item");
    const completed = $check.prop("checked");
    $row.toggleClass("is-done", completed).addClass("is-saving");
    $.ajax({
      url: "/api/tasks/" + $row.data("taskId"), method: "PATCH",
      contentType: "application/json", data: JSON.stringify({ completed: completed })
    }).fail(function (xhr) {
      $check.prop("checked", !completed); $row.toggleClass("is-done", !completed); handleError(xhr);
    }).always(function () { $row.removeClass("is-saving"); });
  });

  $list.on("click", ".delete-task", function () {
    const $row = $(this).closest(".task-item");
    if (!window.confirm("确定删除这条任务吗？")) return;
    $.ajax({ url: "/api/tasks/" + $row.data("taskId"), method: "DELETE" })
      .done(function () { $row.remove(); loadTasks($("#search").val()); })
      .fail(handleError);
  });

  $("#search").on("input", debounce(function () { loadTasks(this.value.trim()); }, 300));
  loadTasks("");
});
