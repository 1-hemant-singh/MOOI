import React from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: false //home can be reached by clicking on the logo
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "My Posts", //this was named all posts earlier 
      slug: "/all-posts",
      active: authStatus,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  ]


  return (
 <header className="fixed top-0 left-0 w-full bg-gray-800 shadow-lg z-50">
  <Container>
    <nav className="flex items-center justify-between h-16">
      <Link to="/" className="flex items-center">
        <Logo width="70px" />
      </Link>

      <ul className="flex items-center gap-4">
        {navItems.map(
          (item) =>
            item.active && (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className="px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 rounded-full transition"
                >
                  {item.name}
                </button>
              </li>
            )
        )}
        {authStatus && (
          <li>
            <LogoutBtn />
          </li>
        )}
      </ul>
    </nav>
  </Container>
</header>



  )
}

export default Header