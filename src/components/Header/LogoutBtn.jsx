import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'
import { Navigate } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'


function LogoutBtn() {
  // const navigate = useNavigate();
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
            // navigate("/");
        })
    }
  return (
    <button
    className="px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 rounded-full transition"
    //also when u log out , posts are still visible
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn