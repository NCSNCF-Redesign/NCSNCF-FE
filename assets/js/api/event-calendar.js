import { pythonURI, fetchOptions } from './config.js';

const EVENTS_URL = `${pythonURI}/api/events`;

export async function getEvents() {
    const res = await fetch(EVENTS_URL, fetchOptions);
    if (!res.ok) throw new Error(`Failed to fetch events (${res.status})`);
    return res.json();
}

export async function createEvent(payload) {
    const res = await fetch(EVENTS_URL, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Failed to create event (${res.status})`);
    return data;
}

export async function updateEvent(id, payload) {
    const res = await fetch(`${EVENTS_URL}/${encodeURIComponent(id)}`, {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Failed to update event (${res.status})`);
    return data;
}

export async function deleteEvent(id) {
    const res = await fetch(`${EVENTS_URL}/${encodeURIComponent(id)}`, {
        ...fetchOptions,
        method: 'DELETE'
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Failed to delete event (${res.status})`);
    return data;
}