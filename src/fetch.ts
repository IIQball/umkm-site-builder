import { FetchState, sessions, actions, middleware, pages } from "astro/fetch";

export default {
  async fetch(request: Request): Promise<Response> {
    const state = new FetchState(request);
    
    // Initialize sessions handler to fix the router warning
    await sessions(state);
    
    // Initialize actions handler
    const actionResponse = await actions(state);
    if (actionResponse) return actionResponse;
    
    // Initialize middleware handler and continue to page rendering
    const response = await middleware(state, (s) => pages(s));
    return response;
  },
};
