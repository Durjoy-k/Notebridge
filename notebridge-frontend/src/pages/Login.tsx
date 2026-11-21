import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NWU_EMAIL_REGEX, NWU_ERROR_MESSAGE } from '../services/api';
import { DEPARTMENTS } from '../data/curriculum';
import {
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [deptError, setDeptError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (val: string): boolean => {
    const trimmed = val.trim();
    if (!trimmed || !NWU_EMAIL_REGEX.test(trimmed)) {
      setEmailError(NWU_ERROR_MESSAGE);
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) {
      if (NWU_EMAIL_REGEX.test(val.trim())) {
        setEmailError('');
      }
    }
  };

  const selectedDeptObj = DEPARTMENTS.find((d) => d.code === department);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setDeptError('');

    if (!department) {
      setDeptError('Please select your academic department to proceed.');
      return;
    }

    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      return;
    }

    if (!password || password.length < 6) {
      setApiError('Password must be at least 6 characters long.');
      return;
    }

    const deptFullName = selectedDeptObj
      ? `${selectedDeptObj.name} (${selectedDeptObj.code})`
      : department;

    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, fullName, deptFullName);
      } else {
        await login(email, password, deptFullName);
      }
      navigate('/courses');
    } catch (err: any) {
      setApiError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTab = (registerMode: boolean) => {
    setIsRegister(registerMode);
    setEmailError('');
    setDeptError('');
    setApiError('');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left Branding Side */}
      <div className="hidden lg:flex bg-slate-950 text-white p-14 flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3 font-extrabold text-2xl tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <BookOpen size={20} />
          </span>
          <span>
            Note<span className="text-blue-500">Bridge</span>
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={14} /> Verified NWU Academic Portal
          </div>
          <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight">
            Knowledge shouldn't disappear when a semester ends.
          </h1>
          <p className="mt-5 text-slate-400 text-base leading-relaxed">
            North Western University's unified academic repository. Access complete
            Bi-Semester curriculum syllabi, previous questions, verified lecture notes, and lab manuals.
          </p>

          {/* Curriculum Highlight Box */}
          <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              <Sparkles size={14} /> Official Bi-Semester Syllabus Integrated
            </div>
            <p className="text-sm font-semibold text-white">
              Dept. of Computer Science & Engineering (CSE)
            </p>
            <p className="text-xs text-slate-400 mt-1">
              8 Full Semesters · 162.00 Total Credits · 77 Theory & Laboratory Courses
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-6">
          <span>North Western University · Khulna, Bangladesh</span>
          <span>CSE Bi-Semester Curriculum</span>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 font-extrabold text-xl mb-8">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
              <BookOpen size={18} />
            </span>
            <span>
              Note<span className="text-blue-600">Bridge</span>
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-200/80 p-1 mb-6">
            <button
              type="button"
              onClick={() => toggleTab(false)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                !isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => toggleTab(true)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register Account
            </button>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isRegister ? 'Create Student Account' : 'Welcome to NoteBridge'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              {isRegister
                ? 'Select your department and register with your NWU student email.'
                : 'Select your department and enter your student credentials.'}
            </p>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>{apiError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Department Selection (MANDATORY FOR BOTH LOGIN & REGISTER) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Select Academic Department <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-blue-600 font-semibold lowercase">Required</span>
              </label>
              <div className="relative">
                <GraduationCap size={18} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setDeptError('');
                  }}
                  className={`w-full rounded-xl border pl-10 pr-10 py-3 text-sm font-medium outline-none transition-all appearance-none bg-white cursor-pointer ${
                    deptError
                      ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  }`}
                  required
                >
                  <option value="" disabled>-- Select Your Department --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.code} value={dept.code}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>

              {deptError ? (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle size={13} /> {deptError}
                </p>
              ) : selectedDeptObj ? (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{selectedDeptObj.faculty}</span>
                  {department === 'CSE' && (
                    <span className="ml-auto font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Bi-Semester Syllabus
                    </span>
                  )}
                </div>
              ) : null}
            </div>

            {/* Full Name field (Register only) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  />
                </div>
              </div>
            )}

            {/* NWU Student Email field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                NWU Student Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  placeholder="20242087010@nwu.ac.bd"
                  className={`w-full rounded-xl border pl-10 pr-4 py-3 text-sm outline-none transition-all bg-white ${
                    emailError
                      ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  }`}
                  required
                />
              </div>

              {emailError ? (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle size={13} /> {emailError}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">
                  Format: 11-digit Student ID followed by @nwu.ac.bd
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>
                    {isRegister ? 'Register & Access Syllabus' : `Sign In to ${department || 'Portal'}`}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Notice */}
          <div className="mt-6 text-center border-t border-slate-200/60 pt-5">
            <p className="text-xs text-slate-400">
              Only verified North Western University student email addresses (
              <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">@nwu.ac.bd</code>
              ) are authorized to log in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
