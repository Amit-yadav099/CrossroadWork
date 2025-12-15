import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-6 shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaExclamationTriangle className="text-2xl text-red-500" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center shadow-md"
            >
              <FaRedo className="mr-2" /> Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;