import { ApiClient } from './ApiClient';
import { CatalogDoctor, CatalogFacility, CatalogPatient } from '../types/appointments';

export async function getPatientsCatalog(signal?: AbortSignal): Promise<CatalogPatient[]> {
  return ApiClient.get<CatalogPatient[]>('/patients', { signal });
}

export async function getDoctorsCatalog(signal?: AbortSignal): Promise<CatalogDoctor[]> {
  return ApiClient.get<CatalogDoctor[]>('/doctors', { signal });
}

export async function getFacilitiesCatalog(signal?: AbortSignal): Promise<CatalogFacility[]> {
  return ApiClient.get<CatalogFacility[]>('/facilities', { signal });
}

