import { ApplicationsData } from "@/data/ApplicationsData";
import { Application, ServiceResult } from "@/types";

export async function getApplications(): Promise<ServiceResult<Application[]>> {
  // TODO: Database will solve this
  return { success: true, data: ApplicationsData };
}
