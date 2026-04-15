import { createContext, ReactNode, useContext, useState } from "react";
import { Patient } from "../types/patient";

type PatientsContextType = {
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: number) => void;
};

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export const PatientsProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      nombre: "Juan",
      apellido: "Perez",
      documento: "123456",
      estado: "ACTIVO",
      telefono: "555-1234",
    },
  ]);

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient]);
  };

  const updatePatient = (updated: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const deletePatient = (id: number) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PatientsContext.Provider
      value={{ patients, addPatient, updatePatient, deletePatient }}
    >
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (!context) throw new Error("usePatients debe usarse dentro del Provider");
  return context;
};