import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    let isMounted = true

    authService.getCurrentUser()
    .then((userData) => {
      if (!isMounted) return
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .catch(() => {
      if (!isMounted) return
      dispatch(logout())
    })
    .finally(() => setLoading(false))
    
    return () => {
      isMounted = false
    }
  }, [dispatch])
  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gradient-to-br from-indigo-ink-950 via-dark-amethyst-950 to-royal-violet-900 text-lavender-purple-50'>
      <div className='w-full block'>
        <Header />
        <main className="pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-indigo-ink-950 text-lavender-purple-50">
      <div>Loading...</div>
    </div>
  )
}

export default App
