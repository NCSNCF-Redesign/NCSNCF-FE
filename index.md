---
layout: sdlabrats
title: North County Special Needs Community Foundation
permalink: /
---

<!-- Hero Section with LabRats UI Split Structure -->
<section class="labrats__hero">
  <div class="labrats__split labrats__split--center">
    <div>
      <span class="labrats__grade">Poway &bull; Est. 2011</span>
      <h1>Bringing People Together. Creating Lifelong Opportunities.</h1>
      <p class="ocs__lead">
        Dedicated to empowering adults with developmental disabilities in Poway and surrounding North County communities through social inclusion, workplace education, and independent housing initiatives.
      </p>
      <div class="ocs__links" style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem;">
        <a href="{{ '/about/' | relative_url }}" class="ocs__btn medium signal fill">Our Story & Mission</a>
        <a href="{{ '/donate/' | relative_url }}" class="ocs__btn medium">Donate & Support</a>
      </div>
    </div>
    <div>
      <figure class="labrats__figure">
        <img src="{{ '/images/NCSNCF header.jpg' | relative_url }}" alt="Poway Padres and NCSNCF Community Gathering">
        <figcaption>Poway Padres Special Olympics & Foundation community celebration in Poway, CA.</figcaption>
      </figure>
    </div>
  </div>
</section>

<!-- 3 Core Pillars -->
<section class="labrats__section" style="margin-top: 3.5rem;">
  <h2>Our Core Pillars</h2>
  <div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell">
      <span class="labrats__grade">Connection</span>
      <h3 style="margin-top: 0.75rem;">Make Friends & Socialize</h3>
      <p>Creating opportunities to bring families together and build lasting friendships through sports, Poway community parades, picnics, and annual celebrations.</p>
    </div>

    <div class="ocs__grid-cell">
      <span class="labrats__grade">Independence</span>
      <h3 style="margin-top: 0.75rem;">Housing Opportunities</h3>
      <p>Advocating and partnering for independent living models, including our milestone 53-unit development and the new Monte Vista 60-unit project opening in 2025.</p>
    </div>

    <div class="ocs__grid-cell">
      <span class="labrats__grade">Growth</span>
      <h3 style="margin-top: 0.75rem;">Education & Workplace Skills</h3>
      <p>Collaborating with civic leaders, schools, and local businesses to create post-secondary practical learning and meaningful employment pathways.</p>
    </div>
  </div>
</section>

<!-- Housing Highlight Band -->
<div class="labrats__band">
  <div class="labrats__wrap">
    <div class="labrats__split labrats__split--center">
      <div>
        <span class="labrats__grade">Housing Milestone</span>
        <h2 style="margin-top: 0.5rem; margin-bottom: 1rem;">Monte Vista Housing Project (Opening Fall 2025)</h2>
        <p style="font-size: 1.15rem; line-height: 1.65; color: var(--text-muted); margin-bottom: 1.25rem;">
          Approved in partnership with the Poway City Council, this 60-unit affordable housing community across from Pomerado Hospital dedicates 30 specialized units for Individuals with Developmental Disabilities and 30 units for Veterans.
        </p>
        <p style="font-size: 1.05rem; line-height: 1.65; color: var(--text-muted);">
          Following our successful 53-unit development opened in June 2021, Monte Vista fulfills our enduring mission to provide dignity, safety, and community for adults as they mature into independent adulthood.
        </p>
        <div style="margin-top: 1.5rem;">
          <a href="{{ '/what-we-do/' | relative_url }}" class="ocs__btn medium signal fill">Learn More About Our Housing &rarr;</a>
        </div>
      </div>
      <div>
        <figure class="labrats__figure">
          <img src="{{ '/images/NCSNCF.jpg' | relative_url }}" alt="Monte Vista and Housing Initiatives">
          <figcaption>Dedicated to creating safe, affordable, and supportive living spaces.</figcaption>
        </figure>
      </div>
    </div>
  </div>
</div>

