---
layout: sdlabrats
title: Contact Us
permalink: /contact/
---

<section class="ncsncf__hero">
  <span class="ncsncf__badge">Get in Touch</span>
  <h1>We’d Love to Hear From You.</h1>
  <p class="ocs__lead">
    Whether you have questions about independent living options, joining the Poway Padres, volunteering, or donating, our team is here to help.
  </p>
</section>

<section class="ncsncf__section" style="margin-top: 3.5rem;">
  <div class="ncsncf__split">
    <div>
      <h2>Foundation Contacts</h2>
      
      <div class="ocs__card" style="margin-bottom: 1.5rem;">
        <h3>Tony Rubio, President</h3>
        <p style="margin-bottom: 0.5rem;"><strong>Phone:</strong> <a href="tel:6196651335">(619) 665-1335</a></p>
        <p style="margin-bottom: 0.5rem;"><strong>Email:</strong> <a href="mailto:info@ncspecialneedsfoundation.com">info@ncspecialneedsfoundation.com</a></p>
      </div>

      <div class="ocs__card">
        <h3>Mailing Address</h3>
        <address style="font-style: normal; line-height: 1.6;">
          North County Special Needs Community Foundation<br>
          16459 Sombra Del Monte<br>
          Ramona, CA 92065<br><br>
          <strong>EIN:</strong> 45-3974276
        </address>
      </div>
    </div>

    <div>
      <div class="ocs__card">
        <h3>Send Us a Message</h3>
        <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.25rem;">Fill out the form below to connect with our leadership or join our email update list.</p>

        <form id="ncsncfContactForm" class="ocs__stack" onsubmit="event.preventDefault(); document.getElementById('contactStatus').style.display='block';">
          <div>
            <label for="contactName" style="display: block; font-weight: 700; margin-bottom: 0.35rem; font-size: 0.9rem;">Your Name *</label>
            <input type="text" id="contactName" class="ocs__input" style="width: 100%;" required placeholder="Jane Doe">
          </div>

          <div>
            <label for="contactEmail" style="display: block; font-weight: 700; margin-bottom: 0.35rem; font-size: 0.9rem;">Your Email *</label>
            <input type="email" id="contactEmail" class="ocs__input" style="width: 100%;" required placeholder="jane@example.com">
          </div>

          <div>
            <label for="contactInterest" style="display: block; font-weight: 700; margin-bottom: 0.35rem; font-size: 0.9rem;">Area of Interest</label>
            <select id="contactInterest" class="ocs__input" style="width: 100%;">
              <option value="general">General Inquiry</option>
              <option value="housing">Housing Opportunities & Monte Vista</option>
              <option value="sports">Poway Padres & Sports Activities</option>
              <option value="retreats">2-Night Family Getaway Retreat</option>
              <option value="volunteer">Volunteer & Community Support</option>
            </select>
          </div>

          <div>
            <label for="contactMessage" style="display: block; font-weight: 700; margin-bottom: 0.35rem; font-size: 0.9rem;">Message</label>
            <textarea id="contactMessage" class="ocs__input" rows="4" style="width: 100%;" placeholder="How can we help?"></textarea>
          </div>

          <div>
            <button type="submit" class="ocs__btn ocs__btn--accent" style="width: 100%;">Submit Message</button>
          </div>

          <div id="contactStatus" style="display: none; padding: 0.75rem; background: var(--ncsncf-tint); border: 1px solid var(--pref-accent-color); border-radius: 6px; font-size: 0.95rem; text-align: center;">
            ✓ Thank you! Your message has been noted. We will be in touch soon.
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
