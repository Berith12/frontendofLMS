import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/navrbar';

export default function AdminLayout({ children, active, logoutOnlyNav = false }) {
  const { user } = useAuth();
  if (!user || (user.role !== 'Admin' && user.role !== 'Librarian')) {
    return <div className="min-h-screen bg-teal-700 text-white p-6">Access denied</div>;
  }

  const linkCls = ({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded ${isActive ? 'bg-gray-800 text-white shadow-inner' : 'text-white/90 hover:bg-gray-800/60'}`;

  return (
    <div className="min-h-screen flex">
  <aside className="w-64 bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col p-4 border-r border-gray-800">
        <div className="px-2 mb-4">
          <a href="/home" className="block text-white font-semibold text-lg tracking-wide hover:text-blue-300 transition-colors">
            Library Management System
          </a>
        </div>
        <div className="text-xs uppercase opacity-70 px-2">Overview</div>
        <nav className="mt-2 mb-4 flex flex-col gap-1">
          <NavLink to="/admin" className={linkCls} end>Dashboard</NavLink>
        </nav>
        <div className="text-xs uppercase opacity-70 px-2">Management</div>
        <nav className="mt-2 mb-4 flex flex-col gap-1">
          <NavLink to="/manage-books" className={linkCls}>Books</NavLink>
          <NavLink to="/admin/borrowers" className={linkCls}>Borrowers</NavLink>
        </nav>
        <div className="text-xs uppercase opacity-70 px-2">Operations</div>
        <nav className="mt-2 mb-4 flex flex-col gap-1">
          <NavLink to="/admin/return" className={linkCls}>Return Book</NavLink>
        </nav>
        <div className="text-xs uppercase opacity-70 px-2 mt-auto">Settings</div>
        <nav className="mt-2 flex flex-col gap-1">
          <NavLink to="/admin/settings" className={linkCls}>Settings</NavLink>
        </nav>
        <div className="text-center text-xs opacity-70 mt-6">© 2025 LibraryMS</div>
      </aside>
      <main className="flex-1 bg-gradient-to-b from-black via-gray-900 to-black text-gray-100">
        <Navbar logoutOnly={logoutOnlyNav} />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
