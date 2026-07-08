// ---------- Mobile Menu ----------
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const menuIsOpen = navLinks.classList.toggle("show");

    menuToggle.setAttribute("aria-expanded", String(menuIsOpen));
    menuToggle.setAttribute(
      "aria-label",
      menuIsOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const targetElement = targetId ? document.querySelector(targetId) : null;

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


// ---------- Dark Mode Toggle ----------
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDarkMode = document.body.classList.contains("dark");
    themeToggle.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
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
    wordIndex = (wordIndex + 1) % words.length;
    typingSpeed = 350;
  }

  setTimeout(typeEffect, typingSpeed);
}

typeEffect();


// ---------- Active Navigation Highlight ----------
const navLinkItems = document.querySelectorAll(".nav-links a");
const pageSections = [...navLinkItems]
  .map((link) => {
    const id = link.getAttribute("href");
    return id && id.startsWith("#") ? document.querySelector(id) : null;
  })
  .filter(Boolean);

function setActiveNavLink(sectionId) {
  navLinkItems.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("active", isActive);
  });
}

if (pageSections.length > 0 && "IntersectionObserver" in window) {
  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length === 0) return;

      setActiveNavLink(visibleEntries[0].target.id);
    },
    {
      threshold: [0.18, 0.35, 0.55],
      rootMargin: "-28% 0px -55% 0px"
    }
  );

  pageSections.forEach((section) => activeSectionObserver.observe(section));
}


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

let currentProjectSort = "uploaded-newest";

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

  const sortedProjects = [...projects];

  if (currentProjectSort === "uploaded-oldest") {
    sortedProjects.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
  } else if (currentProjectSort === "type") {
    sortedProjects.sort((a, b) => {
      const typeCompare = a.typeLabel.localeCompare(b.typeLabel);
      return typeCompare !== 0 ? typeCompare : a.title.localeCompare(b.title);
    });
  } else if (currentProjectSort === "size-largest") {
    sortedProjects.sort((a, b) => b.fileSizeKb - a.fileSizeKb);
  } else if (currentProjectSort === "size-smallest") {
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
        <a href="${project.githubLink}" class="text-link" target="_blank" rel="noopener">GitHub</a>
      </div>
    `;

    projectGrid.appendChild(projectCard);
  });
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
  sortButton.setAttribute("aria-expanded", String(menuIsOpen));
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


// ---------- Featured Project Slider ----------
const featuredProjectCard = document.getElementById("featuredProjectCard");
const featuredProjectImage = document.getElementById("featuredProjectImage");
const featuredProjectCounter = document.getElementById("featuredProjectCounter");
const featuredProjectType = document.getElementById("featuredProjectType");
const featuredProjectSize = document.getElementById("featuredProjectSize");
const featuredProjectTitle = document.getElementById("featuredProjectTitle");
const featuredProjectDescription = document.getElementById("featuredProjectDescription");
const featuredProjectDetails = document.getElementById("featuredProjectDetails");
const featuredProjectPrev = document.getElementById("featuredProjectPrev");
const featuredProjectNext = document.getElementById("featuredProjectNext");
const featuredProjectDots = document.getElementById("featuredProjectDots");

let featuredProjectIndex = 0;
let featuredProjectTimer = null;

function getFeaturedProjects() {
  if (typeof projects === "undefined") return [];
  return [...projects].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

function renderFeaturedProject(index) {
  const featuredProjects = getFeaturedProjects();

  if (
    featuredProjects.length === 0 ||
    !featuredProjectCard ||
    !featuredProjectImage ||
    !featuredProjectCounter ||
    !featuredProjectType ||
    !featuredProjectSize ||
    !featuredProjectTitle ||
    !featuredProjectDescription ||
    !featuredProjectDetails ||
    !featuredProjectDots
  ) {
    return;
  }

  featuredProjectIndex =
    (index + featuredProjects.length) % featuredProjects.length;

  const project = featuredProjects[featuredProjectIndex];

  featuredProjectCard.classList.remove("slide-in");
  void featuredProjectCard.offsetWidth;
  featuredProjectCard.classList.add("slide-in");

  featuredProjectImage.src = project.image;
  featuredProjectImage.alt = `${project.title} preview`;
  featuredProjectImage.onerror = () => {
    featuredProjectImage.style.display = "none";
  };
  featuredProjectImage.onload = () => {
    featuredProjectImage.style.display = "block";
  };

  featuredProjectCounter.textContent = `${String(featuredProjectIndex + 1).padStart(2, "0")} / ${String(featuredProjects.length).padStart(2, "0")}`;
  featuredProjectType.textContent = project.typeLabel;
  featuredProjectSize.textContent = project.fileSizeLabel;
  featuredProjectTitle.textContent = project.title;
  featuredProjectDescription.textContent = project.description;
  featuredProjectDetails.dataset.projectTitle = project.title;

  featuredProjectDots.innerHTML = "";

  featuredProjects.forEach((_, dotIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = dotIndex === featuredProjectIndex ? "slider-dot active" : "slider-dot";
    dot.setAttribute("aria-label", `Show project ${dotIndex + 1}`);
    dot.addEventListener("click", () => {
      renderFeaturedProject(dotIndex);
      restartFeaturedProjectTimer();
    });

    featuredProjectDots.appendChild(dot);
  });
}

function moveFeaturedProject(direction) {
  renderFeaturedProject(featuredProjectIndex + direction);
}

function startFeaturedProjectTimer() {
  stopFeaturedProjectTimer();

  featuredProjectTimer = setInterval(() => {
    moveFeaturedProject(1);
  }, 6500);
}

function stopFeaturedProjectTimer() {
  if (!featuredProjectTimer) return;

  clearInterval(featuredProjectTimer);
  featuredProjectTimer = null;
}

function restartFeaturedProjectTimer() {
  startFeaturedProjectTimer();
}

if (featuredProjectCard) {
  renderFeaturedProject(0);
  startFeaturedProjectTimer();

  featuredProjectCard.addEventListener("mouseenter", stopFeaturedProjectTimer);
  featuredProjectCard.addEventListener("mouseleave", startFeaturedProjectTimer);
}

if (featuredProjectPrev) {
  featuredProjectPrev.addEventListener("click", () => {
    moveFeaturedProject(-1);
    restartFeaturedProjectTimer();
  });
}

if (featuredProjectNext) {
  featuredProjectNext.addEventListener("click", () => {
    moveFeaturedProject(1);
    restartFeaturedProjectTimer();
  });
}

if (featuredProjectDetails) {
  featuredProjectDetails.addEventListener("click", () => {
    const projectTitle = featuredProjectDetails.dataset.projectTitle;

    openProjectLibrary();
    showProjectDetail(projectTitle);
  });
}


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

      const gmailUrl =
        `https://mail.google.com/mail/?view=cm&fs=1` +
        `&to=2025rdbemis@gmail.com` +
        `&su=${subject}` +
        `&body=${body}`;

      window.open(gmailUrl, "_blank");

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
