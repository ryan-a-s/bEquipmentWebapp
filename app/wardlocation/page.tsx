'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';

export default function WardNamePage() {
  const { location, secondaryLocation, setSecondaryLocation } = useAppContext();
  const [inputValue, setInputValue] = useState(secondaryLocation ?? "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecondaryLocation(inputValue); // store ward name in context
    router.push('/patientNHI'); // navigate to next page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <h1 className="text-xl font-bold mb-4">Ward Entry</h1>
      <p className="mb-2">Location: {location}</p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-md"
      >
        <label className="mb-2 self-start">Enter Ward Name:</label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mb-4"
          placeholder="Ward Name"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}