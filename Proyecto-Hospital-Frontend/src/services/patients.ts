import { ApiClient } from './ApiClient';
import { Patient, PatientPayload } from '../types/patient';

export async function getPatients(signal?: AbortSignal): Promise<Patient[]> {
  return ApiClient.get<Patient[]>('/patients', { signal });
}

export async function getPatientById(id: number | string, signal?: AbortSignal): Promise<Patient> {
  return ApiClient.get<Patient>(`/patients/${id}`, { signal });
}

export async function createPatient(payload: PatientPayload): Promise<Patient> {
  return ApiClient.post<Patient>('/patients', payload);
}

export async function updatePatient(id: number | string, payload: PatientPayload): Promise<Patient> {
  return ApiClient.put<Patient>(`/patients/${id}`, payload);
}

export async function deletePatient(id: number | string): Promise<void> {
  await ApiClient.delete<unknown>(`/patients/${id}`);
}
