import { EVENTS_TABLE } from "../data/dummyData.js";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 나중에: return (await fetch(`${CONFIG.API_BASE_URL}/api/events`)).json();
export async function fetchEvents() {
  await delay(200);
  return EVENTS_TABLE;
}

// 나중에: return (await fetch(`${CONFIG.API_BASE_URL}/api/events/${id}`)).json();
export async function fetchEventById(id) {
  await delay(150);
  const event = EVENTS_TABLE.find((e) => e.id === id);
  if (!event) {
    const err = new Error("EVENT_NOT_FOUND");
    err.code = "EVENT_NOT_FOUND";
    throw err;
  }
  return event;
}
