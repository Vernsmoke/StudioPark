const projects = {
  campus: {
    format: "Interactive app",
    title: "Campus Compass",
    description: "A mobile wayfinding concept designed to make an unfamiliar campus easier to navigate. The prototype combines clear route choices, accessible-path information, and recognizable campus landmarks.",
    details: { "Core tools": "Interface design, mapping, AR concept", "Audience": "New students and campus visitors", "Goal": "Reduce wayfinding stress and missed destinations" }
  },
  climate: {
    format: "Data installation",
    title: "Climate Pulse",
    description: "A walk-around visualization that translates long-term ocean and temperature records into shifting light, layered motion, and an ambient soundscape.",
    details: { "Core tools": "Data visualization, 3D motion, sensors", "Audience": "Students and community visitors", "Goal": "Make environmental change tangible and memorable" }
  },
  woven: {
    format: "Short documentary",
    title: "Woven Voices",
    description: "A documentary concept centered on the hands, sounds, and memories behind local textile craft. Close-up photography and recorded stories keep the makers' process at the center.",
    details: { "Core tools": "Video, field audio, motion graphics", "Audience": "Students, families, and local makers", "Goal": "Preserve and share community knowledge responsibly" }
  }
};

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.querySelector(".sr-only").textContent = open ? "Close navigation" : "Open navigation";
  navLinks.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open && window.innerWidth <= 992);
}

menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 992) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuButton.focus();
  }
});

const cards = [...document.querySelectorAll(".project-card")];
const chips = [...document.querySelectorAll(".filter-chip")];
const search = document.querySelector("#project-search");
const status = document.querySelector("#results-status");
const emptyState = document.querySelector("#empty-state");
let activeFilter = "all";

function filterProjects() {
  const query = search.value.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach((card) => {
    const matchesFilter = activeFilter === "all" || card.dataset.tags.includes(activeFilter);
    const searchableText = `${card.dataset.title} ${card.dataset.tags}`.toLowerCase();
    const matchesSearch = !query || searchableText.includes(query);
    const visible = matchesFilter && matchesSearch;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  const projectWord = visibleCount === 1 ? "project" : "projects";
  status.textContent = visibleCount === cards.length && !query && activeFilter === "all"
    ? "Showing all 3 projects."
    : `Showing ${visibleCount} ${projectWord}.`;
  emptyState.hidden = visibleCount !== 0;
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeFilter = chip.dataset.filter;
    chips.forEach((item) => {
      const active = item === chip;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    filterProjects();
  });
});
search.addEventListener("input", filterProjects);
document.querySelector("#clear-search").addEventListener("click", () => {
  search.value = "";
  activeFilter = "all";
  chips.forEach((chip) => {
    const active = chip.dataset.filter === "all";
    chip.classList.toggle("is-active", active);
    chip.setAttribute("aria-pressed", String(active));
  });
  filterProjects();
  search.focus();
});

const savedKeys = new Set(JSON.parse(localStorage.getItem("studioSparkSaved") || "[]"));
document.querySelectorAll(".save-button").forEach((button) => {
  const key = button.dataset.save;
  const label = button.querySelector(".sr-only");

  function renderSavedState() {
    const saved = savedKeys.has(key);
    button.setAttribute("aria-pressed", String(saved));
    label.textContent = `${saved ? "Remove" : "Save"} ${projects[key].title}${saved ? " from saved projects" : ""}`;
  }

  renderSavedState();
  button.addEventListener("click", () => {
    savedKeys.has(key) ? savedKeys.delete(key) : savedKeys.add(key);
    localStorage.setItem("studioSparkSaved", JSON.stringify([...savedKeys]));
    renderSavedState();
  });
});

const dialog = document.querySelector("#project-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogFormat = document.querySelector("#dialog-format");
const dialogDescription = document.querySelector("#dialog-description");
const dialogDetails = document.querySelector("#dialog-details");

document.querySelectorAll(".project-open").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projects[button.dataset.project];
    dialogTitle.textContent = project.title;
    dialogFormat.textContent = project.format;
    dialogDescription.textContent = project.description;
    dialogDetails.replaceChildren();
    Object.entries(project.details).forEach(([term, value]) => {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = term;
      dd.textContent = value;
      dialogDetails.append(dt, dd);
    });
    dialog.showModal();
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) dialog.close();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
