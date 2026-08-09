import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  const brief = import.meta.env.BEEHIIV_API_KEY ? "configured" : "not_configured";
  const leads = import.meta.env.RESEND_API_KEY ? "configured" : "not_configured";

  return new Response(
    JSON.stringify({ status: "ok", brief, leads }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    }
  );
};
