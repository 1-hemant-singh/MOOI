import React from 'react'
import { useNavigate } from 'react-router-dom'

function Logo({width = '100px'}) {
  const navigate = useNavigate();

const home =()=>{
  navigate("/")
}

  return (
    // <div>Logo</div>
   <button onClick={home}><img width={80} className='rounded-2xl' src="https://images.pexels.com/photos/1337380/pexels-photo-1337380.jpeg" alt="logo" />
 </button>
  )
}

export default Logo                               