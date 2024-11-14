"use client"
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { EventModal } from "@/components/Calendar/EventModal"; // Modal for viewing event details
import { EventFormModal } from "@/components/Calendar/EventFormModal"; // Modal for adding new events

export default function Page() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<any[]>([]); // State to store events
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // State to store selected event for modal
  const [showModal, setShowModal] = useState<boolean>(false); // State to control modal visibility
  const [showAddEventModal, setShowAddEventModal] = useState<boolean>(false); // State to control the Add Event modal
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: date,
  }); // New event form data

  // Fetch events from the backend API
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/events"); // Assume /api/events will return a list of events
      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, [date]); // Fetch events whenever the date changes

  // Handle new event creation
  const handleAddEvent = async () => {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });

    if (response.ok) {
      const newEventData = await response.json();
      setEvents([...events, newEventData]); // Add the new event to the list
      setShowAddEventModal(false); // Close the Add Event modal
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Calendar Event</h1>

      <div className="flex justify-evenly bg-white p-4 rounded-lg shadow-md">
        {/* Left Side: Calendar */}
        <div className="w-1/2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>

        {/* Right Side: Event list and add event button */}
        <div className="w-1/2">
          {/* Add Event Button */}
          <button
            className="mb-4 bg-blue-500 text-white p-2 rounded-md"
            onClick={() => setShowAddEventModal(true)}
          >
            Add Event
          </button>

          {/* Event List */}
          <div>
            <h2 className="text-lg font-semibold mb-4">All Events</h2>
            <ul>
              {events.map((event) => (
                <li
                  key={event._id}
                  className="cursor-pointer mb-2 p-2 border rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowModal(true); // Show modal with event details
                  }}
                >
                  <p className="font-bold">{event.title}</p>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <EventFormModal
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          onClose={() => setShowAddEventModal(false)}
          onSubmit={handleAddEvent}
        />
      )}
    </div>
  );
}
