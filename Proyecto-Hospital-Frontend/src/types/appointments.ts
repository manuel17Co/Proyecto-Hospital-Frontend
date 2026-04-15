export type AppointmentStatus = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';

export type PatientRef = {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  estado: string;
};

export type Appointment = {
  id: number;
  fechaHora: string;
  estado: AppointmentStatus;
  paciente: PatientRef;
  medicoId: number;
  instalacionId: number;
  notas: string;
};

export type AppointmentPayload = {
  pacienteId: number;
  medicoId: number;
  instalacionId: number;
  fechaHora: string;
  notas: string;
};

export type AppointmentStatusPayload = {
  estado: AppointmentStatus;
};

export type CatalogPatient = {
  id: number;
  nombre: string;
  apellido: string;
};

export type CatalogDoctor = {
  id: number;
  nombre: string;
  apellido?: string;
  especialidad?: string;
};

export type CatalogFacility = {
  id: number;
  nombre: string;
  tipo?: string;
};

