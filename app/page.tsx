'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from "react";


export default function Home() {

  const [formCode, setFormCode] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const router = useRouter();
  
  return (
    <div className="flex justify-center p-10">
      <div className="w-1/2 bg-red-50 px-20 rounded-2xl flex flex-col shadow-md">
        <div className="flex flex-col justify-evenly min-h-150">
          <h1 className="flex justify-center text-2xl">
            Welcome! You have been invited to participate in a poll!
          </h1>

          <form
            className="flex flex-col justify-center gap-4 items-center"
            onSubmit={(e) => {
              e.preventDefault(); // Prevent default form submission
              if (formCode.trim()) {
                router.push(`/polls/${formCode}`);
              }
            }}
          >
            <h1>Put in the form code</h1>
            <div>
              <input
                type="text"
                placeholder="ex: 1234"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm "
              />
              <button
                type="submit"
                className="cursor-pointer border rounded px-3 bg-black text-red-50"
              >
                Take me there!
              </button>
            </div>
          </form>


          <div className='flex flex-row justify-evenly mt-10'>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-40 h-40 cursor-pointer border-2 border-black rounded-3xl bg-gray-100"
            >
              <img src="/images/DashboardPic.jpeg" alt="create a poll" className="w-full h-full object-cover rounded-3xl"/>
            </button>


            {/* Creating a poll button */}
              <button
                onClick={() => router.push('/create')}
                className="w-40 h-40 cursor-pointer border-2 border-black rounded-3xl bg-gray-100"
              >
                <img src="/images/NewPollPic.png" alt="create a poll" className="w-full h-full object-cover rounded-3xl"/>       
              </button>

          </div>

        </div>
      </div>
    </div>
  );
}
