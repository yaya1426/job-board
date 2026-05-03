import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/db";
import { JobModel } from "@/lib/models/job.model";
import { Job } from "@/types/Job";
import { CreateJobInput } from "@/services/jobs/jobs.validation";

type JobLean = Omit<Job, "id" | "posted"> & {
  _id: { toString(): string };
  __v?: number;
  posted: Date;
};

// Mapper function to convert the JobLean type to the Job type (excluding the _id and __v fields)
function toJob(doc: JobLean): Job {
  const { _id, __v, posted, ...rest } = doc;
  return {
    id: _id.toString(),
    posted:
      posted instanceof Date
        ? posted.toISOString().split("T")[0]
        : String(posted),
    ...rest,
  };
}

export async function saveNewJob(job: CreateJobInput): Promise<Job> {
  await dbConnect();
  const newJob = await JobModel.create(job);
  return toJob(newJob);
}

export async function findAllJobs(): Promise<Job[]> {
  await dbConnect();
  const jobs = await JobModel.aggregate([
    {
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "jobId",
        as: "applications",
      },
    },
    {
      $addFields: {
        applicants: { $size: "$applications" },
      },
    },
    {
      $project: {
        applications: 0,
      },
    },
  ]);

  return jobs.map(toJob);
}

export async function findJobById(id: string): Promise<Job | null> {
  await dbConnect();
  const job = await JobModel.aggregate([
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "jobId",
        as: "applications",
      },
    },
    {
      $addFields: {
        applicants: { $size: "$applications" },
      },
    },
    {
      $project: {
        applications: 0,
      },
    },
  ]);
  return job.length > 0 ? toJob(job[0]) : null;
}
