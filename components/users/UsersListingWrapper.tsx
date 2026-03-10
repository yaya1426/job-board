"use client";
import UsersProvider from "@/context/users/UsersProvider";
import UsersStats from "./UsersStats";
import UsersSearch from "./UsersSearch";
import UsersList from "./UsersList";

function UsersListingWrapper() {
  return (
    <UsersProvider>
      <UsersStats />
      <UsersSearch />
      <UsersList />
    </UsersProvider>
  );
}

export default UsersListingWrapper;
