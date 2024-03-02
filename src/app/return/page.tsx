// pages/return/index.tsx

"use client"

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'

const ReturnPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')

  useEffect(() => {
    if (session_id) {
      // Fetch the session details from your API and handle the success logic
      fetch(`/api/handle-success?session_id=${session_id}`)
        .then((response) => response.json())
        .then((data) => {
          // Handle response data, e.g., showing a success message, redirecting, etc.
          console.log('Purchase was successful:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [session_id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Purchase Successful!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
          Your purchase was completed successfully. You can now create your password to access your account.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => router.push(`/create-password?session_id=${session_id}`)} // Adjust the route as necessary
              >
                Create Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPage;