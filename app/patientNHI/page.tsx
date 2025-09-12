'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';

export default function PatientIDPage() {
  const { location, secondaryLocation, patientId, setPatientId } = useAppContext();
  const [inputValue, setInputValue] = useState(patientId ?? "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientId(inputValue);

    if (location?.includes('Emergency')) {
      router.push('/weightCategories');
    } else if (location?.includes('Wards')){
      router.push('/weightInput');
    } else {
      alert('Unknown location, please go back and select again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <h1 className="text-xl font-bold mb-4">Enter Patient NHI</h1>
      <p className="mb-2">Current Location: {location}{secondaryLocation && ` : ${secondaryLocation}`}</p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-md"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Patient NHI"
          className="border border-gray-300 rounded p-2 w-full mb-4"
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