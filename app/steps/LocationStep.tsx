'use client';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

interface LocationStepProps {
  onNext: () => void;
}

export default function LocationStep({ onNext }: LocationStepProps) {
  const { location, setLocation, secondaryLocation, setSecondaryLocation } = useAppContext();
  const [localLocation, setLocalLocation] = useState(location || '');
  const [localSecondary, setLocalSecondary] = useState(secondaryLocation || '');

  const locations = [
    { label: 'Wellington – Emergency Dept', value: 'Wellington Emergency Department' },
    { label: 'Wellington – Ward', value: 'Wellington Wards' },
    { label: 'Hutt – Emergency Dept', value: 'Hutt Emergency Department' },
    { label: 'Hutt – Ward', value: 'Hutt Wards' },
  ];

  const isWard = localLocation.includes('Ward');

  const handleNext = () => {
    setLocation(localLocation);
    if (isWard) setSecondaryLocation(localSecondary);
    onNext();
  };

  return (
    <div className="space-y-4">
      <label className="block font-semibold mb-2">Select Primary Location:</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {locations.map((loc) => (
          <button
            key={loc.value}
            onClick={() => setLocalLocation(loc.value)}
            className={`p-3 border rounded-lg text-left font-medium transition ${
              localLocation === loc.value ? 'bg-blue-200 border-blue-600' : 'bg-white hover:bg-gray-50'
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>

      {isWard && (
        <div className="mt-4">
          <label className="block font-semibold mb-1">Enter Ward Name:</label>
          <input
            type="text"
            value={localSecondary}
            onChange={(e) => setLocalSecondary(e.target.value)}
            placeholder="Ward Name"
            className="border p-2 w-full rounded"
          />
        </div>
      )}

      <button
        onClick={handleNext}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        disabled={!localLocation || (isWard && !localSecondary)}
      >
        Next
      </button>
    </div>
  );
}