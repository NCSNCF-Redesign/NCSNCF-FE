---
layout: page
title: Sign Up
permalink: /signup
search_exclude: true
show_reading_time: false
---

<style>
  /* Hide the green title */
  header.post-header, .post-title, .page-heading {
    display: none !important;
  }

  /* Hide the footer to remove the black gap at the bottom */
  .site-footer {
    display: none !important;
  }

  /* Remove default padding ONLY from the main content area so the header isn't affected */
  .page-content {
    padding: 0 !important;
    margin: 0 !important;
  }

  .page-content > .wrapper {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Set the split screen to fill the exact height minus the nav bar */
  .split-screen-container {
    display: flex;
    min-height: calc(100vh - 56px);
    width: 100%;
    margin: 0;
    padding: 0;
  }

  /* Left Side: centers the form */
  .form-side {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #6a5656;
  }

  /* Right Side: The Image Showcase */
  .showcase-side {
    flex: 1;
    background-color: #6e5555; /* Fallback pink color */
    overflow: hidden;
    border-radius: 0 !important;
  }

  .showcase-side img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    border-radius: 0 !important;
  }

  /* The actual box holding the inputs */
  .form-wrapper {
    width: 100%;
    max-width: 400px;
    padding: 40px;
    color: #ffffff;
  }

  .form-wrapper h1 {
    display: block !important;
    margin-bottom: 20px;
    color: #ffffff !important;
    text-shadow: 0px 0px 15px #6e5555;
  }

  /* Style the inputs to look modern */
  .form-wrapper input {
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    border: 0px solid #e0e0e0 !important;
    outline: none !important;
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
    filter: none !important;
    border-radius: 8px;
    font-family: inherit;
    box-sizing: border-box;
    color: #ffffff !important;
    background-color: #653f3e !important;
  }

  .form-wrapper input:focus,
  .form-wrapper input:hover {
    outline: none !important;
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
    filter: none !important;
    border: 0px solid #e0e0e0 !important;
    color: #ffffff !important;
  }

  /* Override browser autofill background/text colors */
  .form-wrapper input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #653f3e inset !important;
    -webkit-text-fill-color: #ffffff !important;
  }

  .submit-button {
    width: 100%;
    padding: 12px;
    background-color: #ffffff !important;
    color: #5b4241 !important;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .submit-button:hover {
    background-color: #e6e6e6 !important;
  }

  .auth-toggle {
    margin-top: 20px;
    text-align: center;
    font-size: 0.9rem;
    color: #ffffff !important;
  }

  .auth-toggle a {
    color: #ffffff !important;
    font-weight: bold;
    text-decoration: none;
  }
</style>

<section class="split-screen-container">
  <!-- Left Side: The Sign Up Form -->
  <div class="form-side">
    <div class="form-wrapper">
      <h1>Sign Up</h1>
      <!-- Make sure this onsubmit calls your actual JS sign up function -->
      <form id="signupForm" onsubmit="return false;">
        <div class="form-group">
          <input type="text" id="name" placeholder="Name" required>
        </div>
        <div class="form-group">
          <input type="text" id="uid" placeholder="Username" required>
        </div>
        <div class="form-group">
          <input type="text" id="sid" placeholder="SID" required>
        </div>
        <div class="form-group">
          <input type="email" id="email" placeholder="Email" required>
        </div>
        <div class="form-group">
          <input type="password" id="password" placeholder="Password" required>
        </div>
        <button type="submit" class="submit-button">Sign Up</button>
        <p id="message" style="color: red; margin-top: 10px;"></p>
      </form>
      <p class="auth-toggle">
        Already have an account? <a href="{{ '/login' | relative_url }}">Log in here</a>
      </p>
    </div>
  </div>

  <!-- Right Side: The Image Showcase -->
  <div class="showcase-side">
    <img src="{{site.baseurl}}/images/NCSNCF.jpg" alt="NCSNCF Showcase">
  </div>
</section>

<!-- KEEP YOUR EXISTING JAVASCRIPT HERE -->
<script type="module">
  import { javaURI, pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

  // Sign up function to handle form submission
  window.signup = async function() {
    const signupMessage = document.getElementById("signupMessage");
    const signupData = {
      uid: document.getElementById("signupUid").value,
      sid: document.getElementById("sid").value,
      email: document.getElementById("email").value,
      name: document.getElementById("name").value,
      password: document.getElementById("signupPassword").value,
      kasmServerNeeded: false,
      // Keep snake_case alias so Flask handlers expecting either key still work.
      kasm_server_needed: false,
    };

    const springURL = `${javaURI}/api/person/create`;
    const flaskURL = `${pythonURI}/api/user`;

    // Use shared defaults from config.js so credentials/CORS behavior is consistent site-wide.
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

    console.log("Sending signup requests:", { springURL, flaskURL, springRequest, flaskRequest });
    signupMessage.innerText = "Signing up...";

    try {
      // Flask signup is primary because login/auth reads from Flask user records.
      const flaskResponse = await fetch(flaskURL, flaskRequest);
      const flaskRaw = await flaskResponse.text();
      let flaskData;
      try {
        flaskData = flaskRaw ? JSON.parse(flaskRaw) : {};
      } catch (_) {
        flaskData = { message: flaskRaw };
      }

      if (!flaskResponse.ok || flaskData.success === false) {
        const flaskMessage = flaskData.message || flaskRaw || `Flask signup failed (${flaskResponse.status})`;
        throw new Error(flaskMessage);
      }

      signupMessage.innerText = "Sign up successful!";

      // Spring write is best-effort so API/MVC path issues do not block signup.
      fetch(springURL, springRequest)
        .then(async (springResponse) => {
          const springRaw = await springResponse.text();
          if (!springResponse.ok) {
            console.warn("Spring signup failed:", springResponse.status, springRaw);
          }
        })
        .catch((springError) => {
          console.warn("Spring signup error:", springError.message);
        });
    } catch (error) {
      signupMessage.innerText = "Sign up failed: " + error.message;
      console.error("Error during signup:", error);
    }
  };
</script>