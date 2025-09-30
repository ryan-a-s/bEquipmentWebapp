'use client';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Image from "next/image";

const BASE_PATH = '/bEquipmentWebapp'; // Only used for images, for github pages

interface PatientIDStepProps {
  onNext: () => void;
}

export default function PatientIDStep({ onNext }: PatientIDStepProps) {
  const { patientId, setPatientId } = useAppContext();
  const [localPatientId, setLocalPatientId] = useState(patientId || '');
  const [error, setError] = useState<string | null>(null);

  const validateNHI = (value: string) => {
    // Force uppercase
    const upperValue = value.toUpperCase();

    // Basic rules
    if (upperValue.length > 7) {
      setError('Entered NHI is too long, please re-check.');
      return false;
    }

    // Regex: 3 letters + 4 numbers
    const nhiPattern = /^[A-Z]{3}\d{4}$/;
    if (upperValue.length === 7 && !nhiPattern.test(upperValue)) {
      setError('Not a valid NHI (must be 3 letters followed by 4 numbers).');
      return false;
    }

    // If still typing but not invalid yet → clear error
    setError(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // uppercase input
    setLocalPatientId(value);
    validateNHI(value);
  };

  const handleNext = () => {
    if (!error && localPatientId.length === 7) {
      setPatientId(localPatientId);
      onNext();
    }
  };

  // Continue button only enabled if fully valid
  const canContinue =
    localPatientId.length === 7 && error === null;

  return (
    <div className="flex flex-col">
      <div className="pb-8">
        <h2 className="pb-2 text-lg font-medium">Enter Patient NHI:</h2>
        <input
          type="text"
          value={localPatientId}
          onChange={handleChange}
          maxLength={7}
          className={`
            border-2 px-2 py-4 w-full rounded-lg 
            focus:outline-none focus:border-primary
            ${error 
              ? "border-error focus:border-error bg-surfaceHigh text-on-surface font-bold"
              : localPatientId
                ? "bg-primaryC hover:bg-primary border-primaryC text-on-primary font-bold"
                : "border-outline text-on-surfaceV bg-surfaceHigh hover:bg-surfaceHighest"}
          `}
          placeholder="XXX1234"
        />
        {error && (
          <div className='flex align-middle gap-1 mt-2'>
            <Image className="" src={`${BASE_PATH}/error_red.svg`} alt="Error Icon" width={16} height={16}/>
            <p className="text-sm text-error">{error}</p>
          </div>
        )}
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
