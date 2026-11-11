// One place to call the Flask backend from LabRats pages. Uses the shared OCS config
// (pythonURI, fetchOptions with credentials) so the sign-in cookie travels with each request.
import { pythonURI, fetchOptions } from "../../api/config.js";

export class BackendUnavailableError extends Error {}

// Returns { ok, status, data }. Throws BackendUnavailableError when the server can't be reached,
// so pages can show a "try again or call" message instead of a misleading field error.
export async function apiRequest(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${pythonURI}${path}`, {
      ...fetchOptions,
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new BackendUnavailableError(`Could not reach ${path}: ${error.message}`);
  }
  const data = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}
