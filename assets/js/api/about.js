import { pythonURI, fetchOptions } from '../api/config.js';

async function loadMilestones() {
  const container = document.getElementById('milestones-container');
  const adminList = document.getElementById('admin-milestones-list');
  if (!container) return;

  try {
    const res = await fetch(`${pythonURI}/api/milestones`, fetchOptions);
    if (!res.ok) throw new Error("Failed to load milestones");
    const milestones = await res.json();

    container.innerHTML = "";
    if (adminList) adminList.innerHTML = "";

    if (milestones.length === 0) {
      container.innerHTML = `<div style="color: #fff; text-align: center;">No milestones found. Use the admin manager below to add some!</div>`;
      return;
    }

    milestones.forEach((m, index) => {
      const isReverse = index % 2 === 1;
      const flexDir = isReverse ? 'row-reverse' : 'row';

      // If an image URL exists, show the image. Otherwise, show a styled placeholder box with the title.
      const mediaHTML = m.image_url 
        ? `<div style="flex: 1 !important;">
             <img src="${m.image_url}" alt="${m.title}" style="width: 100% !important; height: auto !important; border-radius: 12px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important; object-fit: cover;">
           </div>` 
        : `<div style="flex: 1 !important; background-color: #5b4241; border: 2px dashed #7c6161; border-radius: 12px; padding: 3rem 2rem; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; min-height: 200px;">
             <span style="color: #f7eedf; font-size: 1.5rem; font-weight: bold;">${m.title}</span>
           </div>`;

      const block = document.createElement('div');
      block.style.cssText = `display: flex !important; flex-direction: ${flexDir} !important; align-items: center !important; gap: 4rem !important;`;
      block.innerHTML = `
        ${mediaHTML}
        <div style="flex: 1 !important;">
          <h3 style="font-size: 1.85rem !important; color: #ffffff !important; margin-top: 0 !important; margin-bottom: 1rem !important;">${m.year} — ${m.title}</h3>
          <p style="font-size: 1.35rem !important; line-height: 1.7 !important; color: #ffffff !important; margin: 0 !important;">${m.description}</p>
        </div>
      `;
      container.appendChild(block);

      if (adminList) {
        const item = document.createElement('div');
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: #5b4241; padding: 1rem; border-radius: 8px;";
        item.innerHTML = `
          <div>
            <strong style="color: #f7eedf;">${m.year}:</strong> <span style="color: #fff;">${m.title}</span>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" onclick="editMilestone(${m.id}, '${encodeURIComponent(m.year)}', '${encodeURIComponent(m.title)}', '${encodeURIComponent(m.description)}', '${encodeURIComponent(m.image_url || '')}')" style="background: #604140; color: #fff; border: 1px solid #fff; padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer;">Edit</button>
            <button type="button" onclick="deleteMilestone(${m.id})" style="background: #991b1b; color: #fff; border: none; padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer;">Delete</button>
          </div>
        `;
        adminList.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Error loading milestones:", err);
    container.innerHTML = `<div style="color: #fca5a5; text-align: center;">Error loading milestones from server.</div>`;
  }
}

window.toggleMilestoneManager = function() {
  const panel = document.getElementById('milestone-admin-panel');
  if (!panel) return;
  panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'block' : 'none';
  if (panel.style.display === 'block') {
    panel.scrollIntoView({ behavior: 'smooth' });
  }
};

window.resetMilestoneForm = function() {
  document.getElementById('milestone-form').reset();
  document.getElementById('milestone-id').value = "";
  document.getElementById('form-title').textContent = "Add New Milestone";
  document.getElementById('milestone-status').textContent = "";
};

window.editMilestone = function(id, year, title, desc, img) {
  document.getElementById('milestone-id').value = id;
  document.getElementById('milestone-year').value = decodeURIComponent(year);
  document.getElementById('milestone-title').value = decodeURIComponent(title);
  document.getElementById('milestone-desc').value = decodeURIComponent(desc);
  document.getElementById('milestone-image').value = img !== 'null' && img !== '' ? decodeURIComponent(img) : '';
  document.getElementById('form-title').textContent = `Edit Milestone #${id}`;
  document.getElementById('milestone-form').scrollIntoView({ behavior: 'smooth' });
};

window.handleMilestoneSubmit = async function(event) {
  event.preventDefault();
  const id = document.getElementById('milestone-id').value;
  const statusEl = document.getElementById('milestone-status');
  statusEl.style.color = "#f4e6ce";
  statusEl.textContent = "Saving...";

  const payload = {
    year: document.getElementById('milestone-year').value,
    title: document.getElementById('milestone-title').value,
    description: document.getElementById('milestone-desc').value,
    image_url: document.getElementById('milestone-image').value
  };

  const url = id ? `${pythonURI}/api/milestones/${id}` : `${pythonURI}/api/milestones`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      method: method,
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to save milestone");

    statusEl.style.color = "#86efac";
    statusEl.textContent = "Saved successfully!";
    resetMilestoneForm();
    loadMilestones();
    setTimeout(() => { statusEl.textContent = ""; }, 3000);
  } catch (err) {
    console.error(err);
    statusEl.style.color = "#fca5a5";
    statusEl.textContent = "Error saving milestone.";
  }
};

window.deleteMilestone = async function(id) {
  if (!confirm("Are you sure you want to delete this milestone?")) return;
  try {
    const res = await fetch(`${pythonURI}/api/milestones/${id}`, {
      ...fetchOptions,
      method: 'DELETE'
    });
    if (!res.ok) throw new Error("Failed to delete");
    loadMilestones();
  } catch (err) {
    console.error(err);
    alert("Error deleting milestone.");
  }
};

document.addEventListener("DOMContentLoaded", loadMilestones);