"use client"
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { EventModal } from "@/components/Calendar/EventModal";
import { EventFormModal } from "@/components/Calendar/EventFormModal";
import { IEvent } from "@/model/eventModal";

export default function Page() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<IEvent[]>([]); // State to store events
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null); // State to store selected event for modal
  const [showModal, setShowModal] = useState<boolean>(false); // State to control modal visibility
  const [showAddEventModal, setShowAddEventModal] = useState<boolean>(false); // State to control the Add Event modal
  const [newEvent, setNewEvent] = useState<{
    title: string;
    description: string;
    date: Date | undefined;
    completionDate: Date | undefined;
  }>({
    title: "",
    description: "",
    date: date,
    completionDate: undefined,
  });

  // Fetch events from the backend API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/event"); // Assume /api/events will return a list of events
        const data = await response.json();

        // Ensure the response data is an array
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Unexpected response format", data);
          setEvents([]); // Fallback to empty array if the response is not valid
        }
      } catch (error) {
        console.error("Error fetching events", error);
        setEvents([]); // Fallback to empty array if there is an error
      }
    };

    fetchEvents();
  }, [date]); // Fetch events whenever the date changes

  // Handle new event creation
  const handleAddEvent = async () => {
    console.log(newEvent);
    const response = await fetch("/api/event", {
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
        <div className="w-1/2 flex justify-center">
          <Calendar mode="single" selected={date} onSelect={setDate} />
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

            {/* Show message if no events */}
            {events.length === 0 ? (
              <p className="text-center text-gray-500">Please add events.</p>
            ) : (
              <ul>
                {events.map((event) => (
                  <li
                    key={event?._id?.toString()} // Ensuring _id is treated as a string
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
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showModal && (
        <EventModal event={selectedEvent} onClose={() => setShowModal(false)} />
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
