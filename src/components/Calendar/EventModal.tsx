// components/ui/EventModal.tsx

import { FC } from "react";
import {IEvent} from '@/model/eventModal'
// interface Event {
//   title: string;
//   description: string;
//   startDate: string; // ISO date string
//   completionDate: string; // ISO date string
//   currentStatus: string;
//   status: string;
// }

interface EventModalProps {
  event: IEvent | null;
  onClose: () => void;
}

export const EventModal: FC<EventModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">{event.title}</h2>
        <p className="mb-4">{event.description}</p>
        <p className="mb-4">Start Date: {new Date(event.date).toLocaleDateString()}</p>
        {event.completionDate && (
          <p className="mb-4">Completion Date: {new Date(event.completionDate).toLocaleDateString()}</p>
        )}
        <p className="mb-4">Current Status: {event.status}</p>
        <p>Status: {event.status}</p>
        <button
          className="mt-4 bg-red-500 text-white p-2 rounded-md"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
