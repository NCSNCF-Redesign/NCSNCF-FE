import { pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

// Helper function to extract array of values from checked inputs
function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

export async function saveCcaePreferences() {
    // 1. Collect inputs from DOM
    const discovery = document.getElementById('ccaeDiscovery')?.value || "Unspecified";
    const frequency = document.getElementById('ccaeFrequency')?.value || "Unspecified";
    const companions = document.getElementById('ccaeCompanions')?.value || "Unspecified";
    const mainReason = document.getElementById('ccaeMainReason')?.value || "Unspecified";
    const travelDistance = document.getElementById('ccaeTravelDistance')?.value || "Unspecified";
    const ticketBudget = document.getElementById('ccaeTicketBudget')?.value || "Unspecified";
    const attendanceBarriers = document.getElementById('ccaeAttendanceBarriers')?.value || "Unspecified";
    const improvements = document.getElementById('ccaeImprovements')?.value || "";
    const browsingPreference = document.getElementById('ccaeBrowsingPreference')?.value || "Unspecified";
    const accessibilityImportance = document.getElementById('ccaeAccessibilityImportance')?.value || "Unspecified";

    // Multi-select checkbox arrays
    const eventTypes = getCheckedValues('eventTypes');
    const findChannels = getCheckedValues('findChannels');
    const decisionFactors = getCheckedValues('decisionFactors');

    // 2. Construct Payload
    const payload = {
        organization: "California Center for the Arts, Escondido",
        discovery_source: discovery,
        visit_frequency: frequency,
        event_types_interested: eventTypes,
        attends_with: companions,
        main_reason: mainReason,
        travel_distance: travelDistance,
        discovery_channels: findChannels,
        decision_factors: decisionFactors,
        ticket_budget: ticketBudget,
        attendance_barriers: attendanceBarriers,
        improvements_feedback: improvements,
        browsing_preference: browsingPreference,
        accessibility_importance: accessibilityImportance
    };

    try {
        const response = await fetch(`${pythonURI}/api/profile/ccae`, {
            ...fetchOptions,
            method: 'POST',
            headers: { 
                ...fetchOptions.headers,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Survey submitted successfully!");
            if (typeof loadSurveyResults === 'function') {
                loadSurveyResults();
            }
        } else {
            const errData = await response.json();
            alert(`Failed to save survey: ${errData.message || response.statusText}`);
        }
    } catch (error) {
        console.error("Error submitting survey:", error);
        alert("An error occurred while submitting the survey.");
    }
}

// Attach function to global window scope so HTML buttons/forms can access it
window.saveCcaePreferences = saveCcaePreferences;

// 3. Event Listener to handle "View Survey Results" click in user_management.html
$(document).ready(function() {
    const surveyModalElement = document.getElementById("surveyModal");
    if (!surveyModalElement) return;

    const surveyModal = new bootstrap.Modal(surveyModalElement);

    $(document).on("click", ".view-survey-btn", async function() {
        const uid = $(this).data("uid");
        $("#surveyModalUid").text(uid);
        $("#surveyModalBody").html(`
            <div class="text-center py-4">
                <div class="spinner-border text-info" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `);
        surveyModal.show();

        try {
            const response = await fetch(`${pythonURI}/api/profile/ccae/results`, fetchOptions);
            const data = await response.json();

            // Find entries matching this user or list all entries
            const userResults = data.results ? data.results.filter(r => r.uid === uid || !r.uid) : [];

            if (userResults.length === 0) {
                $("#surveyModalBody").html(`<p class="text-muted">No survey records found for this user.</p>`);
                return;
            }

            let html = `<div class="accordion" id="surveyAccordion">`;
            userResults.forEach((entry, idx) => {
                html += `
                    <div class="accordion-item bg-secondary text-light mb-2 border-0 rounded">
                        <h2 class="accordion-header" id="heading-${idx}">
                            <button class="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${idx}">
                                Response #${idx + 1} &nbsp;<small class="text-muted">(${new Date(entry.submitted_at).toLocaleString()})</small>
                            </button>
                        </h2>
                        <div id="collapse-${idx}" class="accordion-collapse collapse" data-bs-parent="#surveyAccordion">
                            <div class="accordion-body">
                                <p><strong>Discovery Source:</strong> ${entry.discovery_source}</p>
                                <p><strong>Visit Frequency:</strong> ${entry.visit_frequency}</p>
                                <p><strong>Main Reason:</strong> ${entry.main_reason}</p>
                                <p><strong>Travel Distance:</strong> ${entry.travel_distance}</p>
                                <p><strong>Ticket Budget:</strong> ${entry.ticket_budget}</p>
                                <p><strong>Browsing Preference:</strong> ${entry.browsing_preference}</p>
                                <p><strong>Interested Events:</strong> ${Array.isArray(entry.event_types_interested) ? entry.event_types_interested.join(', ') : 'None'}</p>
                                <p><strong>Decision Factors:</strong> ${Array.isArray(entry.decision_factors) ? entry.decision_factors.join(', ') : 'None'}</p>
                                ${entry.improvements_feedback ? `<p><strong>Feedback:</strong> ${entry.improvements_feedback}</p>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
            $("#surveyModalBody").html(html);

        } catch (err) {
            console.error("Error fetching survey modal data:", err);
            $("#surveyModalBody").html(`<p class="text-danger">Failed to load survey responses.</p>`);
        }
    });
});