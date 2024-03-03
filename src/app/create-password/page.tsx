"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CreatePassword() {
  const [searchParams] = useSearchParams();
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [sessionId, setSessionId] = useState('');

  const router = useRouter()

  useEffect(() => {
    // Assuming searchParams is a URLSearchParams object or similar
        const session_id = searchParams[1];
    if (session_id) {
      setSessionId(session_id); // Set session_id state to prevent re-fetching
    }
  }, [searchParams.toString()]); // Convert searchParams to string to track actual changes

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (sessionId) {
        const response = await fetch(`/api/retrieve-session?session_id=${sessionId}`);
        const data = await response.json();
        if (data.success) {
            console.log('Session details:', data.session.name + ' ' + data.session.email);
          setUserDetails({
            name: data.session.name,
            email: data.session.email,
          });
        } else {
          console.error('Failed to retrieve session details');
        }
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  useEffect(() => {
    console.log('Updated userDetails:', userDetails);
  }, [userDetails]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Implement the logic to send the password to your backend for saving
    const response = await fetch('/api/update-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userDetails.email,
        password, // Remember to securely handle the password in your backend
        activated: true,
      }),
    });

    const data = await response.json();
    if (data.success) {
      console.log('Password set successfully');
      router.push('/signin');
      
    } else {
      console.error('Failed to set password');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter a secure password to protect your account.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black">Name</label>
              <input type="text" name="name" id="name" autoComplete="name" required className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={userDetails.name} disabled />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">Email address</label>
<input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={userDetails.email}
                    disabled
                  /> 
                  </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
              <input type="password" name="password" id="password" autoComplete="new-password" required className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Set Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}