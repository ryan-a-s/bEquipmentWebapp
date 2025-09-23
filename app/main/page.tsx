'use client';
import { useState } from 'react';
import LocationStep from '../steps/LocationStep';
import PatientIDStep from '../steps/PatientIDStep';
import WeightStep from '../steps/WeightStep';
import EquipmentStep from '../steps/EquipmentStep';
import { useAppContext } from '../../context/AppContext';
import { getLocationLabel, isWardLocation } from '../../context/locations';

export default function Main() {
  const [activeStep, setActiveStep] = useState(1);
  const { location, secondaryLocation, patientId, patientWeight, dependencyStatus, equipment } =
    useAppContext();

  const getWeightSummary = () => {
    if (!patientWeight) return '';
    if (location && !isWardLocation(location)) {
      // ED: show weight category
      if (patientWeight.min && patientWeight.max)
        return `${patientWeight.min} – ${patientWeight.max} kg`;
      return `${patientWeight.min}+ kg`;
    }
    // Ward: show exact weight and dependency if set
    return `${patientWeight.min}kg${dependencyStatus ? ' – ' + dependencyStatus : ''}`;
  };

  const getEquipmentSummary = () => {
    if (!equipment || Object.keys(equipment).length === 0) return '';
    // display category: item selected
    return Object.entries(equipment)
      .map(([category, item]) => `${category}: ${item}`)
      .join(', ');
  };

    const steps = [
      {
        id: 1,
        title: 'Location',
        completed: !!location,
        summary: location
          ? `${getLocationLabel(location)}${secondaryLocation ? ' – ' + secondaryLocation : ''}`
          : '',
      },
      {
        id: 2,
        title: 'Patient ID',
        completed: !!patientId,
        summary: patientId ?? '',
      },
      {
        id: 3,
        title: 'Weight',
        completed:
          !!patientWeight && (location && isWardLocation(location) ? !!dependencyStatus : true),
        summary: getWeightSummary(), // use helper here
      },
      {
        id: 4,
        title: 'Equipment',
        completed: Object.keys(equipment).length > 0,
        summary: Object.keys(equipment).length
          ? `${Object.keys(equipment).length} items selected`
          : '',
      },
    ];



  const handleNextStep = (currentId: number) => {
    const nextStep = currentId + 1;
    if (nextStep <= steps.length) setActiveStep(nextStep);
  };

  return (
    <div className="flex-col items-center max-w-2xl mx-auto px-8 py-8 space-y-4">
      {steps.map((step) => (
        <div key={step.id} className="rounded-2xl shadow-sm overflow-hidden">
          <button
            className={`
              w-full px-4 py-2 flex justify-between items-center text-xl font-bold
              ${activeStep === step.id || step.completed
                ? "text-on-primary bg-primary hover:bg-primaryC"
                : "text-on-primary bg-primaryI text-gray-500"}
            `}
            onClick={() => setActiveStep(activeStep === step.id ? 0 : step.id)}
          >
            {/* Left side */}
            <span className="text-left">{step.title}</span>

            {/* Right side */}
            {step.summary && (
              <span className="text-base font-medium text-on-primary text-right">
                {step.summary}
              </span>
            )}
          </button>

          {activeStep === step.id && (
            <div className="p-4 bg-surfaceLowest border-x-2 border-b-2 rounded-b-2xl border-outlineV">
              {step.id === 1 && <LocationStep onNext={() => handleNextStep(1)} />}
              {step.id === 2 && <PatientIDStep onNext={() => handleNextStep(2)} />}
              {step.id === 3 && <WeightStep onNext={() => handleNextStep(3)} />}
              {step.id === 4 && <EquipmentStep onNext={() => handleNextStep(4)} />}
            </div>
          )}
        </div>
      ))}
    </div>
  );

}
