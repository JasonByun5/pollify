'use client';

import {useState, useRef, useEffect} from "react";
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useParams } from "next/navigation";

interface PollOption {
  id: string;
  poll_id: number;
  title: string;
  description: string;
  vote_count: number;
  image_url: string;
  created_at: string;
}

interface Poll {
  id: string;
  poll_id: number;
  author: string;
  title: string;
  description: string;
  type: string;
  poll_options: PollOption[];
  created_at: string;
}


// I need to send a poll Id from the dashboard to this link so that I can render it


function PollResult () {

    const params = useParams();
  const pollId = params.pollId as string;

  const [totalVotes, setTotalVote] = useState(0);
  const [deleted, setDeleted] = useState(false);

  console.log({pollId})
  //const [loading, setLoading] = useState(true);

  const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);



  useEffect(() => {
    setLoading(true);
    const fetchPoll = async () => {
      try {
        const res = await fetch(`/api/polls/${pollId}`);

        if (!res.ok) throw new Error("Failed to fetch poll");

        const data = await res.json();
        setPoll(data);
        
        // Calculate total votes
        if (data.poll_options) {
          const total = data.poll_options.reduce((sum, option) => sum + (option.vote_count || 0), 0);
          setTotalVote(total);
        }
        
        setLoading(false);

      } catch (err) {
        console.error('Error fetching poll:', err instanceof Error ? err.message : err);
        setLoading(false);
      }
    }

    fetchPoll();

  }, [pollId]);



//   const deletePoll = async (id) => {

//     try{
//       const res = await fetch(`/api/polls/deletePoll?pollId=${id}`, {
//           method: 'DELETE',
//       });

//       if(!res.ok) throw new Error('HTTP ${res.status}');

//       setPoll(null)
//     } 
//     catch(err){
//       console.error(err);
//       alert('Failed to delete poll.')
//     }

//   }


  if (loading) return <div>Loading...</div>;
  if (!poll) return <p>Poll not found.</p>;

  return(
    <div>
      {deleted && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center space-y-4">
              <h2 className="text-xl font-semibold text-red-300">Delete Poll?</h2>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setDeleted(false);
                    //navigate('/viewPolls')
                    //deletePoll(pollId)
                  }}
                  className="bg-red-200 hover:bg-red-300 text-white px-3 py-1 rounded"
                >
                  Delete!
                </button>

                <button
                  onClick={() => setDeleted(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
                >
                  Nope
                </button>
            </div> 
          </div>
        </div>
      )}
        

      <div className="flex justify-center p-10">
        <div className="w-3/5 bg-red-50 px-20 py-10 rounded-2xl flex flex-col shadow-md">
          <div className="w-full bg-white p-6 rounded-t-lg flex justify-evenly gap-1"> 
            <p className='text-[22px] font-bold'>{poll.title}</p>
            <p className='text-[18px] font-bold rounded px-2 py-1 w-24 bg-red-200 flex justify-center'>{poll.type}</p>
          </div>
          <div className="w-full bg-gray-200 py-9 px-6 rounded-b-lg mb-5 flex justify-evenly gap-1">
            <p> Poll ID: {poll.poll_id}</p>
            {poll.description && <p className='text-[15px] font-bold'>{poll.description}</p>}
            <p>Total Votes: {totalVotes}</p>
          </div>

          <div className="w-full bg-gray-100 p-3 rounded-lg mb-5 grid grid-cols-3 gap-1">
            <p>
              Option
            </p>
            <p>
              Votes
            </p>
            <p>
              Percentage
            </p>
          </div>
          { Array.isArray(poll.poll_options) && poll.poll_options.map((opt) => { 
            const percentage = totalVotes > 0 ? (opt.vote_count / totalVotes * 100).toFixed(1) : '0';
            return (
            <div key={opt.id} className="w-full bg-white p-3 rounded-lg mb-3 grid grid-cols-3 gap-4 items-center">
              <div className="flex flex-col items-center">
                {opt.image_url && (
                  <img 
                    src={opt.image_url} 
                    alt={opt.title} 
                    className="h-16 w-16 object-contain mb-2"/>
                )}
                <p className="font-semibold">{opt.title}</p>
                {opt.description && <p className="text-sm text-gray-600">{opt.description}</p>}
              </div>
              <p className="text-center text-lg">{opt.vote_count}</p>
              <p className="text-center text-lg font-bold">{percentage}%</p>
            </div>
            );
          })}

           <button
            onClick={() => setDeleted(true)}
          >
            Delete Poll
          </button>

        </div>
      </div>
    </div>
  )
  
}

export default PollResult;