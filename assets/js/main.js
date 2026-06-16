(function () {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const firstNavLink = nav ? nav.querySelector("a") : null;
  const headerWave = header ? header.querySelector(".header-wave") : null;
  const config = window.GRUTA_CONFIG || {};
  const suitePrices = window.GRUTA_SUITE_PRICES || [
    { name: "Brisa do Mar", price: "Sob consulta" },
    { name: "Canto dos Caranguejos", price: "Sob consulta" },
    { name: "Horizonte Verde", price: "Sob consulta" },
    { name: "Céu da Ilha", price: "Sob consulta" },
    { name: "Flor da Ilha", price: "Sob consulta" },
    { name: "Florescer", price: "Sob consulta" }
  ];

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

  function setupPackagePrices() {
    document.querySelectorAll("[data-package-prices]").forEach((trigger) => {
      const card = trigger.closest(".package-card");
      const panel = card ? card.querySelector("[data-package-prices-panel]") : null;
      if (!panel) return;

      function renderPanel() {
        if (panel.childElementCount > 0) return;

        const title = document.createElement("p");
        title.className = "package-prices__title";
        title.textContent = "Valores das suítes";

        const list = document.createElement("ul");
        list.className = "package-prices__list";

        suitePrices.forEach((suite) => {
          const item = document.createElement("li");
          item.className = "package-prices__item";

          const name = document.createElement("strong");
          name.textContent = suite.name;

          const price = document.createElement("span");
          price.textContent = suite.price;

          item.append(name, price);
          list.appendChild(item);
        });

        const note = document.createElement("p");
        note.className = "package-prices__note";
        note.textContent = "Valores sujeitos a disponibilidade, temporada e quantidade de pessoas.";

        panel.append(title, list, note);
      }

      trigger.addEventListener("click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        renderPanel();
        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;
      });
    });
  }

  function setupExperienceScroller() {
    const shell = document.querySelector(".structure-carousel-shell");
    if (!shell) return;

    const track = shell.querySelector(".structure-grid");
    if (!track) return;

    const prevButton = shell.querySelector("[data-structure-prev]");
    const nextButton = shell.querySelector("[data-structure-next]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gsap = window.gsap;

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function clamp(value) {
      return Math.min(Math.max(value, 0), maxScroll());
    }

    let target = track.scrollLeft;
    let tween = null;

    function scrollStep() {
      const firstItem = track.querySelector(".structure-item");
      if (!firstItem) return track.clientWidth * 0.8;

      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return firstItem.getBoundingClientRect().width + gap;
    }

    function updateControls() {
      const max = maxScroll();
      const left = tween && tween.isActive() ? target : track.scrollLeft;
      const hasOverflow = max > 1;

      if (prevButton) {
        prevButton.disabled = !hasOverflow || left <= 1;
      }

      if (nextButton) {
        nextButton.disabled = !hasOverflow || left >= max - 1;
      }
    }

    function animateTo(value) {
      target = clamp(value);

      if (!gsap || reduceMotion) {
        if (tween) tween.kill();
        track.scrollLeft = target;
        updateControls();
        return;
      }

      if (tween) tween.kill();
      tween = gsap.to(track, {
        scrollLeft: target,
        duration: 0.6,
        ease: "power3.out",
        overwrite: true,
        onUpdate: updateControls,
        onComplete: updateControls
      });
      updateControls();
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        const base = tween && tween.isActive() ? target : track.scrollLeft;
        animateTo(base - scrollStep());
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        const base = tween && tween.isActive() ? target : track.scrollLeft;
        animateTo(base + scrollStep());
      });
    }

    // Reage à roda do mouse SOMENTE quando o ponteiro está sobre os cards
    // (o listener fica no próprio track). A roda vertical do mouse vira
    // movimento horizontal. Nas pontas, libera o scroll da página.
    track.addEventListener(
      "wheel",
      (event) => {
        const max = maxScroll();
        if (max <= 0) return; // nada para rolar: deixa a página rolar normal

        const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

        // Base do gesto: posição real quando parado, destino do tween quando animando.
        const base = tween && tween.isActive() ? target : track.scrollLeft;
        const atStart = delta < 0 && base <= 0;
        const atEnd = delta > 0 && base >= max;
        if (atStart || atEnd) return; // nas pontas, segue o scroll da página

        event.preventDefault();
        animateTo(base + delta);
      },
      { passive: false }
    );

    // Mantém o alvo sincronizado quando o scroll vem de swipe/teclado.
    track.addEventListener(
      "scroll",
      () => {
        if (!tween || !tween.isActive()) target = track.scrollLeft;
        updateControls();
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      target = clamp(target);
      updateControls();
    });

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
  setupPackagePrices();

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
