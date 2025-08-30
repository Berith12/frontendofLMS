import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home';
import LandingGate from './pages/LandingGate';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Books from './pages/books';
import Featured from "./pages/featured";
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import BookDetails from './pages/BookDetails';
import ManageBooks from './pages/ManageBooks';
import AdminDashboard from './pages/AdminDashboard';
import AdminBorrowers from './pages/AdminBorrowers';
import AdminReturn from './pages/AdminReturn';
import AdminSettings from './pages/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
  <ToastContainer position="top-center" autoClose={2500} newestOnTop closeOnClick pauseOnHover theme="dark" />
        <Routes>
          <Route path="/" element={<LandingGate />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/featured" element={<Featured />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/manage-books" element={<ManageBooks />} />
          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/borrowers" element={<AdminBorrowers />} />
          <Route path="/admin/return" element={<AdminReturn />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;