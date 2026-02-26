import Link from "next/link";

type Props = { 
    params: Promise<{ applicationId: string }>;
};

async function ApplicationDetailsPage({ params }: Props) {
    const { applicationId } = await params;
    console.log(applicationId);
    return (
        <div>
            <h1>Application Details</h1>
            <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href={`/dashboard/applications/${applicationId}/review`}>Review Application</Link>
        </div>
    )
}

export default ApplicationDetailsPage;