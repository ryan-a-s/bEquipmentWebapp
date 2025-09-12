"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Patient weight type (exact or range)
export type PatientWeight = { min: number; max: number | null };

// Dependency status type
export type DependencyStatus = "dependent" | "independent" | null;

// Equipment type
import { EquipmentItem } from "./equipment";

// Equipment selection: category → selected item name
export type EquipmentSelection = Record<string, string>;

type AppContextType = {
  location: string | null;
  secondaryLocation: string | null;
  patientId: string | null;
  patientWeight: PatientWeight | null;
  dependencyStatus: DependencyStatus;
  equipment: EquipmentSelection;
  setLocation: (value: string | null) => void;
  setSecondaryLocation: (value: string | null) => void;
  setPatientId: (value: string | null) => void;
  setPatientWeight: (value: PatientWeight | null) => void;
  setDependencyStatus: (value: DependencyStatus) => void;
  setEquipment: React.Dispatch<React.SetStateAction<EquipmentSelection>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<string | null>(null);
  const [secondaryLocation, setSecondaryLocation] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientWeight, setPatientWeight] = useState<PatientWeight | null>(null);
  const [dependencyStatus, setDependencyStatus] = useState<DependencyStatus>(null);
  const [equipment, setEquipment] = useState<EquipmentSelection>({});

  return (
    <AppContext.Provider
      value={{
        location,
        secondaryLocation,
        patientId,
        patientWeight,
        dependencyStatus,
        equipment,
        setLocation,
        setSecondaryLocation,
        setPatientId,
        setPatientWeight,
        setDependencyStatus,
        setEquipment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
}