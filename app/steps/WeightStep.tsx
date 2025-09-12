'use client';
import { useState } from 'react';
import { useAppContext, DependencyStatus } from '../../context/AppContext';

interface WeightStepProps {
  onNext: () => void;
}

export default function WeightStep({ onNext }: WeightStepProps) {
  const { location, patientWeight, setPatientWeight, dependencyStatus, setDependencyStatus } =
    useAppContext();

  const [localWeight, setLocalWeight] = useState(patientWeight?.min || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    patientWeight?.max ? `${patientWeight.min}-${patientWeight.max}` : null
  );
  const [localDependency, setLocalDependency] = useState<DependencyStatus>(dependencyStatus);
  const [showAlert, setShowAlert] = useState(false);
  const [nextWeight, setNextWeight] = useState<number | null>(null);

  const isWard = location?.includes('Ward');
  const isED = location?.includes('Emergency');

  const categories = [
    { label: '180–250kg', min: 180, max: 250 },
    { label: '250–350kg', min: 250, max: 350 },
    { label: '350+ kg', min: 350, max: null },
  ];

  const handleNext = () => {
    if (isWard) {
      if (!localDependency || !localWeight) return;
      const weightNum = Number(localWeight);

      // Trigger alert for specific conditions
      if (weightNum >= 250 && location === 'Hutt Emergency Department') {
        setNextWeight(weightNum);
        setShowAlert(true);
        return;
      }

      setDependencyStatus(localDependency);
      setPatientWeight({ min: weightNum, max: weightNum });
      onNext();
    } else if (isED && selectedCategory) {
      const cat = categories.find((c) => c.label === selectedCategory)!;

      // Alert for ED weight
      if ((cat.min >= 250 || (cat.max && cat.max >= 250)) && location === 'Hutt Emergency Department') {
        setNextWeight(cat.min);
        setShowAlert(true);
        return;
      }

      setPatientWeight({ min: cat.min, max: cat.max });
      onNext();
    }
  };

  const handleAlertOk = () => {
    if (nextWeight !== null) {
      setPatientWeight({ min: nextWeight, max: nextWeight });
      setNextWeight(null);
    }
    setShowAlert(false);
    onNext();
  };

  return (
    <div className="space-y-4">
      {isED && (
        <>
          <label>Select weight category:</label>
          <div className="space-y-2">
            {categories.map((c) => (
              <button
                key={c.label}
                onClick={() => setSelectedCategory(c.label)}
                className={`px-4 py-2 border rounded ${
                  selectedCategory === c.label ? 'bg-blue-200' : 'bg-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </>
      )}

      {isWard && (
        <>
          <label>Enter exact weight:</label>
          <input
            type="number"
            value={localWeight}
            onChange={(e) => setLocalWeight(e.target.value)}
            className="border p-2 w-full"
          />

          <label className="mt-2">Patient Dependency Status:</label>
          <div className="flex gap-4 mt-1">
            <button
              onClick={() => setLocalDependency('independent')}
              className={`px-4 py-2 border rounded ${
                localDependency === 'independent' ? 'bg-blue-200' : 'bg-white'
              }`}
            >
              Independent
            </button>
            <button
              onClick={() => setLocalDependency('dependent')}
              className={`px-4 py-2 border rounded ${
                localDependency === 'dependent' ? 'bg-blue-200' : 'bg-white'
              }`}
            >
              Dependent
            </button>
          </div>
        </>
      )}

      <button
        onClick={handleNext}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        disabled={(isED && !selectedCategory) || (isWard && (!localWeight || !localDependency))}
      >
        Next
      </button>

      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
            <h2 className="text-lg font-bold mb-4">Alert</h2>
            <p className="mb-6">
              Any patient over 250kg needing hoisting at Hutt Emergency will need to be in an ICU bedspace.
              Check availability. If unavailable, consider diverting patient/ambulance to Wellington.
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
