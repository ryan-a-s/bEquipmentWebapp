"use client";

import { useState } from "react";
import { useAppContext, PatientWeight } from "../../context/AppContext";
import { LocationCode, isWardLocation } from "../../context/locations";

type Props = {
  onNext: () => void;
};

// Weight categories for Emergency Departments
const edWeightCategories: { label: string; min: number; max: number | null }[] = [
  { label: "180 – 250kg", min: 180, max: 250 },
  { label: "250 – 350kg", min: 250, max: 350 },
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

    // Continue button enabled logic
  const canContinue = isWard
    ? Boolean(inputWeight && dependencyStatus)
    : selectedCategory !== null;


  return (
    <div className="flex flex-col">
      <h2 className="pb-2 text-lg font-medium">Patient Weight</h2>

      
      {/* Ward input */}
      {isWard && (
        <>
          <div className="pb-8">
            <input
              type="number"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              className={`
                  border-2 border-outline px-2 py-4 w-full rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                  ${inputWeight ? "bg-primaryC border-primaryC hover:bg-primary text-on-primary font-bold" : "text-on-surfaceV bg-surfaceHigh hover:bg-surfaceHighest"}
                `}
                placeholder="Enter weight in kg"
            />
          </div>
       
          <div className="pb-8">
            <h2 className="pb-2 text-lg font-medium">Patient Dependency</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setDependencyStatus("Independent")}
                className={`p-4 rounded-lg shadow-sm w-full transition  ${
                  dependencyStatus === "Independent"
                    ? "bg-primaryC text-on-primary font-bold"
                    : "bg-surfaceHigh hover:bg-surfaceHighest"
                }`}
              >
                Independent
              </button>
              <button
                onClick={() => setDependencyStatus("Dependent")}
                className={`p-4 rounded-lg shadow-sm w-full transition ${
                  dependencyStatus === "Dependent"
                    ? "bg-primaryC text-on-primary font-bold"
                    : "bg-surfaceHigh hover:bg-surfaceHighest"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-2 w-full pb-8">
          {edWeightCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(idx)}
              className={`p-4 rounded-lg shadow-sm w-full transition ${
                selectedCategory === idx
                  ? "bg-primaryC text-on-primary font-bold"
                  : "bg-surfaceHigh hover:bg-surfaceHighest"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <button
        disabled={!canContinue}
        onClick={handleNext}
        className={`self-center w-1/2 sm:w-1/3  p-4 rounded-lg transition ${
          canContinue
            ? "bg-accept-green text-on-primary font-bold hover:bg-accept-greenH shadow-sm"
            : "bg-surfaceV text-outline cursor-not-allowed"
        }`}
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
