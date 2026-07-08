// ---------- Mobile Menu ----------
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navLinkItems = document.querySelectorAll(".nav-links a");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const menuIsOpen = navLinks.classList.toggle("show");

    menuToggle.setAttribute("aria-expanded", menuIsOpen);
    menuToggle.setAttribute(
      "aria-label",
      menuIsOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  navLinkItems.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const targetElement = targetId ? document.querySelector(targetId) : null;

      setActiveNavLink(targetId);

      navLinks.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");

      if (!targetElement) return;

      event.preventDefault();

      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 0;
      const extraSpace = 18;
      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight -
        extraSpace;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });
}

function setActiveNavLink(targetId) {
  navLinkItems.forEach((navLink) => {
    navLink.classList.toggle("active", navLink.getAttribute("href") === targetId);
  });
}

function updateActiveSection() {
  if (navLinkItems.length === 0) return;

  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.offsetHeight : 0;
  const sectionOffset = headerHeight + 80;
  let activeId = "";

  navLinkItems.forEach((link) => {
    const targetId = link.getAttribute("href");
    const section = targetId ? document.querySelector(targetId) : null;

    if (!section) return;

    if (section.getBoundingClientRect().top <= sectionOffset) {
      activeId = targetId;
    }
  });

  if (activeId) {
    setActiveNavLink(activeId);
  }
}

window.addEventListener("scroll", updateActiveSection);
window.addEventListener("load", updateActiveSection);


// ---------- Dark Mode Toggle ----------
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDarkMode = document.body.classList.contains("dark");

    if (isDarkMode) {
      themeToggle.textContent = "Light";
    } else {
      themeToggle.textContent = "Dark";
    }
  });
}


// ---------- Typing Animation ----------
const typingText = document.getElementById("typingText");

const words = [
  "C++, HTML, CSS, and JavaScript.",
  "Python, Java, and C#.",
  "responsive websites.",
  "software fundamentals.",
  "organized GitHub projects.",
  "problem solving through programming.",
  "AI-assisted learning and debugging."
];

let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typingText) return;

  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingText.textContent = currentWord.substring(0, letterIndex - 1);
    letterIndex--;
  } else {
    typingText.textContent = currentWord.substring(0, letterIndex + 1);
    letterIndex++;
  }

  let typingSpeed = isDeleting ? 55 : 95;

  if (!isDeleting && letterIndex === currentWord.length) {
    typingSpeed = 1300;
    isDeleting = true;
  }

  if (isDeleting && letterIndex === 0) {
    isDeleting = false;
    wordIndex++;

    if (wordIndex === words.length) {
      wordIndex = 0;
    }

    typingSpeed = 350;
  }

  setTimeout(typeEffect, typingSpeed);
}

typeEffect();


