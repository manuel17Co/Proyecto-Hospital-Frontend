export type Patient = {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  estado: "ACTIVO" | "INACTIVO";
};