import { Outlet } from 'react-router-dom'
import Navbar from '../../common/Navbar/Navbar'
import Footer from '../../common/Footer/Footer'

function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ overflow: 'hidden' }}>
      <Navbar />
      <main className="flex-grow-1" style={{ width: '100%', overflow: 'hidden' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout