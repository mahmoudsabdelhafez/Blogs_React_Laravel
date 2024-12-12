
import { Route, Routes, useLocation , Navigate } from 'react-router-dom';
import Login from './auth_components/login';
import Signup from './auth_components/signup';
import Header from './components/Header';
import FavoritePage from './components/FavoritePage'; 
import BlogDetails from './components/BlogDetails'
import Landing from './components/landing/Landing';
import Contact from './components/Contact';
import Blogs from './components/Blogs'
import ProfileIndex from './components/Profile/ProfileIndex'
import AboutUs from './components/AboutUs'
import GuestLayout from './auth_components/guestlayout';
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute';



function App() {

  const location = useLocation();

  const hideHeaderFooter = ["/login", "/signup"].some((path) => location.pathname.startsWith(path));


  return (
    <div>
      {/* Conditionally render Header */}
      {!hideHeaderFooter && <Header />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing/>} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path='/favorite' element={<FavoritePage />} />
        <Route path='contact' element={<Contact />} />
        <Route path='/articles' element={<Blogs /> }/>

         <Route
        path="/user"
        element={
          <PrivateRoute>
            <ProfileIndex />
          </PrivateRoute>
        }
      />
        <Route path='/about' element={<AboutUs/>}/>


       {/* Authentication routes inside GuestLayout */}
       <Route path="/" element={<GuestLayout/>}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      {/* Conditionally render Footer */}
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;