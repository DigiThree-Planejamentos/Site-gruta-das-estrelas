(function () {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const leadForm = document.querySelector("[data-lead-form]");
  const statusBox = document.querySelector("[data-form-status]");
  const config = window.GRUTA_CONFIG || {};

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  function buildWhatsAppUrl(message) {
    const number = config.WHATSAPP_NUMBER || "5524993056663";
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsApp(message) {
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  function setStatus(type, message) {
    if (!statusBox) return;
    statusBox.className = `form-status is-visible is-${type}`;
    statusBox.textContent = message;
  }

  function getFormPayload(form) {
    const data = new FormData(form);
    const peopleCount = String(data.get("people_count") || "").trim();

    return {
      client_id: config.CLIENT_ID,
      client_slug: config.CLIENT_SLUG || "gruta-das-estrelas",
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim() || null,
      interest_type: String(data.get("interest_type") || "").trim(),
      desired_date: String(data.get("desired_date") || "").trim() || null,
      people_count: peopleCount ? Number(peopleCount) : null,
      message: String(data.get("message") || "").trim() || null,
      source: "site",
      page_url: window.location.href
    };
  }

  function validateLead(payload) {
    if (!payload.name) return "Informe seu nome.";
    if (!payload.phone) return "Informe seu WhatsApp.";
    if (!payload.interest_type) return "Selecione o tipo de interesse.";
    if (payload.people_count !== null && payload.people_count < 1) return "Informe um número de pessoas válido.";
    if (!payload.client_id || String(payload.client_id).includes("INSIRA_")) {
      return "Configure o CLIENT_ID em assets/js/supabase.js.";
    }
    return "";
  }

  function buildLeadMessage(payload) {
    const parts = [
      "Olá! Vim pelo site do Gruta das Estrelas.",
      `Nome: ${payload.name}`,
      `Interesse: ${payload.interest_type}`
    ];

    if (payload.desired_date) parts.push(`Data desejada: ${payload.desired_date}`);
    if (payload.people_count) parts.push(`Pessoas: ${payload.people_count}`);
    if (payload.message) parts.push(`Mensagem: ${payload.message}`);

    return parts.join("\n");
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

  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    const message = link.dataset.message || "Olá! Vim pelo site do Gruta das Estrelas.";
    link.setAttribute("href", buildWhatsAppUrl(message));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  setupSuiteExplorer();
  setupSuiteReveal();

  window.addEventListener("scroll", updateHeader, { passive: true });
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

  if (leadForm) {
    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = leadForm.querySelector("button[type='submit']");
      const payload = getFormPayload(leadForm);
      const validationError = validateLead(payload);

      if (validationError) {
        setStatus("error", validationError);
        return;
      }

      try {
        if (typeof saveSiteLead !== "function") {
          throw new Error("Integração com Supabase indisponível. Verifique assets/js/supabase.js.");
        }

        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        setStatus("success", "Salvando seu interesse...");

        await saveSiteLead(payload);

        setStatus("success", "Interesse salvo. Abrindo WhatsApp para continuar o atendimento.");
        openWhatsApp(buildLeadMessage(payload));
        leadForm.reset();
      } catch (error) {
        setStatus("error", error.message || "Não foi possível enviar. Tente novamente pelo WhatsApp.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar e abrir WhatsApp";
      }
    });
  }
})();
