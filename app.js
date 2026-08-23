(function () {
  "use strict";

  const chapters = window.COURSE || [];
  const storageKey = "flask-forge-progress-v2";
  const lastKey = "flask-forge-last-v2";
  const themeKey = "flask-forge-theme-v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const state = { completed: readCompleted(), active: 0, query: "" };

  function readCompleted() {
    try { return new Set(JSON.parse(localStorage.getItem(storageKey) || "[]")); }
    catch (_) { return new Set(); }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }

  function render() {
    const sectionCount = chapters.reduce((total, chapter) => total + chapter.sections.length, 0);
    $("#chapterCount").textContent = chapters.length;
    $("#heroChapterCount").textContent = chapters.length;
    $("#heroSectionCount").textContent = sectionCount;
    $("#chapterNav").innerHTML = chapters.map((chapter, index) => `
      <a class="nav-link ${state.completed.has(index) ? "done" : ""}" href="#chapter-${index}" data-nav="${index}">
        <span class="nav-num">${String(index).padStart(2, "0")}</span>
        <span>${escapeHtml(chapter.title)}</span><span class="nav-check">✓</span>
      </a>`).join("");

    $("#courseContent").innerHTML = chapters.map((chapter, index) => `
      <article class="chapter" id="chapter-${index}" data-index="${index}" data-search="${escapeHtml((chapter.title + " " + chapter.subtitle + " " + chapter.keywords).toLowerCase())}">
        <button class="chapter-header" aria-expanded="false">
          <span class="chapter-number">${String(index).padStart(2, "0")}</span>
          <span class="chapter-title"><h3>${escapeHtml(chapter.title)}</h3><p>${escapeHtml(chapter.subtitle)}</p></span>
          <span class="chapter-meta"><span>${chapter.duration}</span><span>${chapter.sections.length} 节</span><span class="chevron">⌄</span></span>
        </button>
        <div class="chapter-body">
          <div class="chapter-intro"><p>${chapter.intro}</p><b>学习目标</b></div>
          ${chapter.sections.map(section => `<section class="lesson"><h4>${section.title}</h4>${section.content}</section>`).join("")}
          ${renderQuiz(chapter.quiz, index)}
          <div class="chapter-footer"><span class="chapter-duration">建议学习 ${chapter.duration} · 完成练习后再标记</span><button class="complete-button ${state.completed.has(index) ? "done" : ""}" data-complete="${index}">${state.completed.has(index) ? "✓ 已完成" : "标记为已完成"}</button></div>
        </div>
      </article>`).join("");
    bindDynamicEvents();
    updateProgress();
  }

  function renderQuiz(quiz, chapterIndex) {
    if (!quiz) return "";
    return `<div class="quiz" data-answer="${quiz.answer}" data-chapter="${chapterIndex}">
      <h4>章节自测 · ${escapeHtml(quiz.question)}</h4>
      <div class="quiz-options">${quiz.options.map((option, i) => `<button class="quiz-option" data-option="${i}">${String.fromCharCode(65 + i)}. ${escapeHtml(option)}</button>`).join("")}</div>
      <p class="quiz-result"></p>
    </div>`;
  }

  function bindDynamicEvents() {
    $$(".chapter-header").forEach(button => button.addEventListener("click", () => toggleChapter(button.closest(".chapter"))));
    $$(".complete-button").forEach(button => button.addEventListener("click", () => toggleComplete(Number(button.dataset.complete))));
    $$(".copy-code").forEach(button => button.addEventListener("click", () => copyCode(button)));
    $$(".quiz-option").forEach(button => button.addEventListener("click", () => answerQuiz(button)));
    $$("[data-nav]").forEach(link => link.addEventListener("click", event => {
      event.preventDefault();
      openAndScroll(Number(link.dataset.nav));
      closeSidebar();
    }));
  }

  function toggleChapter(chapter, force) {
    const shouldOpen = typeof force === "boolean" ? force : !chapter.classList.contains("open");
    chapter.classList.toggle("open", shouldOpen);
    $(".chapter-header", chapter).setAttribute("aria-expanded", shouldOpen);
    if (shouldOpen) {
      const index = Number(chapter.dataset.index);
      localStorage.setItem(lastKey, String(index));
      setActive(index);
    }
  }

  function openAndScroll(index) {
    const chapter = $(`#chapter-${index}`);
    if (!chapter) return;
    toggleChapter(chapter, true);
    setTimeout(() => chapter.scrollIntoView({behavior: "smooth", block: "start"}), 40);
  }

  function toggleComplete(index) {
    if (state.completed.has(index)) state.completed.delete(index); else state.completed.add(index);
    localStorage.setItem(storageKey, JSON.stringify([...state.completed]));
    const button = $(`[data-complete="${index}"]`);
    const nav = $(`[data-nav="${index}"]`);
    button.classList.toggle("done", state.completed.has(index));
    button.textContent = state.completed.has(index) ? "✓ 已完成" : "标记为已完成";
    nav.classList.toggle("done", state.completed.has(index));
    updateProgress();
    toast(state.completed.has(index) ? "这一章已记入学习进度" : "已取消完成标记");
  }

  function updateProgress() {
    const count = state.completed.size;
    const percent = chapters.length ? Math.round(count / chapters.length * 100) : 0;
    $("#completedCount").textContent = count;
    $("#progressRing").style.setProperty("--progress", `${percent}%`);
    $("#bigProgress").style.setProperty("--progress", `${percent}%`);
    $("#bigProgress span").textContent = `${percent}%`;
    $("#progressSummary").textContent = count === chapters.length ? "全部章节已完成。现在用毕业项目证明你的能力！" : `已完成 ${count} / ${chapters.length} 章，还剩 ${chapters.length - count} 章。`;
  }

  async function copyCode(button) {
    const code = button.closest(".code-block").querySelector("code").innerText;
    try { await navigator.clipboard.writeText(code); toast("代码已复制"); }
    catch (_) {
      const area = document.createElement("textarea"); area.value = code; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); toast("代码已复制");
    }
  }

  function answerQuiz(button) {
    const quiz = button.closest(".quiz");
    if (quiz.dataset.answered) return;
    quiz.dataset.answered = "1";
    const chosen = Number(button.dataset.option);
    const answer = Number(quiz.dataset.answer);
    $$(".quiz-option", quiz)[answer].classList.add("correct");
    if (chosen !== answer) button.classList.add("wrong");
    $(".quiz-result", quiz).textContent = chosen === answer ? "回答正确。你已经抓住了这一章的关键。" : "再回看本章对应小节；绿色选项是正确答案。";
  }

  function search(query) {
    state.query = query.trim().toLowerCase();
    let matches = 0;
    $$(".chapter").forEach((chapter, index) => {
      const source = `${chapter.dataset.search} ${chapters[index].searchText.toLowerCase()}`;
      const matched = !state.query || source.includes(state.query);
      chapter.hidden = !matched;
      $(`[data-nav="${index}"]`).style.display = matched ? "grid" : "none";
      if (matched && state.query) { matches++; toggleChapter(chapter, true); }
    });
    const status = $("#searchStatus");
    status.hidden = !state.query;
    if (state.query) status.textContent = matches ? `找到 ${matches} 个相关章节。章节已自动展开，可按 Ctrl+F 继续定位正文。` : `没有找到“${query}”。试试“蓝图”“会话”“AJAX”或“部署”。`;
  }

  function setActive(index) {
    state.active = index;
    $$(".nav-link").forEach(link => link.classList.toggle("active", Number(link.dataset.nav) === index));
  }

  let toastTimer;
  function toast(message) {
    const node = $("#toast"); node.textContent = message; node.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove("show"), 1800);
  }

  function closeSidebar() { $("#sidebar").classList.remove("open"); $("#sidebarScrim").classList.remove("show"); }

  function applyTheme(theme, announce) {
    const selected = theme === "warm" ? "warm" : "cool";
    document.documentElement.dataset.theme = selected;
    const themeMeta = $('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", selected === "warm" ? "#17100b" : "#07111f");
    const isWarm = selected === "warm";
    const button = $("#themeToggle");
    button.setAttribute("aria-pressed", String(isWarm));
    button.setAttribute("aria-label", isWarm ? "切换到冷色主题" : "切换到暖色主题");
    $(".theme-label", button).textContent = isWarm ? "暖色" : "冷色";
    try { localStorage.setItem(themeKey, selected); } catch (_) { /* 当前页面仍然生效 */ }
    if (announce) toast(isWarm ? "已切换为暖色阅读模式" : "已切换为冷色阅读模式");
  }

  render();
  applyTheme(document.documentElement.dataset.theme || "cool", false);
  $("#themeToggle").addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "warm" ? "cool" : "warm", true));
  $("#startLearning").addEventListener("click", () => openAndScroll(0));
  $("#continueLearning").addEventListener("click", () => openAndScroll(Number(localStorage.getItem(lastKey) || 0)));
  $("#expandAll").addEventListener("click", () => $$(".chapter:not([hidden])").forEach(ch => toggleChapter(ch, true)));
  $("#collapseAll").addEventListener("click", () => $$(".chapter").forEach(ch => toggleChapter(ch, false)));
  $("#globalSearch").addEventListener("input", event => search(event.target.value));
  document.addEventListener("keydown", event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#globalSearch").focus(); } });
  $("#menuButton").addEventListener("click", () => { $("#sidebar").classList.add("open"); $("#sidebarScrim").classList.add("show"); });
  $("#sidebarScrim").addEventListener("click", closeSidebar);
  $("#progressButton").addEventListener("click", () => $("#progressDialog").showModal());
  $(".dialog-close").addEventListener("click", () => $("#progressDialog").close());
  $("#resetProgress").addEventListener("click", () => { state.completed.clear(); localStorage.removeItem(storageKey); $("#progressDialog").close(); render(); toast("学习记录已重置"); });
  $("#backTop").addEventListener("click", () => scrollTo({top: 0, behavior: "smooth"}));
  $$("[data-jump]").forEach(button => button.addEventListener("click", () => openAndScroll(button.dataset.jump === "last" ? chapters.length - 1 : Number(button.dataset.jump.split("-")[1]))));
  window.addEventListener("scroll", () => {
    $("#backTop").classList.toggle("show", scrollY > 600);
    const visible = $$(".chapter").find(ch => { const r = ch.getBoundingClientRect(); return r.top <= 170 && r.bottom > 170; });
    if (visible) setActive(Number(visible.dataset.index));
  }, {passive: true});
})();
