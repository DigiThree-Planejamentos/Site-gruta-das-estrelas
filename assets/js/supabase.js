// Configure estes valores antes do deploy.
// Use somente a anon key pública no frontend. Nunca use service_role aqui.
const SUPABASE_URL = "https://essoicjbsshlqvzqcrsw.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_2WQu7dIOdX5hOyHShn1LrQ_DJrYfSvY";
const CLIENT_ID = "be67a108-32a4-4bd6-82a1-ac71f1b7232e";
const CLIENT_SLUG = "gruta-das-estrelas";
const WHATSAPP_NUMBER = "5524992626383";

window.GRUTA_CONFIG = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  CLIENT_ID,
  CLIENT_SLUG,
  WHATSAPP_NUMBER
};

async function saveSiteLead(payload) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.GRUTA_CONFIG;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes("INSIRA_") || SUPABASE_ANON_KEY.includes("INSIRA_")) {
    throw new Error("Configure SUPABASE_URL e SUPABASE_ANON_KEY em assets/js/supabase.js.");
  }

  const restUrl = SUPABASE_URL.replace(/\/$/, "").replace(/\/rest\/v1$/, "");
  const response = await fetch(`${restUrl}/rest/v1/site_leads`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Não foi possível salvar o lead no Supabase.");
  }
}
