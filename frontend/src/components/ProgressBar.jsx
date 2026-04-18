const ProgressBar = ({ current, target }) => {
  const percentage = Math.min((current / target) * 100, 100).toFixed(2);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-semibold">{current.toFixed(2)} km</span>
        <span className="text-gray-600">{target} km target</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right mt-2 text-sm font-medium text-blue-600">
        {percentage}%
      </div>
    </div>
  );
};

export default ProgressBar;
