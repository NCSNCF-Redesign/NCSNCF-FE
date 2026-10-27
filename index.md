---
layout: post 
title: CCAE-FE
hide: true
show_reading_time: false
---

## California Center For The Arts, Escondido 2026-27
<div class="ocs__card">
  <p class="ocs__description">This is the home page for CCAE.</p>
</div>
---

### Development Environment


<!-- markdownlint-disable MD033 MD046 -->

Hi! My name is [Your Full Name]

## Learning Buttons

> SASS Mixins examples and code, explore these topics by clicking standard OCS SASS buttons.

<div class="ocs__links">
    <a class="ocs__btn" href="{{site.baseurl}}/github/pages/about_sass_buttons/">
        Buttons Lesson
    </a>
    <a class="ocs__btn" href="https://github.com/Open-Coding-Society/pages/blob/main/_sass/open-coding/mixins/_buttons.scss">
        Button Mixins
    </a>
    <a class="ocs__btn" href="https://github.com/Open-Coding-Society/pages/blob/main/_sass/open-coding/mixins/_container.scss">
        Container Mixins
    </a>
</div>

---

<div class="ocs__grid ocs__grid--standard cols-3" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">Teammates/Collaborators</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Mateo Amador</strong>
        <p>Technologist/Developer</p>
        <a class="ocs__btn alert-green iridescent fill small" href="https://avg11235.opencodingsociety.com/">
            Portfolio
        </a>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Tristan Chiu</strong>
        <p>Technologist/Developer</p>
        <a class="ocs__btn alert-green iridescent fill small" href="https://tristan-chiu0.github.io/portfolio/">
            Portfolio
        </a>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Yue Barbara Zhao</strong>
        <p>Technologist/Developer</p>
        <a class="ocs__btn alert-green iridescent fill small" href="https://3rii0.github.io/portfolio/">
            Portfolio
        </a>
    </div>
</div>

**Powered by OCS grids and buttons**

[Buttons]({{ '/navigation/sass/buttons/' | relative_url }}) | [Grids]({{ '/navigation/sass/grids/' | relative_url }})

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