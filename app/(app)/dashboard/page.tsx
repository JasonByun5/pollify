'use client';

import {useState, useRef, useEffect} from "react";
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function ViewPoll () {

    const [user, setUser] = useState(null);
  const [polls, setPolls] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //checks for user auth
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getClaims();
      const user = data?.claims;
      
      if (user) {
        setUser({
          id: user.sub,
          email: user.email
        });
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  useEffect(() => {

    console.log(user)
    
    if (!user) return;

    const fetchUserPolls = async () => {

        //`http://localhost:5000/api/polls/by-user?userId=${user._id}`
        try{
        const res = await fetch(`/api/polls/by-author/${user.id}`, {
            method:"GET",
        });

        if(!res.ok){
            throw new Error("Failed to create poll");
        }
          
        const data = await res.json();
        console.log("User's polls:", data);
        setPolls(data);

      } catch (err) {
        console.error(err.message);
      }
      
    };

    fetchUserPolls();

  }, [user]);


  
  if (!user) {
    return(
      <div>
        not logged in!
      </div>
    )
  }

  return(
    
    <div>
      <div className="flex justify-center p-10 text-lg">
        <div className="w-3/5 bg-red-50 px-20 py-10 rounded-2xl flex flex-col shadow-md">
          <p className="mb-3 font-bold underline">Previous Polls:</p>
          { Array.isArray(polls) &&
            polls.map((poll) => (
            <div className="w-full bg-gray-100 p-3 rounded-lg mb-5 grid grid-cols-4 gap-1">
              <p>{poll.title}</p>
              <p> {poll.type} </p>
              <p> {new Date(poll.created_at).toLocaleDateString()}</p>
               <button 
                  type="submit" 
                  className="bg-red-200 rounded-full text-xl"
                  //onClick={() => navigate(`/result/${poll.pollId}`)}
                >📊</button>
            </div>
          ))}
        </div>
      </div>
    </div>

  )

}
export default ViewPoll;