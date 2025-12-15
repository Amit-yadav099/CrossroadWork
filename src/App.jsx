import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import StatsCard from './components/StatsCard';
import { 
  fetchUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  addUser,
  editUser,
  removeUser,
  setCurrentUser,
  clearCurrentUser,
  clearError,
  selectAllUsers,
  selectLoading,
  selectError,
  selectCurrentUser
} from './features/users/userSlice';
import { FaPlus, FaSync, FaUsers, FaEdit, FaTrash, FaChartBar } from 'react-icons/fa';

function App() {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const currentUser = useSelector(selectCurrentUser);
  
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter(user => user.status !== 'inactive').length,
    pending: users.filter(user => user.status === 'pending').length,
    companies: new Set(users.map(user => user.company?.name)).size
  };

  const filteredUsers = activeTab === 'all' 
    ? users 
    : users.filter(user => user.status === activeTab);

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  const handleAddUser = (userData) => {
    dispatch(createUser(userData))
      .unwrap()
      .then(() => {
        setShowForm(false);
      })
      .catch(() => {
        dispatch(addUser(userData));
        setShowForm(false);
      });
  };

  const handleEditUser = (userData) => {
    if (currentUser) {
      dispatch(updateUser({ id: currentUser.id, userData }))
        .unwrap()
        .then(() => {
          setShowForm(false);
          dispatch(clearCurrentUser());
        })
        .catch(() => {
          dispatch(editUser({ id: currentUser.id, ...userData }));
          setShowForm(false);
          dispatch(clearCurrentUser());
        });
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id))
        .unwrap()
        .catch(() => {
          dispatch(removeUser(id));
        });
    }
  };

  const handleEditClick = (user) => {
    dispatch(setCurrentUser(user));
    setShowForm(true);
  };

  const handleViewDetails = (user) => {
    setShowDetails(user);
  };

  const handleCloseModal = () => {
    setShowDetails(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FaChartBar className="text-2xl text-blue-600" />
              <span className="text-xl font-bold text-gray-800">UserDashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 flex items-center shadow-md"
              >
                <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
              <button
                onClick={() => {
                  dispatch(clearCurrentUser());
                  setShowForm(!showForm);
                }}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center shadow-md"
              >
                <FaPlus className="mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            User Management Dashboard
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your users with full CRUD operations. Add, edit, delete, and view user details seamlessly.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.total}
            icon={<FaUsers className="text-2xl" />}
            color="blue"
          />
          <StatsCard
            title="Active Users"
            value={stats.active}
            icon={<FaUsers className="text-2xl" />}
            color="green"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={<FaEdit className="text-2xl" />}
            color="yellow"
          />
          <StatsCard
            title="Companies"
            value={stats.companies}
            icon={<FaChartBar className="text-2xl" />}
            color="purple"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorMessage 
              message={error} 
              onRetry={() => {
                dispatch(clearError());
                dispatch(fetchUsers());
              }} 
            />
          </div>
        )}

        {/* User Form */}
        {showForm && (
          <div className="mb-8 animate-fade-in">
            <UserForm
              user={currentUser}
              onSubmit={currentUser ? handleEditUser : handleAddUser}
              onCancel={() => {
                setShowForm(false);
                dispatch(clearCurrentUser());
              }}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && !showForm && <LoadingSpinner />}

        {/* Main Content Area */}
        {!loading && users.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">User Directory</h2>
                  <p className="text-gray-600 text-sm">
                    Showing {filteredUsers.length} of {users.length} users
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'all' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'active' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Pending
                  </button>
                </div>
              </div>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
              <UserTable
                users={filteredUsers}
                onEdit={handleEditClick}
                onDelete={handleDeleteUser}
                onView={handleViewDetails}
              />
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Data fetched from JSONPlaceholder API</span>
                <span className="flex items-center">
                  <FaSync className="mr-2" />
                  Updated just now
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FaUsers className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No users found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by adding your first user to the dashboard.
            </p>
            <button
              onClick={() => {
                dispatch(clearCurrentUser());
                setShowForm(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 inline-flex items-center shadow-md"
            >
              <FaPlus className="mr-2" />
              Add Your First User
            </button>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full mx-auto shadow-2xl transform transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {showDetails.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{showDetails.name}</h3>
                    <p className="text-blue-600">{showDetails.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{showDetails.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a 
                      href={`https://${showDetails.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {showDetails.website}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">{showDetails.company?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{showDetails.address?.city}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Address</p>
                  <p className="text-gray-700">
                    {showDetails.address?.street}, {showDetails.address?.suite}<br />
                    {showDetails.address?.city}, {showDetails.address?.zipcode}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => handleEditClick(showDetails)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => {
                    handleDeleteUser(showDetails.id);
                    handleCloseModal();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <FaChartBar className="text-xl text-blue-600" />
                <span className="text-lg font-semibold text-gray-800">React Redux CRUD</span>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                A modern dashboard for user management
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600">
                Built with React, Redux Toolkit, and Tailwind CSS
              </p>
              <p className="text-gray-500 text-sm mt-1">
                API: JSONPlaceholder • UI: Tailwind CSS • State: Redux Toolkit
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;