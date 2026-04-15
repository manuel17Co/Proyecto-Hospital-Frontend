import { ApiClient } from './ApiClient';
import { Doctor, DoctorPayload } from '../types/doctors';

export async function getDoctors(signal?: AbortSignal): Promise<Doctor[]> {
  return ApiClient.get<Doctor[]>('/doctors', { signal });
}

export async function getDoctorById(id: number | string, signal?: AbortSignal): Promise<Doctor> {
  return ApiClient.get<Doctor>(`/doctors/${id}`, { signal });
}

export async function createDoctor(payload: DoctorPayload): Promise<Doctor> {
  return ApiClient.post<Doctor>('/doctors', payload);
}

export async function updateDoctor(id: number | string, payload: DoctorPayload): Promise<Doctor> {
  return ApiClient.put<Doctor>(`/doctors/${id}`, payload);
}

export async function deleteDoctor(id: number | string): Promise<void> {
  await ApiClient.delete<unknown>(`/doctors/${id}`);
}
