---
layout: page
title: Sign Up
permalink: /signup
search_exclude: true
show_reading_time: false
---

<section class="ncs-auth split-screen-container">
  <!-- Left Side: The Sign Up Form -->
  <div class="ncs-auth__form-side form-side">
    <div class="ncs-auth__wrapper form-wrapper">
      <h1>Sign Up</h1>
      <form id="signupForm" class="ncs-auth__form" onsubmit="handleSignup(event); return false;">
        <div class="ncs-auth__group form-group">
          <input type="text" id="name" placeholder="Name" required autocomplete="name">
        </div>
        <div class="ncs-auth__group form-group">
          <input type="text" id="uid" placeholder="Username" required autocomplete="username">
        </div>
        <div class="ncs-auth__group form-group">
          <input type="email" id="email" placeholder="Email" required autocomplete="email">
        </div>
        <div class="ncs-auth__group form-group">
          <input type="password" id="password" placeholder="Password" required autocomplete="new-password">
        </div>
        <button type="submit" id="signupSubmitBtn" class="ncs-auth__submit-btn submit-button">Sign Up</button>
        <p id="signupMessage" class="ncs-auth__message"></p>
      </form>
      <p class="ncs-auth__toggle auth-toggle">
        Already have an account? <a href="{{ '/login' | relative_url }}">Log in here</a>
      </p>
    </div>
  </div>

  <!-- Right Side: The Image Showcase -->
  <div class="ncs-auth__showcase-side showcase-side">
    <img src="{{site.baseurl}}/images/NCSNCF.jpg" alt="NCSNCF Showcase">
  </div>
</section>

<script type="module">
  import { javaURI, pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

  // Read the URL for a redirect parameter and set fallback destination
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTarget = urlParams.get('redirect') || '{{ site.baseurl }}/login';

  window.handleSignup = async function(event) {
    if (event) {
      event.preventDefault();
    }

    const signupMessage = document.getElementById("signupMessage");
    const submitBtn = document.getElementById("signupSubmitBtn");

    const nameInput = document.getElementById("name");
    const uidInput = document.getElementById("uid");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const name = nameInput ? nameInput.value.trim() : "";
    const uid = uidInput ? uidInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!name || !uid || !email || !password) {
      signupMessage.className = "ncs-auth__message ncs-auth__message--error";
      signupMessage.innerText = "Please fill in all required fields.";
      return;
    }

    const signupData = {
      name,
      uid,
      email,
      password,
      kasmServerNeeded: false,
      kasm_server_needed: false,
    };

    const springURL = `${javaURI}/api/person/create`;
    const flaskURL = `${pythonURI}/api/user`;

    const springRequest = {
      ...fetchOptions,
      method: "POST",
      body: JSON.stringify(signupData),
    };

    const flaskRequest = {
      ...fetchOptions,
      method: "POST",
      body: JSON.stringify(signupData),
    };

    signupMessage.className = "ncs-auth__message ncs-auth__message--info";
    signupMessage.innerText = "Signing up...";
    if (submitBtn) submitBtn.disabled = true;

    try {
      // Primary authentication/user database is Flask
      const flaskResponse = await fetch(flaskURL, flaskRequest);
      const flaskRaw = await flaskResponse.text();
      let flaskData;
      try {
        flaskData = flaskRaw ? JSON.parse(flaskRaw) : {};
      } catch (_) {
        flaskData = { message: flaskRaw };
      }

      if (!flaskResponse.ok || flaskData.success === false) {
        const flaskMessage = flaskData.message || flaskRaw || `Signup failed (${flaskResponse.status})`;
        throw new Error(flaskMessage);
      }

      signupMessage.className = "ncs-auth__message ncs-auth__message--success";
      signupMessage.innerText = "Sign up successful! Redirecting to login...";

      // Best-effort write to Java Spring person endpoint
      fetch(springURL, springRequest)
        .then(async (springResponse) => {
          const springRaw = await springResponse.text();
          if (!springResponse.ok) {
            console.warn("Spring person create response:", springResponse.status, springRaw);
          }
        })
        .catch((springError) => {
          console.warn("Spring request warning:", springError.message);
        });

      // Clear form inputs
      if (document.getElementById("signupForm")) {
        document.getElementById("signupForm").reset();
      }

      // Redirect user to login or redirectTarget after 1.5s
      setTimeout(() => {
        window.location.href = redirectTarget;
      }, 1500);

    } catch (error) {
      signupMessage.className = "ncs-auth__message ncs-auth__message--error";
      signupMessage.innerText = "Sign up failed: " + error.message;
      console.error("Error during signup:", error);
      if (submitBtn) submitBtn.disabled = false;
    }
  };

  // Backwards compatibility alias for window.signup
  window.signup = window.handleSignup;
</script>
