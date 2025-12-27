function OptionCard({ option, onDelete }) {
  return (
    <div key={option.index} className="min-w-45 border border-gray-100 rounded-xl bg-white shadow p-2 flex relative flex-col items-center group">
      {onDelete && (
        <button
          className="absolute top-1 right-1 text-red-400 text-sm"
          onClick={() => onDelete(option.index)}
        >
          ✕
        </button>
      )}

      <img src= {option.imageUrl} alt="option" className=" h-50 object-contain" />
      <span className="mt-1 text-xs bg-pink-200 px-1 rounded">{option.title}</span>

      {option.desc && (
        <div className="mt-1 text-xs px-1 rounded">
          {option.desc}
        </div>
      )}
    </div>
  );
}

export default OptionCard;