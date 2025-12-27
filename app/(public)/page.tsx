

export default function Home() {
  return (
    <div className="flex justify-center p-10">
      <div className="w-1/2 bg-red-50 px-20 rounded-2xl flex flex-col shadow-md">
        <div className="flex flex-col justify-evenly min-h-150">
          <h1 className="flex justify-center text-2xl">
            Welcome! You have been invited to participate in a poll!
          </h1>

          <form
            className="flex flex-col justify-center gap-4 items-center"
            //onSubmit={() => navigate(`/poll/${formCode}`)}
          >
            <h1>Put in the form code</h1>
            <div>
              <input
                type="text"
                placeholder="ex: 1234"
                //value={formCode}
                //onChange={(e) => setFormCode(e.target.value)}
                className="border border-black rounded px-3 text-m "
              />
              <button
                type="submit"
                className="cursor-pointer border rounded px-3 bg-black text-red-50"
              >
                Take me there!
              </button>
            </div>
          </form>
          <form
            className="flex flex-col justify-center gap-4 items-center "
            //onSubmit={() => navigate(`/poll/${formCode}`)}
          >
            <h1>Put in admin code</h1>
            <div>
              <input
                type="text"
                placeholder="ex: 1234"
                //value={adminCode}
                //onChange={(e) => setAdminCode(e.target.value)}
                className="border border-black rounded px-3 text-m "
              />
              <button
                type="submit"
                className="cursor-pointer border rounded px-3 bg-black text-red-50"
              >
                Take me there!
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