<!-- Dynamic Events Section -->
<section class="labrats__section">
  <div class="ocs__card-header">
    <h2>Upcoming Community Events</h2>
    <a href="{{ '/calendar/' | relative_url }}" class="ocs__btn small">View Full Calendar &rarr;</a>
  </div>

  <div id="recent-events-grid" class="ocs__grid ocs__grid--card cols-2">
    <div class="ocs__grid-cell">Connecting to Event Server...</div>
  </div>
</section>

<!-- Call to Action Band -->
<section class="labrats__cta" style="margin-top: 4rem;">
  <div class="labrats__split labrats__split--center">
    <div>
      <h2>Join Us in Building a Stronger Community</h2>
      <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
        Whether you are a family seeking services, a prospective volunteer coach, or a community supporter, your partnership makes independence possible.
      </p>
      <div class="ocs__links" style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="{{ '/donate/' | relative_url }}" class="ocs__btn medium signal fill">Make a Tax-Deductible Donation</a>
        <a href="{{ '/contact/' | relative_url }}" class="ocs__btn medium" style="border-color: #fff; color: #fff;">Get In Touch</a>
      </div>
    </div>
    <div>
      <div class="ocs__card" style="background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2); color: #fff; margin-bottom: 0;">
        <h3 style="color: #fff; font-size: 1.25rem;">Impact Facts</h3>
        <ul style="list-style: none; padding-left: 0; line-height: 1.8; margin-bottom: 0;">
          <li>&bull; <strong>25+ Years:</strong> Poway Padres Special Olympics partnership</li>
          <li>&bull; <strong>53 Units:</strong> Independent living opened June 2021</li>
          <li>&bull; <strong>60 Units:</strong> Monte Vista affordable housing (Fall 2025)</li>
          <li>&bull; <strong>501(c)(3):</strong> Non-profit public charity (EIN 45-3974276)</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<script>
const BACKEND_URL = "http://localhost:5000";

async function loadRecentEvents() {
  const gridContainer = document.getElementById("recent-events-grid");
  if (!gridContainer) return;

  try {
    const response = await fetch(`${BACKEND_URL}/api/events`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const events = await response.json();
    gridContainer.innerHTML = '';
    
    if (!Array.isArray(events) || events.length === 0) {
      gridContainer.innerHTML = '<div class="ocs__grid-cell">No scheduled events found. Check back soon!</div>';
      return;
    }
    
    const sortedEvents = events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
    
    sortedEvents.forEach((evt) => {
      const cell = document.createElement("div");
      cell.className = "ocs__grid-cell";
      cell.innerHTML = `
        <span class="labrats__grade">${evt.category || 'Foundation Event'}</span>
        <h3 style="margin: 0.5rem 0 0.35rem;">${evt.title || 'Community Gathering'}</h3>
        <p style="margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.95rem;">
          <strong>Date:</strong> ${evt.date || 'TBD'} &bull; <strong>Location:</strong> ${evt.location || 'Poway, CA'}
        </p>
        <p style="margin: 0; font-size: 0.9rem;">${evt.description || 'Join us for fun, recreation, and community connection.'}</p>
      `;
      gridContainer.appendChild(cell);
    });
    
  } catch (error) {
    gridContainer.innerHTML = `
      <div class="ocs__grid-cell">
        <span class="labrats__grade">Athletics</span>
        <h3 style="margin: 0.5rem 0 0.35rem;">Poway Padres Softball Practice</h3>
        <p style="margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.95rem;">Weekly at Poway Community Park</p>
        <p style="margin: 0; font-size: 0.9rem;">Join the team for weekly fielding, batting practice, and team bonding.</p>
      </div>
      <div class="ocs__grid-cell">
        <span class="labrats__grade">Social</span>
        <h3 style="margin: 0.5rem 0 0.35rem;">Annual Family & Friends BBQ</h3>
        <p style="margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.95rem;">Lake Poway Picnic Grounds</p>
        <p style="margin: 0; font-size: 0.9rem;">Celebrating our athletes, families, and supporters with lunch, games, and awards.</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadRecentEvents);
</script>
