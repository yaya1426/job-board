"use client";
import UsersProvider from "@/context/users/UsersProvider";
import UsersStats from "./UsersStats";
import UsersSearch from "./UsersSearch";
import UsersList from "./UsersList";
import { Job } from "@/types/Job";

type Props = {
  jobs: Job[];
};

function UsersListingWrapper({ jobs }: Props) {
  return (
    <UsersProvider jobs={jobs}>
      <UsersStats />
      <UsersSearch />
      <UsersList />
    </UsersProvider>
  );
}

export default UsersListingWrapper;
