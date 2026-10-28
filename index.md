---
layout: post
title: North County Special Needs Community Foundation
hide: true
show_reading_time: false
---
<style>
  /* Aggressively hide the layout's auto-generated header block, preserving the masthead navigation */
  .page-header, .page__header, .entry-header, .page-title { 
    display: none !important; 
  }
</style>

<!-- Unified Hero Section -->
<div style="width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; margin-top: -2rem; background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('{{ site.baseurl }}/images/NCSNCF%20header.jpg') no-repeat center 15%; background-size: cover; padding: 10rem 2rem; text-align: center; margin-bottom: 3rem;">
  <div style="width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 1rem; box-sizing: border-box;">
    
    <!-- Foundation Name: Forced to one line using nowrap and viewport-relative scaling -->
    <h1 style="color: #FFFFFF; margin-bottom: 1rem; font-size: clamp(1.2rem, 3.2vw, 3.5rem); white-space: nowrap; width: 100%;">North County Special Needs Community Foundation</h1>
    
    <!-- Empowering Subtext -->
    <p class="ocs__description" style="color: #FFFFFF; margin-bottom: 2.5rem; font-size: 1.2rem; line-height: 1.5; max-width: 800px; margin-left: auto; margin-right: auto; white-space: normal;">
      Empowering adults with developmental disabilities in the Poway community through social, educational, and independent housing opportunities.
    </p>
    
    <!-- Buttons -->
    <div class="ocs__links" style="display: flex; justify-content: center; gap: 1rem;">
      <a class="ocs__btn" style="color: #604140; background-color: #FFFFFF; border: 2px solid #FFFFFF; text-decoration: none;" href="#">Get Involved</a>
      <a class="ocs__btn" style="color: #604140; background-color: #FFFFFF; border: 2px solid #FFFFFF; text-decoration: none;" href="#">Donate Today</a>
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
<h2>Milestones</h2>
<div class="ocs__card" style="margin-bottom: 2rem;">
  <h3>Monte Vista Housing Project (Fall 2025)</h3>
  <p class="ocs__description">Approved by the Poway City Council, this 60-unit affordable housing site across from Pomerado Hospital will provide 30 units dedicated specifically to Individuals with Developmental Disabilities. This represents our ongoing commitment to expanding independent living solutions.</p>
</div>

<!-- Dynamic Events Section -->
<h2>Upcoming Events</h2>
  <!-- Events will be populated here via JavaScript -->
  <div class="ocs__grid-cell ocs__grid-cell--header">Loading Events...</div>

<hr style="margin: 2rem 0;">

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