const navToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const routeTabs = document.querySelectorAll("[data-route]");
const routePanels = document.querySelectorAll("[data-panel]");
const routeSelect = document.querySelector('select[name="route"]');
const routeNames = {
  heritage: "古蜀人文线",
  food: "烟火美食线",
  nature: "山水熊猫线",
};

routeTabs.forEach((tab) => {
  if (!(tab instanceof HTMLButtonElement) || !tab.classList.contains("route-tab")) return;

  tab.addEventListener("click", () => {
    const route = tab.dataset.route;

    routeTabs.forEach((item) => {
      if (item instanceof HTMLButtonElement && item.classList.contains("route-tab")) {
        const isActive = item === tab;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      }
    });

    routePanels.forEach((panel) => {
      const isActive = panel.dataset.panel === route;
      panel.classList.toggle("is-active", isActive);
      panel.toggleAttribute("hidden", !isActive);
    });

    if (routeSelect && route && routeNames[route]) {
      routeSelect.value = routeNames[route];
    }
  });
});

const photoPins = document.querySelectorAll(".photo-pin");
const mapCard = document.querySelector("[data-map-card]");

photoPins.forEach((pin) => {
  pin.addEventListener("click", () => {
    photoPins.forEach((item) => item.classList.remove("is-active"));
    pin.classList.add("is-active");

    if (!mapCard) return;

    const title = pin.dataset.title || "路线节点";
    const route = pin.dataset.route || "成都路线";
    const tip = pin.dataset.tip || "适合加入当天行程。";

    mapCard.innerHTML = `
      <p class="route-label">${route}</p>
      <h3>${title}</h3>
      <p>${tip}</p>
    `;
  });
});

const serviceFilters = document.querySelectorAll(".service-filter");
const serviceCards = document.querySelectorAll(".service-card");

serviceFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const filterValue = filter.dataset.filter || "all";

    serviceFilters.forEach((item) => item.classList.toggle("is-active", item === filter));
    serviceCards.forEach((card) => {
      const categories = card.dataset.category || "";
      const shouldShow = filterValue === "all" || categories.includes(filterValue);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const bookingForm = document.querySelector("[data-booking-form]");
const formResult = document.querySelector("[data-form-result]");
const dateInput = document.querySelector('input[name="date"]');

if (dateInput instanceof HTMLInputElement) {
  dateInput.min = new Date().toISOString().split("T")[0];
}

function setFieldError(field, message) {
  const label = field.closest("label");
  const error = label?.querySelector(".error");
  field.setAttribute("aria-invalid", message ? "true" : "false");
  if (error) error.textContent = message;
}

function validateBooking(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement)) return;

    let message = "";
    if (!field.value.trim()) {
      message = "请填写此项";
    } else if (field.name === "guests") {
      const guests = Number(field.value);
      if (!Number.isFinite(guests) || guests < 1 || guests > 18) {
        message = "人数需在 1-18 人之间";
      }
    }

    setFieldError(field, message);
    if (message) isValid = false;
  });

  return isValid;
}

if (bookingForm instanceof HTMLFormElement) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateBooking(bookingForm)) {
      formResult?.classList.remove("is-visible");
      return;
    }

    const formData = new FormData(bookingForm);
    const name = formData.get("name");
    const contact = formData.get("contact");
    const route = formData.get("route");
    const date = formData.get("date");
    const guests = formData.get("guests");
    const message = formData.get("message") || "暂无补充";

    if (formResult) {
      formResult.textContent = `咨询摘要已生成：\n称呼：${name}\n联系方式：${contact}\n路线：${route}\n日期：${date}\n人数：${guests} 人\n偏好：${message}\n\n请复制以上内容发送给锦官行旅工作室，我们会根据预算与节奏回复方案。`;
      formResult.classList.add("is-visible");
    }
  });

  bookingForm.addEventListener("input", (event) => {
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
      setFieldError(field, "");
    }
  });
}

const accordion = document.querySelector("[data-accordion]");

if (accordion) {
  accordion.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      const icon = button.querySelector("span");
      if (icon) icon.textContent = isExpanded ? "+" : "−";
    });
  });
}

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (!(lightbox instanceof HTMLDialogElement) || !(lightboxImage instanceof HTMLImageElement)) return;

    const fullImage = item.dataset.full;
    const caption = item.dataset.caption || "成都旅行照片";

    lightboxImage.src = fullImage || "";
    lightboxImage.alt = caption;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    lightbox.showModal();
  });
});

lightboxClose?.addEventListener("click", () => {
  if (lightbox instanceof HTMLDialogElement) lightbox.close();
});

if (lightbox instanceof HTMLDialogElement) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
}
