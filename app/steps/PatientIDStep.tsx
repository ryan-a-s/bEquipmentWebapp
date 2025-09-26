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

  // Continue button enabled logic
  const canContinue = localPatientId;

  return (
    <div className="flex flex-col">
      <div className="pb-8">
        <h2 className="pb-2 text-lg font-medium">Enter Patient NHI:</h2>
        <input
          type="text"
          value={localPatientId}
          onChange={(e) => setLocalPatientId(e.target.value)}
          className={`
                border-2 border-outline px-2 py-4 w-full rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                ${localPatientId ? "bg-primaryC hover:bg-primary border-primaryC text-on-primary font-bold" : "text-on-surfaceV bg-surfaceHigh hover:bg-surfaceHighest"}
              `}
              placeholder= "XXX1234"
        />
      </div>
      
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
    </div>
  );
}