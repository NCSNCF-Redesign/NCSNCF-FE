---
layout: post
title: North County Special Needs Community Foundation
hide: true
show_reading_time: false
---

<!-- Hero Section -->
<div style="width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('{{ site.baseurl }}/images/NCSNCF header.jpg') no-repeat center center; background-size: cover; padding: 8rem 2rem; text-align: center;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h1 style="color: white; margin-bottom: 1rem;">Bringing People Together</h1>
    <p class="ocs__description" style="color: white; margin-bottom: 2rem;">
      Empowering adults with developmental disabilities in the Poway community through social, educational, and independent housing opportunities.
    </p>
    <div class="ocs__links">
      <a class="ocs__btn alert-green iridescent fill" href="#">Get Involved</a>
      <a class="ocs__btn" style="color: white; border-color: white;" href="#">Donate Today</a>
    </div>
  </div>
</div>

<!-- 3 Pillars Section -->
<h2>What We Do</h2>
<div class="ocs__grid ocs__grid--standard cols-3" style="margin-bottom: 2rem;">
  <div class="ocs__grid-cell ocs__grid-cell--accent">
    <strong>Community & Social</strong>
    <p>Creating opportunities to bring families together and build lasting friendships through sports, community parades, and year-end BBQs.</p>
  </div>
  <div class="ocs__grid-cell">
    <strong>Housing Initiatives</strong>
    <p>Developing independent living options, including our 53-unit complex and expanding affordable housing solutions for the future.</p>
  </div>
  <div class="ocs__grid-cell ocs__grid-cell--accent">
    <strong>Education & Training</strong>
    <p>Creating post-high school workplace training and educational pathways alongside civic leaders to help young adults gain independence.</p>
  </div>
</div>

<!-- Featured Milestone -->
<h2>Upcoming Milestones</h2>
<div class="ocs__card" style="margin-bottom: 2rem;">
  <h3>Monte Vista Housing Project (Fall 2025)</h3>
  <p class="ocs__description">Approved by the Poway City Council, this 60-unit affordable housing site across from Pomerado Hospital will provide 30 units dedicated specifically to Individuals with Developmental Disabilities. This represents our ongoing commitment to expanding independent living solutions.</p>
</div>

<!-- Dynamic Events Section -->
<h2>Upcoming Events</h2>
<div id="recent-events-grid" class="ocs__grid ocs__grid--standard cols-3" style="margin-bottom: 2rem;">
  <!-- Events will be populated here via JavaScript -->
  <div class="ocs__grid-cell ocs__grid-cell--header">Loading Events...</div>
</div>

<hr style="margin: 2rem 0;">

<!-- Development Team -->
<h3>Development Team</h3>
<div class="ocs__grid ocs__grid--standard cols-3" style="margin-bottom: 1.5rem;">
  <div class="ocs__grid-cell ocs__grid-cell--accent">
    <strong>Mateo Amador</strong>
    <p>Technologist/Developer</p>
    <a class="ocs__btn alert-green iridescent fill small" href="https://avg11235.opencodingsociety.com/">Portfolio</a>
  </div>
  <div class="ocs__grid-cell ocs__grid-cell--accent">
    <strong>Tristan Chiu</strong>
    <p>Technologist/Developer</p>
    <a class="ocs__btn alert-green iridescent fill small" href="https://tristan-chiu0.github.io/portfolio/">Portfolio</a>
  </div>
  <div class="ocs__grid-cell ocs__grid-cell--accent">
    <strong>Yue Barbara Zhao</strong>
    <p>Technologist/Developer</p>
    <a class="ocs__btn alert-green iridescent fill small" href="https://3rii0.github.io/portfolio/">Portfolio</a>
  </div>
</div>

<script>
// Point to local Flask instance
const BACKEND_URL = "http://localhost:5000";

async function loadRecentEvents() {
  const gridContainer = document.getElementById("recent-events-grid");
  try {
    const response = await fetch(`${BACKEND_URL}/api/events`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error status: ${response.status}`);
    }
    
    const events = await response.json();
    
    // Clear existing grid contents except header cell
    gridContainer.innerHTML = '<div class="ocs__grid-cell ocs__grid-cell--header">Events</div>';
    
    if (!Array.isArray(events) || events.length === 0) {
      gridContainer.innerHTML += '<div class="ocs__grid-cell">No recent events available.</div>';
      return;
    }
    
    // 1. Sort events by date in descending order (most recent first)
    const sortedEvents = events.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 2. Extract top 4 events
    const topFourEvents = sortedEvents.slice(0, 4);
    
    // 3. Dynamically append event cells to the OCS grid
    topFourEvents.forEach((evt, index) => {
      const cell = document.createElement("div");
      const isAccent = index % 2 === 0;
      cell.className = isAccent ? "ocs__grid-cell ocs__grid-cell--accent" : "ocs__grid-cell";
      
      cell.innerHTML = `
        <strong>${evt.title || 'Untitled Event'}</strong>
        <p>Category: ${evt.category || 'General'} | Date: ${evt.date || 'TBD'}</p>
        <p>Price: $${evt.price ?? 0} | Spots Available: ${evt.capacity ?? 0}</p>
      `;
      gridContainer.appendChild(cell);
    });
    
  } catch (error) {
    console.error("Error loading recent events:", error);
    gridContainer.innerHTML = `
      <div class="ocs__grid-cell ocs__grid-cell--header">Events</div>
      <div class="ocs__grid-cell" style="color: red;">Unable to connect to backend server.</div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadRecentEvents);
</script>