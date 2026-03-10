import AdminPageHeader from "@/components/common/AdminPageHeader";
import { CandidateData } from "@/data/CandidateData";
import UsersListingWrapper from "@/components/users/UsersListingWrapper";

function UsersPage() {
  return (
    <>
      <AdminPageHeader
        title="USERS"
        subtitle={`${CandidateData.length} ACTIVE USERS`}
        actionButtonLink="/dashboard/users/new"
        actionButtonVariant="accent"
        actionButtonText="+ CREATE USER"
      />
      <UsersListingWrapper />
    </>
  );
}

export default UsersPage;