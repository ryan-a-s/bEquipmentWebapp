"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { LocationCode } from "./locations";

// Patient weight type (exact or range)
export type PatientWeight = { min: number; max: number | null };

// Dependency status type
export type DependencyStatus = "Dependent" | "Independent" | null;

// Equipment selection
export type EquipmentSelection = Record<string, string | undefined>;

type AppContextType = {
  location: LocationCode | null;
  secondaryLocation: string | null;
  patientId: string | null;
  patientWeight: PatientWeight | null;
  dependencyStatus: DependencyStatus;
  equipment: EquipmentSelection;
  setLocation: (value: LocationCode | null) => void;
  setSecondaryLocation: (value: string | null) => void;
  setPatientId: (value: string | null) => void;
  setPatientWeight: (value: PatientWeight | null) => void;
  setDependencyStatus: (value: DependencyStatus) => void;
  setEquipment: (updates: EquipmentSelection) => void;
  resetContext: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationCode | null>(null);
  const [secondaryLocation, setSecondaryLocation] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientWeight, setPatientWeight] = useState<PatientWeight | null>(null);
  const [dependencyStatus, setDependencyStatus] = useState<DependencyStatus>(null);
  const [equipment, setEquipmentState] = useState<EquipmentSelection>({});

  const setEquipment = (updates: EquipmentSelection) => {
    setEquipmentState((prev) => ({ ...prev, ...updates }));
  };

  const resetContext = () => { //reset context function
    setLocationState(null);
    setSecondaryLocation(null);
    setPatientId(null);
    setPatientWeight(null);
    setDependencyStatus(null);
    setEquipmentState({});
  };

  return (
    <AppContext.Provider
      value={{
        location,
        secondaryLocation,
        patientId,
        patientWeight,
        dependencyStatus,
        equipment,
        setLocation: setLocationState,
        setSecondaryLocation,
        setPatientId,
        setPatientWeight,
        setDependencyStatus,
        setEquipment,
        resetContext,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used inside AppProvider");
  return context;
}
