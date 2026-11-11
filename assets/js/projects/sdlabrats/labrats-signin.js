// /sign-in/: show who is signed in, or the sign-in form.
import { getCurrentUser, initSignInForm, initSignOutButtons } from "./labrats-auth.js";
import { BackendUnavailableError } from "./labrats-api.js";

const form = document.querySelector("[data-labrats-signin]");
const signedIn = document.querySelector("[data-labrats-signed-in]");

initSignInForm(form);
initSignOutButtons();

try {
  const user = await getCurrentUser();
  if (user) {
    signedIn.querySelector("[data-labrats-user-name]").textContent = user.name;
    signedIn.querySelector("[data-labrats-admin-link]").hidden = user.role !== "Admin";
    signedIn.hidden = false;
    form.hidden = true;
  }
} catch (error) {
  // The form stays visible; submitting it reports the outage to the person.
  if (!(error instanceof BackendUnavailableError)) throw error;
}
