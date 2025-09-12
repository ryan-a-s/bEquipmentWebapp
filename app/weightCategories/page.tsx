'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext, PatientWeight } from '../../context/AppContext';

export default function WeightCategoriesPage() {
  const { location,secondaryLocation, patientId, setPatientWeight } = useAppContext();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [nextWeight, setNextWeight] = useState<PatientWeight | null>(null);

  const handleSelect = (min: number, max: number | null) => {
    const selectedWeight: PatientWeight = { min, max };

    // Check for popup condition: weight >= 250 and location matches
    if (min >= 250 && location === "hutt_emergency") { // check weight and if hutt
      setNextWeight(selectedWeight);
      setShowAlert(true); // show modal
    } else {
      setPatientWeight(selectedWeight);
      router.push("/requiredEquipmentChoice"); // proceed normally
    }
  };

  const handleAlertOk = () => {
    if (nextWeight) {
      setPatientWeight(nextWeight);
      setShowAlert(false);
      router.push("/requiredEquipmentChoice"); //send to next page after OK
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <p className="mb-2">Current Location: {location}{secondaryLocation && ` : ${secondaryLocation}`}</p>
      <p className="mb-2">Patient: {patientId}</p>
      <h1 className="text-xl font-bold mb-6">Select Patient Weight</h1>

      <div className="grid gap-4 w-full max-w-md">
        <button
          onClick={() => handleSelect(180, 250)}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          180 – 250 kg
        </button>

        <button
          onClick={() => handleSelect(250, 350)}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          250 – 350 kg
        </button>

        <button
          onClick={() => handleSelect(350, null)}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          350+ kg
        </button>
      </div>

      {/* Modal pop up */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
            <h2 className="text-lg font-bold mb-4">Alert</h2>
            <p className="mb-6">
              Any patient over 300kg needing hoisting will need to be in ICU bedspace - check availability - if not available consider diverting patient / ambulance to Wellington
            </p>
            <button
              onClick={handleAlertOk}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}