---
layout: page
title: Sign Up
permalink: /signup
search_exclude: true
show_reading_time: false
---

<style>
/* Hide default titles and footers */
header.post-header, .post-title, .page-heading, .site-footer {
  display: none !important;
}

/* Strip default Jekyll spacing */
.page-content {
  padding: 0 !important;
  margin: 0 !important;
}

.page-content > .wrapper {
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* Split screen layout */
.split-screen-container {
  display: flex;
  min-height: calc(100vh - 56px); 
  width: 100%;
  margin: 0;
  padding: 0;
}

.form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}

.showcase-side {
  flex: 1;
  background-image: url('{{ "/images/CCAE.jpg" | relative_url }}');
  background-size: cover;
  background-position: center;
  background-color: #ffd1dc; 
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  color: #333;
}

.form-wrapper h1 {
  margin-bottom: 20px;
  color: #333;
}

.form-wrapper input {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  box-sizing: border-box;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #555;
}

.submit-button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.auth-toggle {
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.auth-toggle a {
  color: #0066cc;
  text-decoration: none;
}
</style>

<section class="split-screen-container">
  
  <div class="form-side">
    <div class="form-wrapper">
      <h1>Create an Account</h1>
      
      <form id="signupForm" onsubmit="handleSignup(); return false;">
        <input type="text" id="username" placeholder="Username" required>
        <input type="text" id="fullname" placeholder="Full Name" required>
        <input type="email" id="email" placeholder="Email Address" required>
        <input type="password" id="password" placeholder="Password" required>
        
        <button type="submit" id="submitBtn" class="submit-button">Sign Up</button>
        <p id="signupMessage" style="margin-top: 15px; text-align: center; font-weight: bold;"></p>
      </form>

      <p class="auth-toggle">
        Already have an account? <a href="{{ '/login' | relative_url }}">Log in here</a>
      </p>
    </div>
  </div>

  <div class="showcase-side"></div>

</section>

<script type="module">
import { javaURI, pythonURI } from '{{site.baseurl}}/assets/js/api/config.js';

window.handleSignup = function () {
  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('signupMessage');
  
  btn.disabled = true;
  btn.textContent = "Creating Account...";
  msg.style.color = "#333";
  msg.textContent = "Connecting to servers...";

  const username = document.getElementById("username").value;
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Python backend payload
  const pythonPayload = {
    name: fullname,
    uid: username,
    email: email,
    password: password,
    kasm_server_needed: false
  };

  // Java backend payload (hardcoding unused Open Coding Society variables)
  const javaPayload = {
    uid: username,
    sid: username, 
    email: email,
    dob: "01-01-2000", 
    name: fullname,
    password: password,
    kasmServerNeeded: false
  };

  // 1. Create Python Account
  fetch(`${pythonURI}/api/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pythonPayload)
  })
  .then(response => {
    if (!response.ok) throw new Error("Username or Email already exists.");
    return response.json();
  })
  .then(() => {
    // 2. Create Java Account
    return fetch(`${javaURI}/api/person/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(javaPayload)
    });
  })
  .then(response => {
    if (!response.ok) throw new Error("Could not sync with the Java server.");
    return response.json();
  })
  .then(() => {
    msg.style.color = "green";
    msg.textContent = "Account created successfully. Redirecting to login...";
    setTimeout(() => {
      window.location.href = '{{ "/login" | relative_url }}';
    }, 1500);
  })
  .catch(error => {
    msg.style.color = "red";
    msg.textContent = error.message;
    btn.disabled = false;
    btn.textContent = "Sign Up";
  });
}
</script>