"use client";

import { useState } from "react";
import { useAppContext, PatientWeight } from "../../context/AppContext";
import { LocationCode, isWardLocation } from "../../context/locations";

type Props = {
  onNext: () => void;
};

// Weight categories for Emergency Departments
const edWeightCategories: { label: string; min: number; max: number | null }[] = [
  { label: "180 – 250 kg", min: 180, max: 250 },
  { label: "250 – 350 kg", min: 250, max: 350 },
  { label: "350+ kg", min: 350, max: null },
];

// ED-specific alert rules (partial to avoid TS errors)
const edAlerts: Partial<
  Record<LocationCode, { threshold: number; message: string }>
> = {
  // Hutt ED
  "F3S638-G": {
    threshold: 200,
    message:
      "Any dependent patient over 200kg at Hutt Emergency will need ICU bedspace for hoisting - check availability. If not available, check availability of Wellington Wards (400kg), or ICU (500kg) bedspace with bariatric hoist.",
  },
  // Wellington ED
  "F3M163-E": {
    threshold: 400,
    message:
      "Any dependent patient over 400kg at Wellington Emergency will need ICU bedspace for hoisting - check availability. If not available, check availability of Hutt ICU (500kg) bedspace with bariatric hoist.",
  },
};

export default function WeightStep({ onNext }: Props) {
  const {
    location,
    patientWeight,
    setPatientWeight,
    dependencyStatus,
    setDependencyStatus,
  } = useAppContext();

  const [inputWeight, setInputWeight] = useState<string>(
    patientWeight?.min?.toString() ?? ""
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [nextWeight, setNextWeight] = useState<PatientWeight | null>(null);

  if (!location) return <p className="p-4">No location selected.</p>;

  const isWard = isWardLocation(location);
  const isED = !isWard;

  const handleNext = () => {
    if (isWard) {
      const weightNum = parseInt(inputWeight, 10);
      if (isNaN(weightNum) || weightNum <= 0) return;

      setPatientWeight({ min: weightNum, max: weightNum });
      onNext();
    } else if (isED) {
      if (selectedCategory === null) return;

      const category = edWeightCategories[selectedCategory];

      // Check if current ED has an alert rule
      const alertRule = edAlerts[location];
      if (
        alertRule &&
        (category.min >= alertRule.threshold || (category.max ?? Infinity) >= alertRule.threshold)
      ) {
        setNextWeight({ min: category.min, max: category.max });
        setAlertMessage(alertRule.message);
        return;
      }


      // Otherwise just save weight + continue
      setPatientWeight({ min: category.min, max: category.max });
      onNext();
    }
  };

  const handleAlertOk = () => {
    if (nextWeight) {
      setPatientWeight(nextWeight);
      setAlertMessage(null);
      onNext();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Patient Weight</h2>

      {/* Ward input */}
      {isWard && (
        <>
          <input
            type="number"
            value={inputWeight}
            onChange={(e) => setInputWeight(e.target.value)}
            placeholder="Enter weight in kg"
            className="border p-2 rounded w-full max-w-xs"
          />

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Patient Dependency</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setDependencyStatus("independent")}
                className={`px-4 py-2 rounded-lg ${
                  dependencyStatus === "independent"
                    ? "bg-blue-200 border border-blue-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Independent
              </button>
              <button
                onClick={() => setDependencyStatus("dependent")}
                className={`px-4 py-2 rounded-lg ${
                  dependencyStatus === "dependent"
                    ? "bg-blue-200 border border-blue-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Dependent
              </button>
            </div>
          </div>
        </>
      )}

      {/* ED weight categories */}
      {isED && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md">
          {edWeightCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(idx)}
              className={`p-2 border rounded ${
                selectedCategory === idx
                  ? "bg-blue-200 border-blue-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleNext}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Continue
      </button>

      {/* Alert modal */}
      {alertMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
            <h2 className="text-lg font-bold mb-4">Alert</h2>
            <p className="mb-6">{alertMessage}</p>
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
