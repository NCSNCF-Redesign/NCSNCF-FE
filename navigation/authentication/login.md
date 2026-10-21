---
layout: page
title: Login
permalink: /login
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
  background-color: #ffffff;
}

/* Right Side: The Image Showcase */
.showcase-side {
  flex: 1;
  background-size: cover;
  background-position: center;
  background-color: #ffd1dc; /* Fallback pink color */
}

/* The actual box holding the inputs */
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

/* Style the inputs to look modern */
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
  transition: all 0.3s ease;
}

.submit-button:hover {
  background-color: #555;
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
  
  <!-- Left Side: The Login Form -->
  <div class="form-side">
    <div class="form-wrapper">
      <h1 id="pythonTitle">Welcome Back</h1>
      
      <form id="pythonForm" onsubmit="loginBoth(); return false;">
        <div class="form-group">
          <input type="text" id="uid" placeholder="GitHub ID" required>
        </div>
        <div class="form-group">
          <input type="password" id="password" placeholder="Password" required>
        </div>
        
        <button type="submit" class="submit-button">Sign In</button>
        <p id="message" style="color: red; margin-top: 10px;"></p>
      </form>

      <p class="auth-toggle">
        Don't have an account? <a href="{{ site.baseurl }}/signup/">Sign up here!</a>
      </p>

    </div>
  </div>

  <!-- Right Side: The Image Showcase (Image path applied directly in HTML) -->
  <div class="showcase-side" style="background-image: url('https://raw.githubusercontent.com/ccae-redesign-team/CCAE-FE/main/images/CCAE.jpg');">
  </div>

</section>

<script type="module">
import { login, pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

window.loginBoth = function () {
  javaLogin(); 
  pythonLogin();
};

window.pythonLogin = function () {
  const options = {
    URL: `${pythonURI}/api/authenticate`,
    callback: pythonDatabase,
    message: "message",
    method: "POST",
    cache: "no-cache",
    body: {
      uid: document.getElementById("uid").value,
      password: document.getElementById("password").value,
    }
  };
  login(options);
}

window.javaLogin = function () {
  const loginURL = `${javaURI}/authenticate`;
  const databaseURL = `${javaURI}/api/person/get`;
  const signupURL = `${javaURI}/api/person/create`;
  const userCredentials = JSON.stringify({
    uid: document.getElementById("uid").value,
    password: document.getElementById("password").value,
  });

  const loginOptions = {
    ...fetchOptions,
    method: "POST",
    body: userCredentials,
  };

  fetch(loginURL, loginOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error("Invalid login");
      }
      return response.json();
    })
    .then(data => {
      window.location.href = '{{site.baseurl}}/profile';
      return fetch(databaseURL, fetchOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Spring server response: ${response.status}`);
          }
          return response.json();
        });
    })
    .catch(error => {
      if (error.message === "Invalid login") {
        alert("Login for Spring failed. Creating a new Java account...");
        const signupData = JSON.stringify({
          uid: document.getElementById("uid").value,
          email: document.getElementById("uid").value + "@gmail.com",
          dob: "11-01-2024",
          name: document.getElementById("uid").value,
          password: document.getElementById("password").value,
          kasmServerNeeded: false,
        });

        const signupOptions = {
          ...fetchOptions,
          method: "POST",
          body: signupData,
        };

        fetch(signupURL, signupOptions)
          .then(signupResponse => {
            if (!signupResponse.ok) {
              throw new Error("Account creation failed!");
            }
            return signupResponse.json();
          })
          .then(signupResult => {
            alert("Account Creation Successful. Logging you into Flask/Spring!");
            return fetch(loginURL, loginOptions)
              .then(newLoginResponse => {
                if (!newLoginResponse.ok) {
                  throw new Error("Login failed after account creation");
                }
                return fetch(databaseURL, fetchOptions)
                  .then(response => {
                    if (!response.ok) {
                      throw new Error(`Spring server response: ${response.status}`);
                    }
                    return response.json();
                  });
              });
          })
          .catch(newLoginError => {
            console.error("Error after account creation:", newLoginError.message);
          });
      }
    });
};

function pythonDatabase() {
  const URL = `${pythonURI}/api/id`;
  fetch(URL, fetchOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Flask server response: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      window.location.href = '{{site.baseurl}}/profile';
    })
    .catch(error => {
      document.getElementById("message").textContent = `Error: ${error.message}`;
    });
}

function javaDatabase() {
  const URL = `${javaURI}/api/person/get`;
  fetch(URL, fetchOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Spring server response: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error("Java Database Error:", error);
    });
}
</script>