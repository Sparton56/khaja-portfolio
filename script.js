(() => {
  "use strict";
  const data = window.portfolioData || { name: "[MOHAMMED KHAJA AHMED]", email: "ra2025684@gmail.com", projects: [] };
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const filters = document.querySelector("#filters");
  const grid = document.querySelector("#project-grid");
  const search = document.querySelector("#project-search");
  const count = document.querySelector("#results-count");
  const empty = document.querySelector("#empty-state");
  const dialog = document.querySelector("#project-dialog");
  let activeCategory = "All projects";

  document.querySelectorAll("[data-portfolio-name]").forEach(el => { el.textContent = data.name || "[Your name]"; });
  document.title = `${data.name && data.name !== "[MOHAMMED KHAJA AHMED]" ? data.name : "Web Development"} — Portfolio`;
  document.querySelector("#project-total").textContent = String(projects.length).padStart(2, "0");

  const email = typeof data.email === "string" ? data.email.trim() : "";
  const emailLink = document.querySelector("#email-link");
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailLink.textContent = email;
    emailLink.href = `mailto:${email}`;
    emailLink.removeAttribute("aria-disabled");
    document.querySelector("#contact-note").textContent = "Click the address to open your email app.";
  } else {
    emailLink.addEventListener("click", event => event.preventDefault());
  }

  const categories = ["All projects", ...new Set(projects.map(p => p.category).filter(Boolean))];
  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.textContent = category;
    button.setAttribute("aria-pressed", String(category === activeCategory));
    button.addEventListener("click", () => { activeCategory = category; render(); });
    filters.append(button);
  });

  function textEl(tag, className, value) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = value || "";
    return el;
  }

  function openProject(project) {
    document.querySelector("#dialog-label").textContent = `${project.category || "Project"} / ${project.status || ""}`;
    document.querySelector("#dialog-title").textContent = project.title || "Untitled project";
    document.querySelector("#dialog-description").textContent = project.description || project.summary || "";
    const highlights = document.querySelector("#dialog-highlights");
    highlights.replaceChildren(...(project.highlights || []).map(item => textEl("li", "", item)));
    const tools = document.querySelector("#dialog-tools");
    tools.replaceChildren(...(project.tools || []).map(item => textEl("span", "tag", item)));
    const note = document.querySelector("#dialog-note");
    note.replaceChildren();
    if (project.link && (/^https:\/\//i.test(project.link) || /^(\.\/|\/)[^/]/.test(project.link))) {
      const a = textEl("a", "dialog-link", project.link.startsWith("./") ? "Open current draft ↗" : "Visit project ↗");
      a.href = project.link;
      if (/^https:\/\//i.test(project.link)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      note.append(a);
    } else {
      note.textContent = "A live project link can be added when available.";
    }
    dialog.showModal();
  }

  function makeCard(project, index) {
    const card = document.createElement("article");
    card.className = "project-card";
    const visual = textEl("div", "project-visual", "");
    visual.setAttribute("aria-hidden", "true");
    const visualInner = textEl("div", "project-visual-inner", "");
    visualInner.append(textEl("span", "visual-index", String(index + 1).padStart(2, "0") + " / PROJECT"));
    visualInner.append(textEl("strong", "visual-title", project.title || "Untitled project"));
    visualInner.append(textEl("span", "visual-line", "↗"));
    visual.append(visualInner);
    const body = textEl("div", "project-body", "");
    const top = textEl("div", "project-top", "");
    top.append(textEl("span", "project-category", project.category || "Project"), textEl("span", "project-status", project.status || "Project"));
    body.append(top, textEl("h3", "", project.title || "Untitled project"), textEl("p", "project-summary", project.summary || ""));
    const bottom = textEl("div", "project-bottom", "");
    const tags = textEl("div", "tag-list", "");
    tags.append(...(project.tools || []).map(item => textEl("span", "tag", item)));
    const button = textEl("button", "project-open", "View details ↗");
    button.type = "button";
    button.setAttribute("aria-label", `View details for ${project.title || "project"}`);
    button.addEventListener("click", () => openProject(project));
    bottom.append(tags, button);
    body.append(bottom);
    card.append(visual, body);
    return card;
  }

  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    const visible = projects.filter(p => {
      const matchesCategory = activeCategory === "All projects" || p.category === activeCategory;
      const terms = [p.title, p.category, p.status, p.summary, ...(p.tools || [])].join(" ").toLocaleLowerCase();
      return matchesCategory && terms.includes(query);
    });
    grid.replaceChildren(...visible.map(p => makeCard(p, projects.indexOf(p))));
    count.textContent = `${visible.length} ${visible.length === 1 ? "project" : "projects"} shown`;
    empty.hidden = visible.length !== 0;
    filters.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(button.textContent === activeCategory)));
  }
  search.addEventListener("input", render);
  document.querySelector("#clear-filters").addEventListener("click", () => { search.value = ""; activeCategory = "All projects"; render(); search.focus(); });
  document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  render();
})();
