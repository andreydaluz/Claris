const leadForm = document.querySelector(".lead-form");
const floatingLead = document.querySelector(".floating-lead");
const floatingLeadToggle = document.querySelector(".floating-lead__toggle");
const whatsappPhone = "5521999999999";

function initTabs() {
  const tabButtons = Array.from(document.querySelectorAll("[data-plan-tab]"));
  const tabPanels = Array.from(document.querySelectorAll("[data-plan-panel]"));

  if (!tabButtons.length || !tabPanels.length) return;

  const activateTab = (tabName) => {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.planTab === tabName;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      if (isActive) {
        button.removeAttribute("tabindex");
      } else {
        button.setAttribute("tabindex", "-1");
      }
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.dataset.planPanel === tabName;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.planTab));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();

      const currentIndex = tabButtons.indexOf(button);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + direction + tabButtons.length) % tabButtons.length;
      tabButtons[nextIndex].focus();
      activateTab(tabButtons[nextIndex].dataset.planTab);
    });
  });
}

function initReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      if (href === "#formulario" && floatingLead && floatingLeadToggle) {
        floatingLead.classList.add("is-open");
        floatingLeadToggle.setAttribute("aria-expanded", "true");
      }
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function initLeadForm() {
  if (!leadForm) return;
  const whatsappInput = leadForm.querySelector('input[name="whatsapp"]');

  whatsappInput?.addEventListener("input", (event) => {
    event.target.value = formatPhone(event.target.value);
  });

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(leadForm);
    const name = String(formData.get("name") || "").trim();
    const whatsapp = String(formData.get("whatsapp") || "").trim();
    const message = `Olá! Meu nome é ${name}. Quero receber detalhes sobre o Claris Casa & Clube. Meu WhatsApp: ${whatsapp}.`;
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener");
    leadForm.reset();
  });
}

function initFloatingLead() {
  if (!floatingLead || !floatingLeadToggle) return;

  floatingLeadToggle.addEventListener("click", () => {
    const isOpen = floatingLead.classList.toggle("is-open");
    floatingLeadToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function initPlanModal() {
  const modal = document.getElementById("plan-modal");
  const title = modal?.querySelector(".plan-modal__title");
  const image = modal?.querySelector("img");
  const closeButton = modal?.querySelector(".plan-modal__close");
  const triggerButtons = document.querySelectorAll(".js-open-modal");

  if (!modal || !title || !image || !closeButton || !triggerButtons.length) return;

  const closeModal = () => {
    if (modal.open) modal.close();
  };

  triggerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalTitle = button.dataset.modalTitle || "Planta ampliada";
      const modalImage = button.dataset.modalImg || "";

      title.textContent = modalTitle;
      image.src = modalImage;
      image.alt = modalTitle;
      modal.showModal();
    });
  });

  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    const dialogDimensions = modal.getBoundingClientRect();
    const clickedOutside =
      event.clientX < dialogDimensions.left ||
      event.clientX > dialogDimensions.right ||
      event.clientY < dialogDimensions.top ||
      event.clientY > dialogDimensions.bottom;
    if (clickedOutside) closeModal();
  });
}

initTabs();
initReveal();
initSmoothScroll();
initLeadForm();
initFloatingLead();
initPlanModal();
