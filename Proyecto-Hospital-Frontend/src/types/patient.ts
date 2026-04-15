export type Patient = {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  estado: "ACTIVO" | "INACTIVO";
};