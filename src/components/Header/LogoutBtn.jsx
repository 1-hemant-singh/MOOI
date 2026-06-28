import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'


function LogoutBtn() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const logoutHandler = async () => {
        try {
            await authService.logout()
        } finally {
            dispatch(logout())
            navigate("/login", { replace: true });
        }
    }
  return (
    <button
    className="px-4 py-2 text-sm font-medium text-lavender-purple-100 hover:bg-mauve-magic-700 hover:text-white rounded-full transition"
    //also when u log out , posts are still visible
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn
