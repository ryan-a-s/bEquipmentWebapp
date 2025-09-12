'use client';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

interface PatientIDStepProps {
  onNext: () => void;
}

export default function PatientIDStep({ onNext }: PatientIDStepProps) {
  const { patientId, setPatientId } = useAppContext();
  const [localPatientId, setLocalPatientId] = useState(patientId || '');

  const handleNext = () => {
    setPatientId(localPatientId);
    onNext();
  };

  return (
    <div className="space-y-4">
      <label>Enter Patient NHI:</label>
      <input
        type="text"
        value={localPatientId}
        onChange={(e) => setLocalPatientId(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={handleNext}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        disabled={!localPatientId}
      >
        Next
      </button>
    </div>
  );
}