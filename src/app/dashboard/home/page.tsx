"use client";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { EventModal } from "@/components/Calendar/EventModal";
import { EventFormModal } from "@/components/Calendar/EventFormModal";
import { IEvent } from "@/model/eventModal";
import { getDataFromToken } from "@/helper/getDataFromToken";
import { toast } from "react-hot-toast";

export default function Page() {
  const [date, setDate] = useState<Date>(new Date()); // Ensure date is always a Date
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

  const [userScore, setUserScore] = useState<number>(0); // State to store the user's points

  useEffect(() => {
    const userId = getDataFromToken();

    if (!userId) {
      console.error("User ID not found or invalid token");
      return;
    }

    // Fetch user's score and events after verifying userId
    const fetchUserData = async () => {
      try {
        // Fetch events
        const eventsResponse = await fetch("/api/event", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userId, // Ensure this is passed correctly
          },
        });
        const eventsData = await eventsResponse.json();

        if (Array.isArray(eventsData)) {
          setEvents(eventsData); // Set the events state
        } else {
          console.error("Unexpected response format", eventsData);
          setEvents([]); // In case data is not an array, set empty
        }

        // Fetch user's score
        const scoreResponse = await fetch(`/api/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userId, // Send userId to get the score
          },
        });
        const scoreData = await scoreResponse.json();
        
        if (scoreData?.points !== undefined) {
          setUserScore(scoreData.points); // Set the user's score
        } else {
          console.error("Failed to fetch user score");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        setEvents([]); // Set events to empty if fetch fails
        setUserScore(0); // Reset score on error
      }
    };

    fetchUserData();
  }, [date]); // Trigger fetch every time the date changes

  // Handle new event creation and send userId
  const handleAddEvent = async () => {
    const userId = getDataFromToken(); // Get the user ID from the token
    const eventWithUserId = {
      ...newEvent,
      userId, // Add userId to the new event data
    };
    if (!userId) {
      console.error("User is not authenticated");
      return; // Exit the function if userId is null or undefined
    }
    const response = await fetch("/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId, // Send the userId in the headers
      },
      body: JSON.stringify(eventWithUserId), // Send event data with userId
    });

    if (response.ok) {
      const newEventData = await response.json();
      setEvents((prevEvents) => [...prevEvents, newEventData]); // Add the new event to the list
      setShowAddEventModal(false); // Close the Add Event modal
    } else {
      console.error("Failed to add event");
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    // Update the event locally first (to immediately reflect the change)
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event._id === eventId) {
          // Create a new object with updated status
          return {
            ...event,
            status: newStatus,
          } as IEvent;
        }
        return event;
      })
    );

    // Send the update to the server
    const userId = getDataFromToken(); // Get the userId (as in the previous code)
    if (!userId) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const response = await fetch(`/api/event/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          userId, // Ensure userId is passed in headers
        },
        body: JSON.stringify({
          status: newStatus, // Send the updated status
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      toast.success("Status updated successfully");

      // After status change, update the score
      const scoreResponse = await fetch(`/api/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userId, // Send userId to get the score
        },
      });
      const scoreData = await scoreResponse.json();

      if (scoreData?.points !== undefined) {
        setUserScore(scoreData.points); // Update the score after status change
      }
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  // Handle date selection from calendar (ensuring selectedDate is a valid Date)
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setNewEvent({
        title: "",
        description: "",
        date: selectedDate, // Set the selected date for the new event
        completionDate: undefined,
      });
      setShowAddEventModal(true); // Open the Add Event modal with the selected date
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Calendar Event</h1>
      <h3 className="text-center ">User Score: {userScore}</h3>
      <div className="flex justify-evenly bg-white p-4 rounded-lg shadow-md">
        {/* Left Side: Calendar */}
        <div className="w-1/2 flex justify-center hidden">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        </div>

        {/* Right Side: Event list and add event button */}
        <div className="w-1/2">
          {/* Show User's Score */}
          <div className="mb-4 text-xl font-semibold">
            <p>User Score: {userScore}</p>
          </div>

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
                    key={event?._id?.toString()}
                    className="flex justify-between items-center cursor-pointer mb-2 p-2 border rounded-md hover:bg-gray-100"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowModal(true); // Show modal with event details
                    }}
                  >
                    <div>
                      <p className="font-bold">{event.title}</p>
                      <p>{new Date(event.date).toLocaleDateString()}</p>
                    </div>

                    {/* Dropdown for status */}
                    <select
                      className="ml-4 p-1 border rounded-md"
                      value={event.status} // Assuming status is part of the event object
                      onChange={(e) => handleStatusChange(event._id?.toString() ?? "", e.target.value)}
                      onClick={(e) => e.stopPropagation()} // Stop event propagation to prevent triggering onClick of li
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Process">In Process</option>
                      <option value="Completed">Completed</option>
                    </select>
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
