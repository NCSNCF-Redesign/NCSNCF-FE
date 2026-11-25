import { pythonURI, javaURI, fetchOptions } from '../api/config.js';

const FALLBACK_EVENTS = [
  {
    title: "Poway Padres Softball Weekly Practice",
    category: "Athletics",
    date: "Every Saturday, 10:00 AM",
    location: "Poway Community Park",
    capacity: 35
  },
  {
    title: "Monte Vista Housing Project Community Briefing",
    category: "Housing",
    date: "October 18, 2026",
    location: "Poway City Hall / Virtual",
    capacity: 100
  },
  {
    title: "Annual 2-Night Family Caregiver Retreat",
    category: "Community",
    date: "November 14-16, 2026",
    location: "Julian, CA",
    capacity: 20
  },
  {
    title: "NCSNCF Holiday Community Social",
    category: "Social",
    date: "December 19, 2026",
    location: "Old Poway Park",
    capacity: 150
  }
];

async function checkAdminAccess() {
  const toggleBtn = document.getElementById('admin-toggle-btn');
  try {
    const res = await fetch(`${javaURI}/api/person/get`, fetchOptions);
    if (res.ok) {
      const user = await res.json();
      if (user && (user.admin || user.roles?.includes('Admin') || user.uid === 'admin')) {
        if (toggleBtn) toggleBtn.style.display = 'inline-block';
        return;
      }
    }
    if (toggleBtn) toggleBtn.style.display = 'inline-block';
  } catch (e) {
    console.warn("Admin check skipped or endpoint unavailable, keeping toggle visible.");
    if (toggleBtn) toggleBtn.style.display = 'inline-block';
  }
}

window.toggleAdminEditor = function() {
  const editor = document.getElementById('admin-content-editor');
  if (!editor) {
    console.error("Element #admin-content-editor not found!");
    return;
  }
  if (editor.style.display === 'none' || !editor.style.display) {
    editor.style.display = 'block';
    
    const subEl = document.querySelector('.hero-org-name');
    const descEl = document.querySelector('.ocs_description');
    
    if (subEl) document.getElementById('edit-org-subtitle').value = subEl.textContent.trim();
    if (descEl) document.getElementById('edit-hero-desc').value = descEl.textContent.trim();
    
    editor.scrollIntoView({ behavior: 'smooth' });
  } else {
    editor.style.display = 'none';
  }
};

async function loadHomeContent() {
  try {
    const response = await fetch(`${pythonURI}/api/page-content/home`, fetchOptions);
    if (response.ok) {
      const data = await response.json();
      if (data.org_subtitle) {
        document.querySelector('.hero-org-name').textContent = data.org_subtitle;
        const inputSub = document.getElementById('edit-org-subtitle');
        if (inputSub) inputSub.value = data.org_subtitle;
      }
      if (data.hero_desc) {
        document.querySelector('.ocs_description').textContent = data.hero_desc;
        const inputDesc = document.getElementById('edit-hero-desc');
        if (inputDesc) inputDesc.value = data.hero_desc;
      }
    }
  } catch (err) {
    console.log("Using default home content layout.");
  }
}

window.saveHomeContent = async function(event) {
  event.preventDefault();
  const statusEl = document.getElementById('editor-status');
  statusEl.style.color = "#f4e6ce";
  statusEl.textContent = "Saving...";

  const payload = {
    org_subtitle: document.getElementById('edit-org-subtitle').value,
    hero_desc: document.getElementById('edit-hero-desc').value
  };

  try {
    const res = await fetch(`${pythonURI}/api/page-content/home`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Failed to save (${res.status})`);
    
    document.querySelector('.hero-org-name').textContent = payload.org_subtitle;
    document.querySelector('.ocs_description').textContent = payload.hero_desc;

    statusEl.style.color = "#86efac";
    statusEl.textContent = "Saved successfully!";
    setTimeout(() => { statusEl.textContent = ""; }, 3000);
  } catch (err) {
    console.error(err);
    statusEl.style.color = "#fca5a5";
    statusEl.textContent = "Error saving changes.";
  }
};

async function loadRecentEvents() {
  const gridContainer = document.getElementById("recent-events-grid");
  if (!gridContainer) return;

  try {
    const response = await fetch(`${pythonURI}/api/events`, fetchOptions);
    if (!response.ok) throw new Error(`HTTP Error status: ${response.status}`);
    const events = await response.json();
    if (Array.isArray(events) && events.length > 0) {
      renderEvents(events.slice(0, 4));
    } else {
      renderEvents(FALLBACK_EVENTS);
    }
  } catch (error) {
    console.warn("Using fallback events:", error);
    renderEvents(FALLBACK_EVENTS);
  }
}

function renderEvents(list) {
  const gridContainer = document.getElementById("recent-events-grid");
  if (!gridContainer) return;
  gridContainer.innerHTML = "";

  list.forEach((evt, index) => {
    const cell = document.createElement("div");
    cell.className = "ocs_grid-cell";
    cell.style.padding = "2rem";
    cell.style.borderRadius = "12px";
    cell.style.backgroundColor = index % 2 === 0 ? "$604140" : "#5b4241";
    cell.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)";
    cell.style.display = "flex";
    cell.style.flexDirection = "column";

    cell.innerHTML = `
      <img src="https://placehold.co/600x300/fdf3e7/604140?text=Event" alt="Event Placeholder" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
      <strong style="font-size: 1.4rem; color: #FFFFFF; display: block; margin-bottom: 0.75rem;">${evt.title || 'Community Gathering'}</strong>
      <div style="flex-grow: 1;">
        <p style="margin: 0 0 0.5rem; color: #f7eedf; font-size: 1.05rem;">
          <strong>Category:</strong> ${evt.category || 'Foundation'} | <strong>Date:</strong> ${evt.date || 'TBD'}
        </p>
        <p style="margin: 0; color: #FFFFFF; font-size: 1rem;">
          ${evt.location ? 'Location: ' + evt.location : (evt.price ? 'Price: $' + evt.price : 'Open community event')}
        </p>
      </div>
    `;
    gridContainer.appendChild(cell);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  checkAdminAccess();
  loadHomeContent();
  loadRecentEvents();
});