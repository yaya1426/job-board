import { dbConnect } from "@/lib/db";
import { ApplicationModel } from "@/lib/models/application.model";
import { Application } from "@/types/Application";
import { ObjectId } from "mongodb";

type ApplicationLean = Omit<Application, "id" | "appliedDate"> & {
  _id: { toString(): string };
  __v?: number;
  appliedDate: Date;
};

// Mapper function to convert the ApplicationLean type to the Application type (excluding the _id and __v fields)
function toApplication(doc: ApplicationLean): Application {
  const { _id, __v, candidateId, jobId, appliedDate, ...rest } = doc;
  return {
    id: _id.toString(),
    candidateId: candidateId.toString(),
    jobId: jobId.toString(),
    appliedDate:
      appliedDate instanceof Date
        ? appliedDate.toISOString().split("T")[0]
        : String(appliedDate),
    ...rest,
  };
}

export async function saveNewApplication(
  application: Omit<Application, "id" | "appliedDate">,
): Promise<Application> {
  await dbConnect();
  const newApplication = await ApplicationModel.create({
    ...application,
    candidateId: new ObjectId(application.candidateId),
  });
  return newApplication;
}

export async function findAllApplications(): Promise<Application[]> {
  await dbConnect();
  const applications = await ApplicationModel.find({}).lean<
    ApplicationLean[]
  >();
  return applications.map(toApplication);
}

export async function findApplicationById(
  id: string,
): Promise<Application | null> {
  await dbConnect();
  const application =
    await ApplicationModel.findById(id).lean<ApplicationLean>();
  return application ? toApplication(application) : null;
}

export async function findApplicationsByCandidateId(
  candidateId: string,
): Promise<Application[]> {
  await dbConnect();
  const applications = await ApplicationModel.find({ candidateId }).lean<
    ApplicationLean[]
  >();
  return applications.map(toApplication);
}

export async function findApplicationsByJobId(
  jobId: string,
): Promise<Application[]> {
  await dbConnect();
  const applications = await ApplicationModel.find({ jobId }).lean<
    ApplicationLean[]
  >();
  return applications.map(toApplication);
}

export async function findApplicationsByStatus(
  status: string,
): Promise<Application[]> {
  await dbConnect();
  const applications = await ApplicationModel.find({ status }).lean<
    ApplicationLean[]
  >();
  return applications.map(toApplication);
}