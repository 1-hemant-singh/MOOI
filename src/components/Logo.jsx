import React from 'react'
import { useNavigate } from 'react-router-dom'

function Logo({width = '100px'}) {
  const navigate = useNavigate();

const home =()=>{
  navigate("/")
}

  return (
    // <div>Logo</div>
   <button onClick={home}><img width={width} className='rounded-2xl' src="/favicon.png" alt="MOOI logo" />
 </button>
  )
}

export default Logo                               