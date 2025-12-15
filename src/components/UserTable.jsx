import { FaEdit, FaTrash, FaEye, FaUser, FaBuilding, FaEnvelope, FaPhone } from 'react-icons/fa';

const UserTable = ({ users, onEdit, onDelete, onView }) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-50">
          <th className="py-4 px-6 text-left">
            <div className="flex items-center text-gray-700 font-semibold">
              <FaUser className="mr-2" /> User
            </div>
          </th>
          <th className="py-4 px-6 text-left">
            <div className="flex items-center text-gray-700 font-semibold">
              <FaEnvelope className="mr-2" /> Contact
            </div>
          </th>
          <th className="py-4 px-6 text-left">
            <div className="flex items-center text-gray-700 font-semibold">
              <FaBuilding className="mr-2" /> Company
            </div>
          </th>
          <th className="py-4 px-6 text-left">
            <div className="flex items-center text-gray-700 font-semibold">
              <FaPhone className="mr-2" /> Phone
            </div>
          </th>
          <th className="py-4 px-6 text-left text-gray-700 font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {users.map((user) => (
          <tr 
            key={user.id} 
            className="hover:bg-gray-50 transition-colors duration-150"
          >
            <td className="py-4 px-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">ID: {user.id}</div>
                </div>
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="text-gray-900">{user.email}</div>
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {user.website}
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="font-medium text-gray-900">{user.company?.name}</div>
              <div className="text-sm text-gray-500">{user.address?.city}</div>
            </td>
            <td className="py-4 px-6">
              <div className="text-gray-900">{user.phone}</div>
              <div className="text-sm text-gray-500">
                {user.address?.street}
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => onView(user)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="Edit User"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete User"
                >
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;