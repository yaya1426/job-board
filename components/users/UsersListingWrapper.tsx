"use client";
import UsersProvider from "@/context/users/UsersProvider";
import UsersStats from "./UsersStats";
import UsersSearch from "./UsersSearch";
import UsersList from "./UsersList";
import { Job } from "@/types/Job";
import { Application, Candidate } from "@/types";

type Props = {
  jobs: Job[];
  applications: Application[];
  candidates: Candidate[];
};

function UsersListingWrapper({ jobs, applications, candidates }: Props) {
  return (
    <UsersProvider jobs={jobs} applications={applications} candidates={candidates}>
      <UsersStats />
      <UsersSearch />
      <UsersList />
    </UsersProvider>
  );
}

export default UsersListingWrapper;
