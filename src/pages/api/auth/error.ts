import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url, redirect }) => {
  const error = url.searchParams.get("error") || "";
  const description = url.searchParams.get("error_description") || "";
  
  const params = new URLSearchParams();
  if (error) params.set("error", error);
  if (description) params.set("error_description", description);

  const query = params.toString();
  return redirect(`/auth/error${query ? `?${query}` : ""}`);
};
