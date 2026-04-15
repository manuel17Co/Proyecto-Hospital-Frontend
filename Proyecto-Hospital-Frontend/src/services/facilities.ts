import { ApiClient } from './ApiClient';
import { Facility, FacilityPayload } from '../types/facilities';

export async function getFacilities(signal?: AbortSignal): Promise<Facility[]> {
  return ApiClient.get<Facility[]>('/facilities', { signal });
}

export async function getFacilityById(id: number | string, signal?: AbortSignal): Promise<Facility> {
  return ApiClient.get<Facility>(`/facilities/${id}`, { signal });
}

export async function createFacility(payload: FacilityPayload): Promise<Facility> {
  return ApiClient.post<Facility>('/facilities', payload);
}

export async function updateFacility(id: number | string, payload: FacilityPayload): Promise<Facility> {
  return ApiClient.put<Facility>(`/facilities/${id}`, payload);
}

export async function deleteFacility(id: number | string): Promise<void> {
  await ApiClient.delete<unknown>(`/facilities/${id}`);
}
