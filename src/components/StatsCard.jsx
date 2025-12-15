import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const StatsCard = ({ title, value, icon, color, change }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
  };

  const bgColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  };

  const getChangeIcon = () => {
    if (!change) return null;
    if (change > 0) return <FaArrowUp className="ml-1" />;
    if (change < 0) return <FaArrowDown className="ml-1" />;
    return <FaMinus className="ml-1" />;
  };

  const getChangeColor = () => {
    if (!change) return 'text-gray-600';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">{value}</span>
              {change !== undefined && (
                <span className={`ml-2 text-sm font-medium ${getChangeColor()} flex items-center`}>
                  {Math.abs(change)}% {getChangeIcon()}
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-full ${bgColorClasses[color]}`}>
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${colorClasses[color]}`}
              style={{ width: `${Math.min(value * 10, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;