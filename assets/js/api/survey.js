---
---
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

export async function saveNcsncfPreferences() {
    const statusEl = document.getElementById('ncsncfStatus');

    // Helper for status updates
    const showStatus = (msg, isError = false) => {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.style.color = isError ? '#ff4d4d' : '#28a745';
        statusEl.classList.remove('ocs__hidden');
    };

    // Single Select Inputs
    const discovery = document.getElementById('ncsncfDiscovery')?.value || "";
    const frequency = document.getElementById('ncsncfFrequency')?.value || "";
    const connection = document.getElementById('ncsncfConnection')?.value || "Unspecified";
    const mainReason = document.getElementById('ncsncfMainReason')?.value || "";
    const location = document.getElementById('ncsncfLocation')?.value || "Unspecified";
    const improvements = document.getElementById('ncsncfImprovements')?.value || "";
    const browsingPreference = document.getElementById('ncsncfBrowsing')?.value || "Unspecified";
    const designImportance = document.getElementById('ncsncfDesignImportance')?.value || "Unspecified";
    const easeOfUse = document.getElementById('ncsncfEaseOfUse')?.value || "Unspecified";

    // Required fields check
    if (!discovery || !frequency || !mainReason) {
        showStatus("Please answer mandatory questions 1, 2, and 5.", true);
        return;
    }

    const payload = {
        organization: "North County Special Needs Community Foundation",
        discovery_source: discovery,
        visit_frequency: frequency,
        interested_info: getCheckedValues('interestedInfo'),
        community_connection: connection,
        main_reason: mainReason,
        location: location,
        find_methods: getCheckedValues('findMethods'),
        important_info: getCheckedValues('importantInfo'),
        cost_info: getCheckedValues('costInfo'),
        difficulties: getCheckedValues('difficulties'),
        improvements_feedback: improvements,
        useful_features: getCheckedValues('usefulFeatures'),
        browsing_preference: browsingPreference,
        design_importance: designImportance,
        ease_of_use: easeOfUse,
        accessibility_features: getCheckedValues('accessibilityFeatures'),
        learning_pref: getCheckedValues('learningPref'),
        involvement_drivers: getCheckedValues('involvementDrivers')
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
        showStatus("Submitting survey...");
        const response = await fetch(`${pythonURI}/api/profile/ncsncf`, requestOptions);
        const data = await response.json().catch(() => ({}));

        if (response.ok) {
            showStatus("Survey submitted successfully!");
            alert("Survey submitted successfully!");
        } else {
            showStatus(`Failed to save survey: ${data.message || response.statusText}`, true);
        }
    } catch (error) {
        console.error("Error submitting survey:", error);
        showStatus("Network error occurred while submitting survey.", true);
    }
}

window.saveNcsncfPreferences = saveNcsncfPreferences;