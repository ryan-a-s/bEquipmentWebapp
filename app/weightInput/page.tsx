'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext, PatientWeight, DependencyStatus } from '../../context/AppContext';

export default function WeightInputPage() {
  const { location, secondaryLocation, patientId,patientWeight, setPatientWeight, dependencyStatus, setDependencyStatus } = useAppContext();
  const [exactWeight, setExactWeight] = useState<number | "">(patientWeight?.min ?? "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof exactWeight !== "number" || exactWeight <= 0) {
      alert("Please enter a valid weight.");
      return;
    }

    // Store exact weight
    setPatientWeight({ min: exactWeight, max: exactWeight });

    // Ensure dependency status is selected
    if (!dependencyStatus) {
      alert("Please select if the patient is dependent or independent.");
      return;
    }

    // Navigate to next page
    router.push("/requiredEquipmentChoice");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <p className="mb-2">Current Location: {location}{secondaryLocation && ` : ${secondaryLocation}`}</p>
        <p className="mb-2">Patient: {patientId}</p>
      <h1 className="text-xl font-bold mb-4">Enter Exact Patient Weight</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-md"
      >
        <input
          type="number"
          value={exactWeight}
          onChange={(e) => setExactWeight(Number(e.target.value))}
          placeholder="Exact weight in kg"
          className="border border-gray-300 rounded p-2 w-full mb-4"
          required
          min={0}
        />

        {/* Dependency selection */}
        <div className="flex flex-col items-center w-full mb-4">
          <p className="mb-2 font-medium">Patient dependency:</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setDependencyStatus("dependent")}
              className={`px-4 py-2 rounded-lg ${
                dependencyStatus === "dependent" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
              }`}
            >
              Dependent
            </button>
            <button
              type="button"
              onClick={() => setDependencyStatus("independent")}
              className={`px-4 py-2 rounded-lg ${
                dependencyStatus === "independent" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
              }`}
            >
              Independent
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}