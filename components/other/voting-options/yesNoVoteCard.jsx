
import { useState } from "react";

function YesNoVoteCard ({options, pollId, setVoted}) {

  const submitVote = async (optionId) => {
    try{
      const res = await fetch(`/api/polls/${pollId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      })

      if (!res.ok){
        throw new Error("failed to vote")
      }

      setVoted(true)

    } catch(err){
      console.error(err);
      alert('Error submitting vote');
    }
  }

return(
<div className="flex flex-col">
  {options.map((opt) => (
    <div className="flex flex-row mb-6" key={opt.id}>
      <div className="min-w-45 h-50 border border-gray-100 rounded-xl bg-white shadow p-2 flex relative flex-col items-center group">
        <img 
          src={opt.image_url} 
          alt={opt.title} 
          className="h-60 border object-contain" />
        <span className="mt-1 text-s px-2 font-bold bg-red-200 rounded"> {opt.title}</span>
        {(opt.description || opt.desc) && (
            <div className="mt-1 text-xs p-3 bg-gray-200 rounded">
              {opt.description || opt.desc}
            </div>
          )}
      </div>
      <div className="ml-5 flex flex-col justify-evenly">
        <button 
          className="bg-green-300 border-3 border-green-500 text-lg font-bold w-[150px] h-[75px] rounded-2xl"
          onClick={() => submitVote(opt.id)}
        >
          YES
        </button>
        <button 
          className="bg-red-300 border-3 border-red-500 text-lg font-bold w-[150px] h-[75px] rounded-2xl"
          onClick={() => submitVote(opt.id)}
        >
          NO
        </button>
        <button 
          className="bg-blue-300 border-3 border-blue-500 text-lg font-bold w-[150px] h-[75px] rounded-2xl"
          onClick={() => submitVote(opt.id)}
        >
          MAYBE
        </button>
      </div>
  </div>
  ))}
</div>
)

}

export default YesNoVoteCard;