---
layout: post
title: About NCSNCF
permalink: /about/
comments: false
show_reading_time: false
---

<style>
  .ncs-about { 
    --ncs-primary: #604140; 
    --ncs-accent: #f7eedf; 
    --ncs-card-bg: #604140; 
    color: #FFFFFF; 
    font-family: var(--pref-font-family, 'Helvetica Neue', Helvetica, Arial, sans-serif);
  }
  .ncs-about * { box-sizing: border-box; }
  .ncs-about .ncs-hero { 
    padding: clamp(1.8rem, 4vw, 3rem); 
    border-radius: 14px; 
    background-color: #604140; 
    color: #FFFFFF; 
    margin: 0 0 2.5rem; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }
  .ncs-about .ncs-eyebrow { 
    text-transform: uppercase; 
    letter-spacing: .12em; 
    font-size: .85rem; 
    font-weight: 700; 
    color: #f7eedf; 
    margin: 0 0 .75rem; 
  }
  .ncs-about .ncs-hero h1 { 
    color: #FFFFFF; 
    font-size: clamp(2rem, 3.8vw, 3rem); 
    line-height: 1.15; 
    margin: 0 0 1rem; 
    font-weight: 800;
  }
  .ncs-about .ncs-hero p { 
    font-size: 1.15rem; 
    line-height: 1.7; 
    max-width: 52rem; 
    margin-bottom: 1.5rem; 
    color: #FFFFFF;
  }
  .ncs-about .ncs-actions { display: flex; flex-wrap: wrap; gap: .75rem; }
  .ncs-about .ncs-button { 
    display: inline-block; 
    padding: .7rem 1.4rem; 
    border-radius: .5rem; 
    background: #FFFFFF; 
    color: #604140; 
    font-weight: 700; 
    text-decoration: none; 
  }
  .ncs-about .ncs-button-secondary { 
    background: transparent; 
    border: 2px solid #FFFFFF; 
    color: #FFFFFF; 
  }
  .ncs-about section { margin: 2.8rem 0; }
  .ncs-about h2 { 
    font-size: clamp(1.6rem, 2.8vw, 2.1rem); 
    margin-bottom: 1rem; 
    color: #FFFFFF;
    font-weight: 700;
  }
  .ncs-about .ncs-lead { 
    line-height: 1.75; 
    max-width: 54rem; 
    font-size: 1.1rem; 
    color: #f7eedf;
    margin-bottom: 1.5rem;
  }
  .ncs-about .ncs-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
    gap: 1.5rem; 
    margin-top: 1.5rem; 
  }
  .ncs-about .ncs-card { 
    padding: 1.6rem; 
    border-radius: 12px; 
    border: 1px solid rgba(255, 255, 255, 0.2); 
    background: #604140; 
    color: #FFFFFF;
    box-shadow: 0 4px 10px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
  }
  .ncs-about .ncs-card h3 { 
    margin: 0 0 .75rem; 
    font-size: 1.25rem; 
    color: #FFFFFF;
    font-weight: 700;
  }
  .ncs-about .ncs-card p { 
    margin: 0 0 1rem; 
    line-height: 1.65; 
    color: #FFFFFF;
    font-size: 0.98rem;
    flex-grow: 1;
  }
  .ncs-about .ncs-card-link {
    font-weight: 700;
    color: #f7eedf;
    text-decoration: underline;
    font-size: 0.95rem;
    margin-top: auto;
  }
  .ncs-about .ncs-timeline { 
    list-style: none; 
    margin: 1.5rem 0; 
    padding: 0; 
    border-left: 3px solid #f7eedf; 
  }
  .ncs-about .ncs-timeline li { 
    margin: 0 0 1.5rem; 
    padding: 0 0 0 1.4rem; 
    position: relative; 
    line-height: 1.65;
    color: #FFFFFF;
  }
  .ncs-about .ncs-timeline li:before { 
    content: ''; 
    position: absolute; 
    top: .35rem; 
    left: -.55rem; 
    width: .9rem; 
    height: .9rem; 
    background: #f7eedf; 
    border-radius: 50%; 
  }
  .ncs-about .ncs-timeline strong { 
    display: block; 
    color: #f7eedf; 
    margin-bottom: .3rem; 
    font-size: 1.1rem;
  }
  .ncs-about .ncs-callout { 
    border-radius: 12px; 
    background: #604140; 
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-left: 5px solid #f7eedf; 
    padding: 1.8rem; 
    color: #FFFFFF;
  }
  .ncs-about .ncs-callout h2 { margin-top: 0; }
  .ncs-about .ncs-callout a { color: #f7eedf; font-weight: bold; }
</style>

<div class="ncs-about">
  <!-- Unified, Clear Introduction -->
  <header class="ncs-hero">
    <p class="ncs-eyebrow">North County Special Needs Community Foundation</p>
    <h1>Bringing People Together. Creating Opportunities.</h1>
    <p>
      Founded on genuine empathy and human connection, NCSNCF is dedicated to enriching the lives of adults with developmental disabilities and their families throughout Poway and North County San Diego. We foster lifelong friendships through athletics, advocate for permanent independent living communities, and provide educational and support resources so every individual can thrive.
    </p>
    <div class="ncs-actions">
      <a class="ncs-button" href="{{ site.baseurl }}/calendar/">View Upcoming Events</a>
      <a class="ncs-button ncs-button-secondary" href="{{ site.baseurl }}/survey">Take Community Survey</a>
      <a class="ncs-button ncs-button-secondary" href="https://www.ncspecialneedsfoundation.com/donate" target="_blank" rel="noopener noreferrer">Support Our Mission</a>
    </div>
  </header>

  <!-- Essential Community Services & Programs (Actionable & Useful to Families) -->
  <section aria-labelledby="community-services">
    <h2 id="community-services">Essential Community Programs &amp; Support</h2>
    <p class="ncs-lead">Practical, direct initiatives designed to support athletes, parents, and caregivers in our local neighborhoods:</p>
    
    <div class="ncs-grid">
      <article class="ncs-card">
        <h3>Poway Padres Softball</h3>
        <p>Over 25 years of Special Olympics athletics, team camaraderie, and weekly physical recreation for players of all ability levels and their families.</p>
        <a class="ncs-card-link" href="{{ site.baseurl }}/calendar/">Check Practice Schedule &rarr;</a>
      </article>

      <article class="ncs-card">
        <h3>Independent Living Housing</h3>
        <p>Spearheading affordable, supportive residential models—including our 53-unit community and the new 60-unit Monte Vista project opening in Poway in 2025.</p>
        <a class="ncs-card-link" href="#our-story">Learn About Housing Milestones &rarr;</a>
      </article>

      <article class="ncs-card">
        <h3>2-Night Caregiver Retreats</h3>
        <p>Dedicated weekend getaways in Julian, CA, offering vital rest, rejuvenation, and peer support for dedicated family caregivers who give so much every day.</p>
        <a class="ncs-card-link" href="mailto:info@ncspecialneedsfoundation.com">Inquire About Retreats &rarr;</a>
      </article>

      <article class="ncs-card">
        <h3>Post-Secondary Life Skills</h3>
        <p>Vocational readiness workshops and supportive guidance to help young adults transition smoothly beyond high school into fulfilling community participation.</p>
        <a class="ncs-card-link" href="{{ site.baseurl }}/survey">Give Feedback on Needs &rarr;</a>
      </article>
    </div>
  </section>

  <!-- Our Journey & Milestones -->
  <section id="our-story" aria-labelledby="our-story-title">
    <h2 id="our-story-title">Our Story &amp; Community Milestones</h2>
    <p class="ncs-lead">What started on a softball field in Poway grew into an enduring movement championing independence, housing, and lifelong human connection.</p>
    
    <ol class="ncs-timeline">
      <li>
        <strong>1998 — The Poway Padres Bring Families Together</strong>
        The Poway Padres Special Olympics softball team began, sparking lifelong bonds among athletes, volunteer coaches, and supportive families.
      </li>
      <li>
        <strong>2011 — Foundation Established by Tony Rubio</strong>
        NCSNCF was officially formed to create structured post-secondary educational programs and social opportunities for adults with special needs.
      </li>
      <li>
        <strong>2014 — Expanding Independent Housing Coalitions</strong>
        Collaboration among families, civic leaders, and developers established a shared vision for accessible housing tailored for adults with developmental disabilities.
      </li>
      <li>
        <strong>2021 — Milestone: Villa de Vida Opens</strong>
        A groundbreaking 53-unit independent living community in Poway welcomed residents, demonstrating the viability of supportive residential housing.
      </li>
      <li>
        <strong>2025 &amp; Beyond — Monte Vista Housing (60 Units)</strong>
        Approved by the Poway City Council, this new affordable community will dedicate 30 units specifically for Individuals with Developmental Disabilities.
      </li>
    </ol>
  </section>

  <!-- Get Involved Callout -->
  <section class="ncs-callout" aria-labelledby="get-involved">
    <h2 id="get-involved">Join Us in Building a Stronger Community</h2>
    <p style="margin-bottom: 1rem; line-height: 1.65;">
      Stronger, kinder communities start with human connection. Whether you are a parent seeking resources, a volunteer looking to coach or help at events, or a community supporter, there is a warm place for you here.
    </p>
    <p style="margin-bottom: 0.5rem;"><strong>Email Foundation Leadership:</strong> <a href="mailto:info@ncspecialneedsfoundation.com">info@ncspecialneedsfoundation.com</a></p>
    <p style="margin: 0;"><a href="https://www.ncspecialneedsfoundation.com/" target="_blank" rel="noopener noreferrer">Visit the official NCSNCF website &rarr;</a></p>
  </section>
</div>
