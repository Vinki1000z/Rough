// components/ui/EventFormModal.tsx

import { FC } from "react";

interface EventFormModalProps {
  newEvent: any;
  setNewEvent: (event: any) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const EventFormModal: FC<EventFormModalProps> = ({
  newEvent,
  setNewEvent,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Add Event</h2>
        
        {/* Event Form */}
        <div>
          <label className="block mb-2">Title:</label>
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full p-2 mb-4 border rounded-md"
            placeholder="Event title"
          />
          
          <label className="block mb-2">Description:</label>
          <textarea
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="w-full p-2 mb-4 border rounded-md"
            placeholder="Event description"
          />
          
          <label className="block mb-2">Date:</label>
          <input
            type="date"
            value={newEvent.date.toISOString().split('T')[0]} // Format the date
            onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
            className="w-full p-2 mb-4 border rounded-md"
          />

          <div className="flex justify-between">
            <button
              className="bg-red-500 text-white p-2 rounded-md"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="bg-green-500 text-white p-2 rounded-md"
              onClick={onSubmit}
            >
              Save Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
