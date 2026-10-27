// Change this URL when you deploy your backend live (e.g., to Render or Railway)
const BACKEND_URL = "http://127.0.0.1:5000";

// Array storing fetched events for CPT Data Abstraction tracking
let globalEventsList = [];

async function fetchUserData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/id", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include" // REQUIRED for CORS requests carrying credentials/cookies
    });

    if (response.status === 401) {
      console.warn("User is not logged in or session expired.");
      // Redirect to login or display login prompt
      return;
    }

    const data = await response.json();
    console.log("User data:", data);
  } catch (error) {
    console.error("Connection error:", error);
  }
}

/**
 * Fetches all events from the Flask API
 */
async function fetchAllEvents() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/events`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    globalEventsList = await response.json();
    renderEvents(globalEventsList);
  } catch (error) {
    console.error("Failed to load events from backend:", error);
    document.getElementById("events-container").innerHTML = 
      `<p style="color: red;">Error connecting to backend server.</p>`;
  }
}

/**
 * Fetches filtered events by category and min capacity from Flask API
 */
async function fetchFilteredEvents(category, minCapacity = 0) {
  try {
    const queryParams = new URLSearchParams({
      category: category,
      min_capacity: minCapacity
    });

    const response = await fetch(`${BACKEND_URL}/api/events/filter?${queryParams}`);
    const result = await response.json();
    
    renderEvents(result.data);
  } catch (error) {
    console.error("Failed to fetch filtered events:", error);
  }
}

/**
 * Dynamically updates the UI with event cards
 */
function renderEvents(eventsArray) {
  const container = document.getElementById("events-container");
  container.innerHTML = "";

  if (eventsArray.length === 0) {
    container.innerHTML = "<p>No matching events found.</p>";
    return;
  }

  eventsArray.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <h3>${event.title}</h3>
      <p>Category: ${event.category}</p>
      <p>Capacity: ${event.capacity}</p>
      <p>Price: $${event.price}</p>
    `;
    container.appendChild(card);
  });
}

// Automatically load events when page loads
document.addEventListener("DOMContentLoaded", fetchAllEvents);