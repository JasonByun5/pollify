function OptionCard({ option, onDelete }) {
  // Support both old (index) and new (id) structures
  const optionKey = option.id || option.index;
  const imageUrl = option.image_url || option.imageUrl;
  
  // Debug logging to see what data we're getting
  console.log('OptionCard option:', option);
  console.log('OptionCard imageUrl:', imageUrl);
  
  return (
    <div key={optionKey} className="min-w-[180px] min-h-[180px] border border-gray-100 rounded-xl bg-white shadow p-2 flex relative flex-col items-center justify-center group">
      {onDelete && (
        <button
          className="absolute top-1 right-1 text-red-400 text-sm"
          onClick={() => onDelete(optionKey)}
        >
          ✕
        </button>
      )}

      {imageUrl ? (
        <>
          <img src={imageUrl} alt="option" className="h-40 object-contain" />
          <span className="mt-1 text-sm bg-pink-200 px-1 rounded">{option.title}</span>
        </>
      ) : (
        <span className="mt-1 text-2xl bg-pink-200 px-1 rounded">{option.title}</span>
      )}

      

      {option.description && (
        <div className="mt-1 text-sm px-1 rounded">
          {option.description}
        </div>
      )}
    </div>
  );
}

export default OptionCard;