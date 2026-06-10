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
      "Olá! Vim pelo site da Gruta das Estrelas.",
      `Nome: ${payload.name}`,
      `Interesse: ${payload.interest_type}`
    ];

    if (payload.desired_date) parts.push(`Data desejada: ${payload.desired_date}`);
    if (payload.people_count) parts.push(`Pessoas: ${payload.people_count}`);
    if (payload.message) parts.push(`Mensagem: ${payload.message}`);

    return parts.join("\n");
  }

  function setButtonText(button, text) {
    const label = button.querySelector("span");
    if (label) {
      label.textContent = text;
      return;
    }
    button.textContent = text;
  }

  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    const message = link.dataset.message || "Olá! Vim pelo site da Gruta das Estrelas.";
    link.setAttribute("href", buildWhatsAppUrl(message));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

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
        setButtonText(submitButton, "Enviando...");
        setStatus("success", "Salvando seu interesse...");

        await saveSiteLead(payload);

        setStatus("success", "Interesse salvo. Abrindo WhatsApp para continuar o atendimento.");
        openWhatsApp(buildLeadMessage(payload));
        leadForm.reset();
      } catch (error) {
        setStatus("error", error.message || "Não foi possível enviar. Tente novamente pelo WhatsApp.");
      } finally {
        submitButton.disabled = false;
        setButtonText(submitButton, "Enviar e abrir WhatsApp");
      }
    });
  }
})();
