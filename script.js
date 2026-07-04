// ---------- Mobile Menu ----------
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
    });
  });
}


// ---------- Dark Mode Toggle ----------
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDarkMode = document.body.classList.contains("dark");

    if (isDarkMode) {
      themeToggle.textContent = "Light Mode";
    } else {
      themeToggle.textContent = "Dark Mode";
    }
  });
}


// ---------- Typing Animation ----------
const typingText = document.getElementById("typingText");

const words = [
  "Python, Java, and C++.",
  "HTML, CSS, and JavaScript.",
  "TypeScript and modern web tools.",
  "software development fundamentals.",
  "game development concepts.",
  "clean, organized code.",
  "problem solving through programming."
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


// ---------- Create Project Cards ----------
const projectGrid = document.getElementById("projectGrid");

function displayProjects(projectList) {
  if (!projectGrid) return;

  projectGrid.innerHTML = "";

  projectList.forEach((project) => {
    const projectCard = document.createElement("article");

    projectCard.classList.add("project-card");

    projectCard.dataset.type = project.type;
    projectCard.dataset.size = project.size;
    projectCard.dataset.time = project.time;

    projectCard.innerHTML = `
      <div class="project-image">
        <img src="${project.image}" alt="Screenshot for ${project.title}">
      </div>

      <div class="project-topline">
        <span>${project.typeLabel}</span>
        <span>${project.sizeLabel}</span>
      </div>

      <h3>${project.title}</h3>

      <p class="project-date">Created: ${project.date}</p>

      <p>${project.description}</p>

      <div class="learned-preview">
        <strong>What I learned:</strong>
        <p>${project.learned}</p>
      </div>

      <div class="project-tags">
        ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>

      <div class="project-actions">
        <a href="${project.detailPage}" class="button primary-button">View Details</a>
        <a href="${project.demoLink}" class="text-link">Live Demo</a>
        <a href="${project.githubLink}" class="text-link">GitHub</a>
      </div>
    `;

    projectGrid.appendChild(projectCard);
  });
}

if (typeof projects !== "undefined") {
  displayProjects(projects);
}


// ---------- Project Filters ----------
const typeFilter = document.getElementById("typeFilter");
const sizeFilter = document.getElementById("sizeFilter");
const timeFilter = document.getElementById("timeFilter");
const noProjectsMessage = document.getElementById("noProjectsMessage");

function filterProjects() {
  if (typeof projects === "undefined") return;

  const selectedType = typeFilter.value;
  const selectedSize = sizeFilter.value;
  const selectedTime = timeFilter.value;

  const filteredProjects = projects.filter((project) => {
    const matchesType = selectedType === "all" || selectedType === project.type;
    const matchesSize = selectedSize === "all" || selectedSize === project.size;
    const matchesTime = selectedTime === "all" || selectedTime === project.time;

    return matchesType && matchesSize && matchesTime;
  });

  displayProjects(filteredProjects);

  if (noProjectsMessage) {
    if (filteredProjects.length === 0) {
      noProjectsMessage.style.display = "block";
    } else {
      noProjectsMessage.style.display = "none";
    }
  }
}

if (typeFilter && sizeFilter && timeFilter) {
  typeFilter.addEventListener("change", filterProjects);
  sizeFilter.addEventListener("change", filterProjects);
  timeFilter.addEventListener("change", filterProjects);
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