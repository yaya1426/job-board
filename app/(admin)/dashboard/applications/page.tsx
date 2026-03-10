import AdminPageHeader from "@/components/common/AdminPageHeader";
import { ApplicationsData } from "@/data/ApplicationsData";
import ApplicationsListingWrapper from "@/components/applications/ApplicationsListingWrapper";

function ApplicationsManagementPage() {
  return (
    <>
      <AdminPageHeader
        title="APPLICATIONS"
        subtitle={`${ApplicationsData.length} ACTIVE APPLICATIONS`}
        actionButtonLink="/dashboard/users"
        actionButtonVariant="outline"
        actionButtonText="VIEW ALL USERS →"
      />
      <ApplicationsListingWrapper />
    </>
  );
}

export default ApplicationsManagementPage;
