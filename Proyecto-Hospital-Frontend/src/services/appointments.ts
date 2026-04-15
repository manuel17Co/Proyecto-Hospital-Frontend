import { ApiClient } from './ApiClient';
import {
  Appointment,
  AppointmentPayload,
  AppointmentStatus,
  AppointmentStatusPayload,
} from '../types/appointments';

export async function getAppointments(signal?: AbortSignal): Promise<Appointment[]> {
  return ApiClient.get<Appointment[]>('/appointments', { signal });
}

export async function getAppointmentById(id: number | string, signal?: AbortSignal): Promise<Appointment> {
  return ApiClient.get<Appointment>(`/appointments/${id}`, { signal });
}

export async function createAppointment(payload: AppointmentPayload): Promise<Appointment> {
  return ApiClient.post<Appointment>('/appointments', payload);
}

export async function updateAppointment(id: number | string, payload: AppointmentPayload): Promise<Appointment> {
  return ApiClient.put<Appointment>(`/appointments/${id}`, payload);
}

export async function deleteAppointment(id: number | string): Promise<void> {
  await ApiClient.delete<unknown>(`/appointments/${id}`);
}

export async function updateAppointmentStatus(
  id: number | string,
  estado: AppointmentStatus,
): Promise<Appointment> {
  const payload: AppointmentStatusPayload = { estado };
  return ApiClient.patch<Appointment>(`/appointments/${id}/status`, payload);
}

