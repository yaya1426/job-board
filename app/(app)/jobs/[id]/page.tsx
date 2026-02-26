type Props = {
  params: Promise<{ id: string }>;
};

async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  console.log(id);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Job Details</h1>
      <div className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-md p-4">
        <h2 className="text-2xl font-bold">Frontend Engineer</h2>
        <p className="text-gray-500">Remote Position</p>
        <p>We are looking for a Frontend Engineer with 3 years of experience in React, Next.js, and Tailwind CSS.</p>
      </div>
    </div>
  );
}

export default JobDetailsPage;
