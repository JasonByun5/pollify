'use client';

import {useState, useRef, useEffect} from "react";
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import OptionCard from "../../../../components/other/optionCard";

/*
- need to confirm the way we are sending data is like mockPoll.json
- Also need to add the date the poll was created
*/


function NewPoll(){
  const [pollTitle, setPollTitle] = useState('');
  const [pollDesc, setPollDesc] = useState('');
  const [pollType, setPollType] = useState('');
  const [options, setOptions] = useState([]);
  const [currentOptionTitle, setCurrentOptionTitle] = useState('');
  const [currentOptionDesc, setCurrentOptionDesc] = useState('');
  const [currentOptionImage, setCurrentOptionImage] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  const [activeType, setActiveType] = useState(null);
  const buttons = ['multi', 'yes/no', 'rank'];

  //for the toast notif
  const [ alertMsg, setAlertMsg] = useState('');
  const[showAlert, setShowAlert] = useState(false);

  
  //for the popup
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [newPollId, setNewPollId] = useState(null);



  const ShowCustomAlert = (msg) => {
    setAlertMsg(msg);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }

  const fileInputRef = useRef(null);

  // Check Supabase authentication
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


  const handleRemoveOption = index => {
    setOptions(prev => prev.filter(opt => opt.index !== index));
  }

  const handleTrashOption = () =>{
    setCurrentOptionTitle('');
    setCurrentOptionDesc('');
    setCurrentOptionImage(null);
  } 



  const handleAddOption = (e) => {
    e.preventDefault();

    if (!currentOptionTitle.trim()) {
      ShowCustomAlert("Please enter a option title.");
      return;
    }

    let previewURL = null;
    if (currentOptionImage){
      previewURL = URL.createObjectURL(currentOptionImage);
    }

    const index = Date.now();

    setOptions(prev => [
      ...prev, 
      {
        index, 
        title: currentOptionTitle, 
        desc: currentOptionDesc, 
        imageUrl: previewURL, 
        file: currentOptionImage
      }
    ]);

    setCurrentOptionTitle('');
    setCurrentOptionDesc('');
    setCurrentOptionImage(null);
    fileInputRef.current.value = "";
  };

  const handleSubmitPoll = async () => {

    if (!pollTitle.trim()) {
      ShowCustomAlert("Please enter a poll title.");
      return;
    }
    if (!pollType) {
      ShowCustomAlert("Please select a poll type.");
      return;
    }
    if (options.length === 0) {
      ShowCustomAlert("Please add at least one option.");
      return;
    }

    console.log(user)

    const payload = {
      author: user.id,
      title: pollTitle,
      desc: pollDesc,
      type: pollType,
      options: options.map((o) => ({
        name: o.title, 
        desc: o.desc
      })),
    };

    const formData = new FormData();
    
    formData.append("payload", JSON.stringify(payload));
    
    // Append files in order to match options array
    options.forEach((o, index) => {
      if (o.file) {
        formData.append("files", o.file);
      } else {
        // Append empty file if no file to maintain index alignment
        formData.append("files", new File([], ""));
      }
    });
  
    try{
      const res = await fetch("/api/polls", {
        method:"POST",
        body: formData,
      });

      if(!res.ok){
        throw new Error("Failed to create poll");
      }

      const data = await res.json(); //confgire a response from the backend if we want

      setNewPollId(data.pollId);
      setShowSuccess(true);
      
      setPollTitle('');
      setPollDesc('');
      setPollType('');
      setActiveType(null);
      setOptions([]);

    } catch (err) {
      ShowCustomAlert("Error submitting poll.");
      console.error(err);
    }
  }

  //take out when deployed
  useEffect(() => {
    console.log("Options updated:", options);
  }, [options]);
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p>You need to login to create a new poll.</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-red-200 text-black rounded hover:bg-red-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  return(
    <div>
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center space-y-4">
            <h2 className="text-xl font-semibold text-red-300">Poll created!</h2>

            <p className="text-sm">
              <span className="font-medium">Poll&nbsp;ID:</span>
              <br />
              <span className="font-mono text-gray-700">{newPollId}</span>
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  router.push("/viewPolls");
                }}
                className="bg-red-200 hover:bg-red-300 text-white px-3 py-1 rounded"
              >
                View my polls
              </button>

              <button
                onClick={() => setShowSuccess(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
              >
                Make another
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center p-10">
        <div className="w-3/5 bg-red-50 px-20 py-10 rounded-2xl flex flex-col shadow-md">
          
          {/*Form Questions*/}
          <form className="w-full rounded-lg mb-5 flex flex-col  gap-1"> 
            <h1 className='text-[22px] font-bold'>Poll Title / Question</h1>
            <input 
              type="text"
              placeholder="Type your question here"
              value={pollTitle}
              onChange={(e) => setPollTitle(e.target.value)}
              className='w-full border border-gray-300 rounded px-3 py-1 text-sm mb-5'
            />
            <h1 className='text-[22px] font-bold' >Description (optional)</h1>
            <textarea 
              type="text"
              placeholder="Brief Description (E.g. Explain the options"
              value={pollDesc}
              onChange={(e) => setPollDesc(e.target.value)}
              className='w-full h-20 border border-gray-300 rounded px-3 py-1 text-sm'
            />
          </form>
          
          {/*Poll Type*/}
          <div className='flex justify-between mb-5'>
            <h1 className='text-[22px] font-bold'> Poll Type: </h1>

            {buttons.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setActiveType(type)
                  setPollType(type)
                }}
                className={`rounded px-3 py-1 w-24 ${
                  activeType === type ?  'bg-red-300' : 'bg-red-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>


          {/*Options*/}
          <div className='flex flex-row'>

            {/*Option form*/}
            <div className='w-2/5 h-100 border border-gray-300 rounded-xl mr-10 py-5'>
              <form className="w-full rounded-lg mb-5 flex flex-col items-center gap-1"  onSubmit={handleAddOption}>
                <h1 className='text-lg font-bold'>Option Name* </h1>
                <input 
                  type="text"
                  placeholder="Type your question here"
                  value={currentOptionTitle}
                  onChange={(e) => setCurrentOptionTitle(e.target.value)}
                  className='w-4/5 border border-gray-300 rounded px-3 py-1 text-sm mb-5'
                />
                <h1 className='text-lg font-bold' >Option Description</h1>
                <textarea 
                  type="text"
                  placeholder="Brief Description (E.g. Explain the options)"
                  value={currentOptionDesc}
                  onChange={(e) => setCurrentOptionDesc(e.target.value)}
                  className='w-4/5 h-20 border border-gray-300  rounded px-3 py-1 text-sm mb-3'
                />

                

                <div className="flex gap-4">
                  <label htmlFor="file-upload" className="bg-red-200 p-2 rounded-full text-xl">
                    📤
                  </label>
                  <input 
                    id ="file-upload"
                    type="file"  
                    ref={fileInputRef}
                    accept="image/*" 
                    onChange={(e) => setCurrentOptionImage(e.target.files[0])}
                    className='hidden'
                  />
                  <button 
                    className="bg-red-200 p-2 rounded-full text-xl"
                    type="button"
                    onClick={() => handleTrashOption()}
                  >🗑️</button>
                  <button 
                    type="submit" 
                    className="bg-red-200 p-2 rounded-full text-xl"
                  >➕</button>
                </div>

              </form>
            </div>

            {/*Options existing*/}
            <div className='w-3/5 h-full' >
              <div className="grid grid-cols-2 gap-y-4">
                {options.map(option => (
                  <OptionCard key={option.index} option={option} onDelete={() => handleRemoveOption(option.index)}/>
              ))}
              </div>
            </div>
          </div>
          
          <div className="w-full flex justify-between">
            <div>
              {showAlert && (
                <div className=" bg-red-500 mt-4 text-white px-6 py-2 rounded shadow-lg z-50 transition-all">
                  {alertMsg}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSubmitPoll}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
            Submit Poll</button>

          </div>
          

        </div>
      </div>
    </div>
  )
}


export default NewPoll;