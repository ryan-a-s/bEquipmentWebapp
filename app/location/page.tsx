'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';

export default function LocationPage() {
  const router = useRouter();
  const { setLocation } = useAppContext();

  
    //Define the locations array here
  const locations = [
    { label: 'Wellington – Emergency Dept', value: 'Wellington Emergency Department' },
    { label: 'Wellington – Ward', value: 'Wellington Wards' },
    { label: 'Hutt – Emergency Dept', value: 'Hutt Emergency Department' },
    { label: 'Hutt – Ward', value: 'Hutt Wards' },
  ];

  const handleSelect = (value: string) => {
    setLocation(value);

    if (value.includes('Emergency')) {
      router.push('/patientNHI');
    } else {
      router.push('/wardlocation');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Where are you located?</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        {locations.map((loc) => (
          <button
            key={loc.value}
            onClick={() => handleSelect(loc.value)}
            className="bg-white border border-gray-300 rounded-lg p-4 shadow hover:bg-blue-100 transition"
          >
            {loc.label}
          </button>
        ))}
      </div>
    </div>
  );
}
