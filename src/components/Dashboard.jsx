import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsersAsync } from '../features/users/userSlice'
import UserTable from './UserTable'
import UserForm from './UserForm'
import './Dashboard.css'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { items, status, error, editingUser } = useSelector((state) => state.users)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsersAsync())
    }
  }, [status, dispatch])

  if (status === 'loading' && items.length === 0) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (status === 'failed' && items.length === 0) {
    return (
      <div className="error-container">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchUsersAsync())} className="btn-retry">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>User Management Dashboard</h1>
        <p>CRUD operations using Redux Toolkit with JSONPlaceholder API</p>
      </header>
      
      <div className="dashboard-content">
        <div className="dashboard-left">
          <UserForm editingUser={editingUser} />
        </div>
        <div className="dashboard-right">
          <UserTable />
        </div>
      </div>
      
      <footer className="dashboard-footer">
        <p>Note: JSONPlaceholder is a mock API. Changes are simulated locally in Redux store.</p>
      </footer>
    </div>
  )
}

export default Dashboard