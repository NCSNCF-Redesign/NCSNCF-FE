import { pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

function getAuthToken() {
    return localStorage.getItem('jwt') || 
           sessionStorage.getItem('jwt') || 
           localStorage.getItem('jwt_python_flask') || 
           localStorage.getItem('token');
}

export async function saveCcaePreferences() {
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

    const eventTypes = getCheckedValues('eventTypes');
    const findChannels = getCheckedValues('findChannels');
    const decisionFactors = getCheckedValues('decisionFactors');

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

    const token = getAuthToken();
    const requestOptions = {
        ...fetchOptions,
        method: 'POST',
        headers: {
            ...(fetchOptions?.headers || {}),
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(`${pythonURI}/api/profile/ccae`, requestOptions);
        const data = await response.json().catch(() => ({}));

        if (response.ok) {
            alert("Survey submitted successfully!");
            document.getElementById('ccaeSurveyForm')?.reset();
        } else {
            alert(`Failed to save survey: ${data.message || response.statusText}`);
        }
    } catch (error) {
        console.error("Error submitting survey:", error);
        alert("An error occurred while submitting the survey.");
    }
}

window.saveCcaePreferences = saveCcaePreferences;