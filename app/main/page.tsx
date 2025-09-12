'use client';
import { useState } from 'react';
import LocationStep from '../steps/LocationStep';
import PatientIDStep from '../steps/PatientIDStep';
import WeightStep from '../steps/WeightStep';
import EquipmentStep from '../steps/EquipmentStep';
import { useAppContext } from '../../context/AppContext';

export default function Main() {
  const [activeStep, setActiveStep] = useState(1);
  const { location, patientId, patientWeight, dependencyStatus, equipment } = useAppContext();

  const steps = [
    { id: 1, title: 'Location', completed: !!location },
    { id: 2, title: 'Patient ID', completed: !!patientId },
    { id: 3, title: 'Weight', completed: !!patientWeight && (location?.includes('Ward') ? !!dependencyStatus : true) },
    { id: 4, title: 'Equipment', completed: Object.keys(equipment).length > 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      {steps.map((step) => (
        <div key={step.id} className="border rounded shadow-sm">
          <button
            className="w-full p-3 text-left font-bold flex justify-between items-center bg-gray-100 hover:bg-gray-200"
            onClick={() => setActiveStep(activeStep === step.id ? 0 : step.id)}
          >
            <span>{`Step ${step.id}: ${step.title}`}</span>
            {step.completed && <span className="text-green-600">✅</span>}
          </button>

          {activeStep === step.id && (
            <div className="p-4 bg-white">
              {step.id === 1 && <LocationStep onNext={() => setActiveStep(2)} />}
              {step.id === 2 && <PatientIDStep onNext={() => setActiveStep(3)} />}
              {step.id === 3 && <WeightStep onNext={() => setActiveStep(4)} />}
              {step.id === 4 && <EquipmentStep />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}