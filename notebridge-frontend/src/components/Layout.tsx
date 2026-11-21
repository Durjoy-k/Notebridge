import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Search, Bookmark, MessageCircle, Upload, Bell, Settings, ShieldCheck, LogOut, Sparkles, Menu, X, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const nav = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/courses', 'Courses', BookOpen],
  ['/resources', 'Resources', Search],
  ['/bookmarks', 'My Library', Bookmark],
  ['/qa', 'Community Q&A', MessageCircle],
] as const;

export default function Layout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'NW';
  };

  const studentId = user?.email ? user.email.split('@')[0] : 'Guest';

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-white border-r border-slate-200 p-5 transition-transform flex flex-col justify-between ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div>
          {/* Logo & Close button */}
          <div className="flex items-center justify-between mb-9">
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
                <BookOpen size={19} />
              </span>
              <span className="font-extrabold text-xl tracking-tight">
                Note<span className="text-blue-600">Bridge</span>
              </span>
            </button>
            <button className="lg:hidden" onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">Workspace</p>
          <nav className="space-y-1">
            {nav.map(([to, label, Icon]) => (
              <NavLink
                onClick={() => setOpen(false)}
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <p className="px-3 mt-7 mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">Tools</p>
          <nav className="space-y-1">
            <NavLink
              to="/upload"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Upload size={18} />
              Upload Resource
            </NavLink>
            <NavLink
              to="/ai"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Sparkles size={18} />
              AI Study Tools
            </NavLink>
          </nav>
        </div>

        {/* User Card & Logout in Sidebar */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-blue-400">
              <span className="flex items-center gap-1.5"><ShieldCheck size={15} /> NWU Student</span>
              <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                {user?.department?.includes('(') ? user.department.split('(')[1].replace(')', '') : 'CSE'}
              </span>
            </div>
            <p className="mt-1.5 text-sm font-bold truncate">{user?.full_name || 'Student Account'}</p>
            <p className="text-xs text-slate-400 font-mono truncate">{user?.email || '20242087010@nwu.ac.bd'}</p>
            <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300 font-medium truncate">
              {user?.department || 'Computer Science & Engineering (CSE)'}
            </div>
          </div>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
            >
              <LogOut size={15} />
              Log Out
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-all cursor-pointer"
            >
              <UserIcon size={15} />
              Sign In / Register
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-7">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu />
            </button>

            <div className="hidden sm:flex items-center gap-3 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">North Western University</span>
              <span>•</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg text-xs">
                {user?.department || 'Dept. of CSE'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 transition-all">
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                  <div className="flex flex-col text-right hidden sm:block">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {user?.full_name || `ID: ${studentId}`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {user?.email}
                    </span>
                  </div>
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-sm font-extrabold text-white shadow-sm">
                    {getInitials(user?.full_name, user?.email)}
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="rounded-xl p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