// ---------- Section Reveal On Scroll ----------
function initializeScrollReveal() {
  const revealSelectors = [
    ".hero-content",
    ".featured-project-card",
    ".section-heading",
    ".about-grid > *",
    ".skill-card",
    ".experience-card",
    ".learning-card",
    ".projects-preview-section > *",
    ".resume-section > *",
    ".contact-grid > *"
  ];

  const revealTargets = [
    ...new Set(
      revealSelectors.flatMap((selector) =>
        Array.from(document.querySelectorAll(selector))
      )
    )
  ];

  if (revealTargets.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");

    if (target.matches(".hero-content")) {
      target.classList.add("reveal-from-left");
    }

    if (target.matches(".featured-project-card")) {
      target.classList.add("reveal-from-right");
    }

    const parent = target.parentElement;

    if (!parent) return;

    const siblingTargets = Array.from(parent.children).filter((child) =>
      child.matches(
        ".about-grid > *, .skill-card, .experience-card, .learning-card, .projects-preview-section > *, .resume-section > *, .contact-grid > *"
      )
    );

    const siblingIndex = siblingTargets.indexOf(target);

    if (siblingIndex >= 0) {
      target.style.transitionDelay = `${Math.min(siblingIndex * 90, 360)}ms`;
    }
  });

  function showAllRevealTargets() {
    revealTargets.forEach((target) => {
      target.classList.add("is-visible");
      target.style.transitionDelay = "0ms";
    });
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    showAllRevealTargets();
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

initializeScrollReveal();


// ---------- Project Library Overlay ----------
const projectOverlay = document.getElementById("projectOverlay");
const projectBackdrop = document.getElementById("projectBackdrop");
const closeProjects = document.getElementById("closeProjects");
const openProjectsHero = document.getElementById("openProjectsHero");
const openProjectsSection = document.getElementById("openProjectsSection");
const projectGrid = document.getElementById("projectGrid");
const sortDropdown = document.getElementById("sortDropdown");
const sortButton = document.getElementById("sortButton");
const sortOptions = document.querySelectorAll(".sort-option");
const projectListView = document.getElementById("projectListView");
const projectDetailView = document.getElementById("projectDetailView");
const projectDetailContent = document.getElementById("projectDetailContent");
const backToProjects = document.getElementById("backToProjects");
const noProjectsMessage = document.getElementById("noProjectsMessage");
const featuredProjectCard = document.querySelector(".featured-project-card");
const featuredProjectImage = document.getElementById("featuredProjectImage");
const featuredProjectMeta = document.getElementById("featuredProjectMeta");
const featuredProjectTitle = document.getElementById("featuredProjectTitle");
const featuredProjectDescription = document.getElementById("featuredProjectDescription");
const featuredProjectDetails = document.getElementById("featuredProjectDetails");
const slideCount = document.getElementById("slideCount");
const prevProject = document.getElementById("prevProject");
const nextProject = document.getElementById("nextProject");
const sliderDots = document.getElementById("sliderDots");

let currentProjectSort = "uploaded-newest";
let featuredProjectIndex = 0;
let featuredProjectTimer;

function openProjectLibrary() {
  if (!projectOverlay) return;

  projectOverlay.classList.add("show");
  projectOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");

  showProjectList();
  displayProjects(getSortedProjects());
}

function closeProjectLibrary() {
  if (!projectOverlay) return;

  projectOverlay.classList.remove("show");
  projectOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  closeSortMenu();
  showProjectList();
}

function getSortedProjects() {
  if (typeof projects === "undefined") return [];

  const sortValue = currentProjectSort;
  const sortedProjects = [...projects];

  if (sortValue === "uploaded-oldest") {
    sortedProjects.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
  } else if (sortValue === "type") {
    sortedProjects.sort((a, b) => {
      const typeCompare = a.typeLabel.localeCompare(b.typeLabel);

      if (typeCompare !== 0) {
        return typeCompare;
      }

      return a.title.localeCompare(b.title);
    });
  } else if (sortValue === "size-largest") {
    sortedProjects.sort((a, b) => b.fileSizeKb - a.fileSizeKb);
  } else if (sortValue === "size-smallest") {
    sortedProjects.sort((a, b) => a.fileSizeKb - b.fileSizeKb);
  } else {
    sortedProjects.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }

  return sortedProjects;
}

function displayProjects(projectList) {
  if (!projectGrid) return;

  projectGrid.innerHTML = "";

  if (noProjectsMessage) {
    noProjectsMessage.style.display = projectList.length === 0 ? "block" : "none";
  }

  projectList.forEach((project) => {
    const projectCard = document.createElement("article");

    projectCard.classList.add("project-card");

    projectCard.innerHTML = `
      <div class="project-image">
        <img
          src="${project.image}"
          alt="Screenshot for ${project.title}"
          onerror="this.style.display='none'"
        >
      </div>

      <div class="project-topline">
        <span>${project.typeLabel}</span>
        <span>${project.fileSizeLabel}</span>
      </div>

      <h3>${project.title}</h3>

      <p class="project-date">Uploaded: ${project.uploadedLabel}</p>

      <p>${project.description}</p>

      <div class="learned-preview">
        <strong>What I learned:</strong>
        <p>${project.learned}</p>
      </div>

      <div class="project-tags">
        ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>

      <div class="project-actions">
        <button class="button primary-button project-detail-button" type="button" data-project-title="${project.title}">View Details</button>
        <a href="${project.githubLink}" class="text-link">GitHub</a>
      </div>
    `;

    projectGrid.appendChild(projectCard);
  });
}

function updateFeaturedProject(index) {
  if (
    typeof projects === "undefined" ||
    projects.length === 0 ||
    !featuredProjectCard ||
    !featuredProjectImage ||
    !featuredProjectMeta ||
    !featuredProjectTitle ||
    !featuredProjectDescription ||
    !slideCount
  ) {
    return;
  }

  featuredProjectIndex = (index + projects.length) % projects.length;
  const project = projects[featuredProjectIndex];

  featuredProjectCard.classList.add("changing");

  window.setTimeout(() => {
    featuredProjectImage.src = project.image;
    featuredProjectImage.alt = `${project.title} preview`;
    featuredProjectMeta.textContent = `${project.typeLabel} - ${project.fileSizeLabel}`;
    featuredProjectTitle.textContent = project.title;
    featuredProjectDescription.textContent = project.description;
    slideCount.textContent = `${String(featuredProjectIndex + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;

    document.querySelectorAll(".slider-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === featuredProjectIndex);
    });

    featuredProjectCard.classList.remove("changing");
  }, 180);
}

function startFeaturedProjectTimer() {
  window.clearInterval(featuredProjectTimer);
  featuredProjectTimer = window.setInterval(() => {
    updateFeaturedProject(featuredProjectIndex + 1);
  }, 5000);
}

function initializeFeaturedProjects() {
  if (
    typeof projects === "undefined" ||
    projects.length === 0 ||
    !sliderDots ||
    !featuredProjectDetails
  ) {
    return;
  }

  sliderDots.innerHTML = "";

  projects.forEach((project, index) => {
    const dot = document.createElement("button");

    dot.className = "slider-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show ${project.title}`);

    dot.addEventListener("click", () => {
      updateFeaturedProject(index);
      startFeaturedProjectTimer();
    });

    sliderDots.appendChild(dot);
  });

  updateFeaturedProject(0);
  startFeaturedProjectTimer();
}

