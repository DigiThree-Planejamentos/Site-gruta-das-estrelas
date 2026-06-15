(function () {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const firstNavLink = nav ? nav.querySelector("a") : null;
  const headerWave = header ? header.querySelector(".header-wave") : null;
  const config = window.GRUTA_CONFIG || {};

  function updateHeaderWave() {
    if (!headerWave || !firstNavLink) return;

    if (window.matchMedia("(max-width: 980px)").matches) {
      headerWave.style.width = "";
      headerWave.style.setProperty("--header-boat-left", "");
      return;
    }

    const waveLeft = headerWave.getBoundingClientRect().left;
    const navStart = firstNavLink.getBoundingClientRect().left;
    const maxWidth = Math.max(0, navStart - waveLeft);
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    const boatTravel = Math.max(0, maxWidth - 15);

    headerWave.style.width = `${maxWidth}px`;
    headerWave.style.setProperty("--header-boat-left", `${boatTravel * progress}px`);
  }

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
    updateHeaderWave();
  }

  function buildWhatsAppUrl(message) {
    const number = config.WHATSAPP_NUMBER || "5524993056663";
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  const suites = [
    {
      name: "Brisa do Mar",
      profile: "Aconchegante",
      description: "Suíte acolhedora para quem quer acordar perto da brisa e do ritmo calmo da Ilha Grande.",
      attributes: ["Vista para o ambiente natural", "Café da manhã incluso", "Banheiro privativo", "Ideal para casal"],
      image: "assets/img/suite-brisa-do-mar-placeholder.svg",
      whatsappMessage: "Olá! Quero consultar disponibilidade da suíte Brisa do Mar."
    },
    {
      name: "Canto dos Caranguejos",
      profile: "Próxima à natureza",
      description: "Uma opção charmosa para descansar depois de um dia de mar, trilhas e gastronomia.",
      attributes: ["Ambiente aconchegante", "Café da manhã incluso", "Banheiro privativo", "Próxima à natureza"],
      image: "assets/img/suite-canto-dos-caranguejos-placeholder.svg",
      whatsappMessage: "Olá! Quero consultar disponibilidade da suíte Canto dos Caranguejos."
    },
    {
      name: "Horizonte Verde",
      profile: "Vista para o verde",
      description: "Suíte para contemplar a mata e aproveitar uma estadia tranquila no Saco do Céu.",
      attributes: ["Vista para o verde", "Café da manhã incluso", "Banheiro privativo", "Atmosfera relaxante"],
      image: "assets/img/suite-horizonte-verde-placeholder.svg",
      whatsappMessage: "Olá! Quero consultar disponibilidade da suíte Horizonte Verde."
    },
    {
      name: "Céu da Ilha",
      profile: "Intimista",
      description: "Hospedagem pensada para dias especiais, com atmosfera intimista e contato com a natureza.",
      attributes: ["Ambiente reservado", "Café da manhã incluso", "Banheiro privativo", "Ideal para descanso"],
      image: "assets/img/suite-ceu-da-ilha-placeholder.svg",
      whatsappMessage: "Olá! Quero consultar disponibilidade da suíte Céu da Ilha."
    },
    {
      name: "Flor da Ilha",
      profile: "Confortável",
      description: "Suíte leve e confortável para relaxar com praticidade durante a estadia na Ilha Grande.",
      attributes: ["Conforto", "Wi-Fi", "Café da manhã incluso", "Banheiro privativo"],
      image: "assets/img/suite-flor-da-ilha-placeholder.svg",
      whatsappMessage: "Olá! Quero consultar disponibilidade da suíte Flor da Ilha."
    },
    {
      name: "Florescer",
      profile: "Privativa",
      description: "Uma suíte para quem procura descanso, privacidade e dias de conexão com a ilha.",
      attributes: ["Privacidade", "Café da manhã incluso", "Ar-condicionado", "Banheiro privativo"],
      image: "assets/img/suite-florescer-placeholder.svg",
      whatsappMessage: "Olá! Quero consultar disponibilidade da suíte Florescer."
    }
  ];

  function setupSuiteExplorer() {
    const explorer = document.querySelector("[data-suite-explorer]");
    if (!explorer) return;

    const list = explorer.querySelector("[data-suite-list]");
    const panel = explorer.querySelector("[data-suite-panel]");
    const image = explorer.querySelector("[data-suite-image]");
    const name = explorer.querySelector("[data-suite-name]");
    const description = explorer.querySelector("[data-suite-description]");
    const attributes = explorer.querySelector("[data-suite-attributes]");
    const cta = explorer.querySelector("[data-suite-cta]");

    if (!list || !panel || !image || !name || !description || !attributes || !cta) return;

    let activeIndex = 0;
    function renderSuite(index, animate = true) {
      const suite = suites[index];
      if (!suite) return;

      activeIndex = index;

      if (animate) {
        panel.classList.remove("is-sliding-in");
        void panel.offsetWidth;
      }

      image.src = suite.image;
      image.alt = `Placeholder da suíte ${suite.name}`;
      name.textContent = suite.name;
      description.textContent = suite.description;
      attributes.replaceChildren(
        ...suite.attributes.map((attribute) => {
          const item = document.createElement("li");
          item.textContent = attribute;
          return item;
        })
      );

      const message = suite.whatsappMessage;
      cta.dataset.message = message;
      cta.href = buildWhatsAppUrl(message);

      list.querySelectorAll("button").forEach((button, buttonIndex) => {
        const isActive = buttonIndex === activeIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
        button.tabIndex = isActive ? 0 : -1;
      });

      if (animate) {
        void panel.offsetWidth;
        panel.classList.add("is-sliding-in");
      }
    }

    suites.forEach((suite, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "suite-detail-panel");
      button.setAttribute("aria-selected", String(index === activeIndex));
      button.setAttribute("aria-label", `${suite.name}, perfil ${suite.profile}`);
      button.classList.toggle("is-active", index === activeIndex);
      button.tabIndex = index === activeIndex ? 0 : -1;

      const suiteName = document.createElement("span");
      suiteName.className = "suite-row__name";
      suiteName.textContent = suite.name;

      const suiteProfile = document.createElement("span");
      suiteProfile.className = "suite-row__profile";
      suiteProfile.textContent = suite.profile;

      button.append(suiteName, suiteProfile);
      button.addEventListener("click", () => renderSuite(index));
      button.addEventListener("keydown", (event) => {
        if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();

        const nextIndex =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? suites.length - 1
              : event.key === "ArrowUp" || event.key === "ArrowLeft"
                ? (activeIndex - 1 + suites.length) % suites.length
                : (activeIndex + 1) % suites.length;

        renderSuite(nextIndex);
        list.querySelectorAll("button")[nextIndex].focus();
      });
      list.appendChild(button);
    });

    renderSuite(0, false);
  }

  function setupSuiteReveal() {
    const suitesSection = document.querySelector(".suites");
    if (!suitesSection) return;

    if (!suitesSection.classList.contains("is-reveal-ready")) {
      suitesSection.classList.add("is-reveal-ready");
    }
    let revealTimer;

    function revealSection() {
      window.clearTimeout(revealTimer);
      suitesSection.classList.remove("is-revealed", "is-revealing");
      void suitesSection.offsetWidth;
      suitesSection.classList.add("is-revealing");
      revealTimer = window.setTimeout(() => {
        suitesSection.classList.remove("is-revealing");
        suitesSection.classList.add("is-revealed");
      }, 2400);
    }

    if (!("IntersectionObserver" in window)) {
      revealSection();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealSection();
        });
      },
      {
        rootMargin: "0px 0px -15% 0px",
        threshold: 0.2
      }
    );

    observer.observe(suitesSection);
  }

  function setupRestaurantReveal() {
    const restaurantSection = document.querySelector("#restaurante.restaurant-section");
    if (!restaurantSection) return;

    if (!restaurantSection.classList.contains("is-reveal-ready")) {
      restaurantSection.classList.add("is-reveal-ready");
    }

    if (!("IntersectionObserver" in window)) {
      restaurantSection.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          restaurantSection.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.25
      }
    );

    observer.observe(restaurantSection);
  }

  function setupAboutReveal() {
    const aboutSection = document.querySelector("#sobre.about-section");
    if (!aboutSection) return;

    if (!("IntersectionObserver" in window)) {
      aboutSection.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          aboutSection.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.25
      }
    );

    observer.observe(aboutSection);
  }

  function setupPackagesReveal() {
    const packagesSection = document.querySelector("#pacotes.packages-section");
    if (!packagesSection) return;

    if (!("IntersectionObserver" in window)) {
      packagesSection.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          packagesSection.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.22
      }
    );

    observer.observe(packagesSection);
  }

  function setupExperienceCarousels() {
    document.querySelectorAll(".experience-carousel").forEach((carousel) => {
      const track = carousel.querySelector(".experience-carousel__track");
      const slides = carousel.querySelectorAll("img");
      const prev = carousel.querySelector(".experience-carousel__control--prev");
      const next = carousel.querySelector(".experience-carousel__control--next");

      if (!track || slides.length < 2 || !prev || !next) return;

      let activeIndex = 0;
      carousel.classList.add("is-controlled");

      function renderSlide() {
        track.style.transform = `translateX(-${activeIndex * 25}%)`;
      }

      prev.addEventListener("click", () => {
        activeIndex = (activeIndex - 1 + slides.length) % slides.length;
        renderSlide();
      });

      next.addEventListener("click", () => {
        activeIndex = (activeIndex + 1) % slides.length;
        renderSlide();
      });
    });
  }

  function setupGalleryCarousel() {
    const carousel = document.querySelector("[data-gallery-carousel]");
    if (!carousel) return;

    const track = carousel.querySelector("[data-gallery-track]");
    const prevButton = carousel.querySelector("[data-gallery-prev]");
    const nextButton = carousel.querySelector("[data-gallery-next]");
    const dotsContainer = carousel.querySelector("[data-gallery-dots]");
    const slides = track ? Array.from(track.querySelectorAll("img")) : [];

    if (!track || slides.length < 2) return;

    let activeIndex = 0;

    function render() {
      track.style.transform = `translateX(-${activeIndex * 100}%)`;

      if (!dotsContainer) return;
      dotsContainer.querySelectorAll("button").forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
        dot.tabIndex = isActive ? 0 : -1;
      });
    }

    function goTo(index) {
      activeIndex = (index + slides.length) % slides.length;
      render();
    }

    if (dotsContainer) {
      slides.forEach((slide, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Ver foto ${index + 1}`);
        dot.addEventListener("click", () => goTo(index));
        dotsContainer.appendChild(dot);
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => goTo(activeIndex - 1));
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => goTo(activeIndex + 1));
    }

    render();
  }

  function setupExperienceScroller() {
    const shell = document.querySelector(".structure-carousel-shell");
    if (!shell) return;

    const track = shell.querySelector(".structure-grid");
    const prev = shell.querySelector(".structure-scroll-control--prev");
    const next = shell.querySelector(".structure-scroll-control--next");

    if (!track || !prev || !next) return;

    function getScrollAmount() {
      const firstItem = track.querySelector(".structure-item");
      if (!firstItem) return track.clientWidth * 0.8;

      const trackStyles = window.getComputedStyle(track);
      const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
      return firstItem.getBoundingClientRect().width + gap;
    }

    function updateControls() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maxScroll - 2;
    }

    prev.addEventListener("click", () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    next.addEventListener("click", () => {
      track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    updateControls();
  }

  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    const message = link.dataset.message || "Olá! Vim pelo site do Gruta das Estrelas.";
    link.setAttribute("href", buildWhatsAppUrl(message));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  setupSuiteExplorer();
  setupSuiteReveal();
  setupRestaurantReveal();
  setupAboutReveal();
  setupPackagesReveal();
  setupExperienceCarousels();
  setupExperienceScroller();
  setupGalleryCarousel();

  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", updateHeaderWave);
  window.addEventListener("load", updateHeaderWave);
  updateHeader();

  if (menuToggle && header) {
    menuToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (nav && header && menuToggle) {
    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        header.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
