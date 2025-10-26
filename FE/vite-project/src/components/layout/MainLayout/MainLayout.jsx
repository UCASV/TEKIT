import { Outlet } from 'react-router-dom'
import Navbar from '../../common/Navbar/Navbar'
import Footer from '../../common/Footer/Footer'

function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout