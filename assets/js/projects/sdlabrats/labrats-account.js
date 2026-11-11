// /account/: a signed-in student's open assignments, with a turn-in form for each.
import { baseurl } from "../../api/config.js";
import { apiRequest, BackendUnavailableError } from "./labrats-api.js";
import { getCurrentUser, initSignOutButtons } from "./labrats-auth.js";
import { describeDue, describeTurnIn, formatDateTime } from "./labrats-session-rules.js";
import { el, emptyState } from "./labrats-dom.js";

const root = document.querySelector("[data-labrats-account]");
const list = root.querySelector("[data-labrats-assignments]");
const errorBox = root.querySelector("[data-labrats-account-error]");
const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function turnInForm(assignment) {
  const id = `turnin-${assignment.id}`;
  const previous = assignment.my_turnin;
  const status = el("p", { class: "labrats__form-status", role: "status", "aria-live": "polite" });
  const responseError = el("p", { class: "labrats__field-error", id: `${id}-response-error`, hidden: true });
  const linkError = el("p", { class: "labrats__field-error", id: `${id}-link-error`, hidden: true });
  const response = el("textarea", {
    class: "ocs__input", id: `${id}-response`, name: "response", rows: 5, maxlength: 5000,
    "aria-describedby": `${id}-response-error`,
  }, previous ? previous.response : "");
  const link = el("input", {
    class: "ocs__input", id: `${id}-link`, name: "link", type: "url", maxlength: 500,
    placeholder: "https://", value: previous && previous.link ? previous.link : "",
    "aria-describedby": `${id}-link-hint ${id}-link-error`,
  });
  const button = el("button", { class: "ocs__btn signal fill", type: "submit" }, previous ? "Turn in again" : "Turn in");

  const form = el("form", { class: "labrats__form", novalidate: true },
    el("div", { class: "labrats__form-grid" },
      el("div", { class: "labrats__field labrats__field--wide" },
        el("label", { for: response.id }, "Your work"), response, responseError),
      el("div", { class: "labrats__field labrats__field--wide" },
        el("label", { for: link.id }, "Link to a photo or file ", el("span", { class: "labrats__required" }, "optional")),
        el("p", { class: "labrats__hint", id: `${id}-link-hint` }, "For example a shared Google Drive photo of your project."),
        link, linkError)),
    el("div", { class: "labrats__form-actions" }, button, status));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    [responseError, linkError].forEach((node) => { node.hidden = true; });
    button.disabled = true;
    status.dataset.state = "pending";
    status.textContent = "Turning in...";
    try {
      const result = await apiRequest(`/api/labrats/assignments/${assignment.id}/turnin`, {
        method: "PUT", body: { response: response.value, link: link.value },
      });
      if (result.status === 400 && result.data?.errors) {
        for (const [field, message] of Object.entries(result.data.errors)) {
          const target = field === "link" ? linkError : responseError;
          target.textContent = message;
          target.hidden = false;
        }
        status.dataset.state = "error";
        status.textContent = "Please fix the highlighted fields.";
        return;
      }
      if (!result.ok) throw new Error(result.data?.message || `Turn-in failed (${result.status})`);
      await render();
    } catch (error) {
      status.dataset.state = "error";
      status.textContent = error instanceof BackendUnavailableError
        ? "We couldn't reach LabRats right now. Your work wasn't sent; please try again."
        : error.message;
    } finally {
      button.disabled = false;
    }
  });
  return form;
}

function assignmentCard(assignment) {
  const turnin = describeTurnIn(assignment.my_turnin);
  return el("article", { class: "labrats__assignment", dataset: { state: turnin.state } },
    el("div", { class: "labrats__session-head" },
      el("h2", {}, assignment.title),
      el("span", { class: "labrats__grade" }, turnin.label)),
    el("p", { class: "labrats__meta" }, describeDue(assignment.due_date, today)),
    el("p", { class: "labrats__assignment-instructions" }, assignment.instructions),
    assignment.my_turnin?.feedback
      ? el("div", { class: "labrats__notice" },
        el("p", {}, el("strong", {}, "Feedback from LabRats: "), assignment.my_turnin.feedback),
        assignment.my_turnin.reviewed_at ? el("p", { class: "labrats__hint" }, formatDateTime(assignment.my_turnin.reviewed_at)) : null)
      : null,
    turnInForm(assignment));
}

async function render() {
  const { ok, data, status } = await apiRequest("/api/labrats/assignments");
  if (!ok) {
    showError(status === 401 ? "Your sign-in expired. Please sign in again." : "We couldn't load your assignments.");
    return;
  }
  list.replaceChildren(...(data.length
    ? data.map(assignmentCard)
    : [emptyState("No assignments are open right now. Check back after your next class.")]));
}

async function start() {
  initSignOutButtons(root);
  try {
    const user = await getCurrentUser();
    root.querySelector("[data-labrats-loading]").hidden = true;
    if (!user) {
      window.location.replace(`${baseurl}/sign-in/?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    root.querySelector("[data-labrats-user-name]").textContent = user.name;
    root.querySelector("[data-labrats-account-header]").hidden = false;
    await render();
  } catch (error) {
    if (!(error instanceof BackendUnavailableError)) throw error;
    root.querySelector("[data-labrats-loading]").hidden = true;
    showError("We couldn't reach LabRats right now. Please try again later.");
  }
}

start();