function showProjectList() {
  if (!projectListView || !projectDetailView) return;

  projectListView.hidden = false;
  projectDetailView.hidden = true;
}

function showProjectDetail(projectTitle) {
  if (
    typeof projects === "undefined" ||
    !projectListView ||
    !projectDetailView ||
    !projectDetailContent
  ) {
    return;
  }

  const project = projects.find((item) => item.title === projectTitle);

  if (!project) return;

  const featureItems = Array.isArray(project.features) ? project.features : [];
  const mediaItems = Array.isArray(project.media) ? project.media : [];
  const hasDemo = project.demoLink && project.demoLink !== "#";
  const demoIsDownload = project.demoAction === "download";
  const demoLabel =
    project.demoLabel ||
    (demoIsDownload ? "Download Project" : "Open Demo");

  projectListView.hidden = true;
  projectDetailView.hidden = false;

  projectDetailContent.innerHTML = `
    <article class="project-detail-card">
      <div class="project-detail-intro">
        <div>
          <p class="project-date">Uploaded: ${project.uploadedLabel}</p>
          <h3>${project.title}</h3>
          <p>${project.longDescription || project.description}</p>
        </div>

        <div class="project-detail-meta">
          <span>${project.typeLabel}</span>
          <span>${project.fileSizeLabel}</span>
        </div>
      </div>

      <div class="project-detail-section">
        <h4>What I Learned</h4>
        <p>${project.learned}</p>
      </div>

      <div class="project-detail-section">
        <h4>Features / Notes</h4>
        <ul class="detail-list">
          ${featureItems.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </div>

      <div class="project-detail-section">
        <h4>Media</h4>
        <div class="detail-media-grid">
          ${renderProjectMedia(mediaItems)}
        </div>
      </div>

      <div class="project-detail-section demo-panel">
        <h4>Demo</h4>
        <p>${project.demoNote || "Add a demo link when this project is ready."}</p>
        ${
          hasDemo
            ? `<a href="${project.demoLink}" class="button primary-button" ${demoIsDownload ? "download" : 'target="_blank" rel="noopener"'}>${demoLabel}</a>`
            : `<button class="button secondary-button" type="button" disabled>Demo Not Added Yet</button>`
        }
      </div>
    </article>
  `;
}

function renderProjectMedia(mediaItems) {
  if (mediaItems.length === 0) {
    return `<p class="empty-media">Add screenshots, videos, or demo images for this project later.</p>`;
  }

  return mediaItems.map((item) => {
    if (item.type === "video") {
      return `
        <figure class="detail-media-item">
          <video controls src="${item.src}"></video>
          <figcaption>${item.caption || "Project video"}</figcaption>
        </figure>
      `;
    }

    return `
      <figure class="detail-media-item">
        <img src="${item.src}" alt="${item.caption || "Project screenshot"}" onerror="this.style.display='none'">
        <figcaption>${item.caption || "Project screenshot"}</figcaption>
      </figure>
    `;
  }).join("");
}

