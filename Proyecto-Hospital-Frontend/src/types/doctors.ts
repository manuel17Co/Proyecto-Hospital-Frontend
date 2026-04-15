export type Doctor = {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
};

export type DoctorPayload = {
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
};