function toggleSortMenu() {
  if (!sortDropdown || !sortButton) return;

  const menuIsOpen = sortDropdown.classList.toggle("open");
  sortButton.setAttribute("aria-expanded", menuIsOpen);
}

function closeSortMenu() {
  if (!sortDropdown || !sortButton) return;

  sortDropdown.classList.remove("open");
  sortButton.setAttribute("aria-expanded", "false");
}

if (openProjectsHero) {
  openProjectsHero.addEventListener("click", openProjectLibrary);
}

if (openProjectsSection) {
  openProjectsSection.addEventListener("click", openProjectLibrary);
}

if (prevProject) {
  prevProject.addEventListener("click", () => {
    updateFeaturedProject(featuredProjectIndex - 1);
    startFeaturedProjectTimer();
  });
}

if (nextProject) {
  nextProject.addEventListener("click", () => {
    updateFeaturedProject(featuredProjectIndex + 1);
    startFeaturedProjectTimer();
  });
}

if (featuredProjectDetails) {
  featuredProjectDetails.addEventListener("click", () => {
    if (typeof projects === "undefined" || projects.length === 0) return;

    openProjectLibrary();
    showProjectDetail(projects[featuredProjectIndex].title);
  });
}

if (closeProjects) {
  closeProjects.addEventListener("click", closeProjectLibrary);
}

if (projectBackdrop) {
  projectBackdrop.addEventListener("click", closeProjectLibrary);
}

if (sortButton) {
  sortButton.addEventListener("click", toggleSortMenu);
}

sortOptions.forEach((option) => {
  option.addEventListener("click", () => {
    currentProjectSort = option.dataset.sort;

    if (sortButton) {
      sortButton.textContent = option.textContent.trim();
    }

    sortOptions.forEach((item) => item.classList.remove("active"));
    option.classList.add("active");
    closeSortMenu();
    displayProjects(getSortedProjects());
  });
});

if (projectGrid) {
  projectGrid.addEventListener("click", (event) => {
    const detailButton = event.target.closest(".project-detail-button");

    if (!detailButton) return;

    showProjectDetail(detailButton.dataset.projectTitle);
  });
}

if (backToProjects) {
  backToProjects.addEventListener("click", showProjectList);
}

initializeFeaturedProjects();

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (sortDropdown && sortDropdown.classList.contains("open")) {
    closeSortMenu();
    return;
  }

  closeProjectLibrary();
});

document.addEventListener("click", (event) => {
  if (!sortDropdown || sortDropdown.contains(event.target)) {
    return;
  }

  closeSortMenu();
});


// ---------- Contact Form Validation ----------
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    let formIsValid = true;

    clearError(nameInput);
    clearError(emailInput);
    clearError(messageInput);

    if (formSuccess) {
      formSuccess.style.display = "none";
    }

    if (nameInput.value.trim() === "") {
      showError(nameInput, "Please enter your name.");
      formIsValid = false;
    }

    if (emailInput.value.trim() === "") {
      showError(emailInput, "Please enter your email address.");
      formIsValid = false;
    } else if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
      showError(emailInput, "Please enter a valid email address.");
      formIsValid = false;
    }

    if (messageInput.value.trim() === "") {
      showError(messageInput, "Please enter a message.");
      formIsValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, "Your message should be at least 10 characters long.");
      formIsValid = false;
    }

    if (formIsValid) {
      const subject = encodeURIComponent(`Portfolio message from ${nameInput.value.trim()}`);
      const body = encodeURIComponent(
        `Name: ${nameInput.value.trim()}\n` +
        `Email: ${emailInput.value.trim()}\n\n` +
        `${messageInput.value.trim()}`
      );

      window.location.href = `mailto:2025rdbemis@gmail.com?subject=${subject}&body=${body}`;

      if (formSuccess) {
        formSuccess.style.display = "block";
      }

      contactForm.reset();
    }
  });
}

function showError(input, message) {
  if (!input) return;

  const errorMessage = input.parentElement.querySelector(".error-message");

  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

function clearError(input) {
  if (!input) return;

  const errorMessage = input.parentElement.querySelector(".error-message");

  if (errorMessage) {
    errorMessage.textContent = "";
  }
}
