import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  Flame,
  Plus,
  Sparkles,
  Trophy,
  GraduationCap,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Card, SectionTitle } from '../components/UI';
import { resources } from '../data/mock';
import { CSE_BI_SEMESTER_COURSES, CSE_CURRICULUM_METADATA } from '../data/curriculum';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const studentName = user?.full_name || (user?.email ? `Student ${user.email.split('@')[0]}` : 'Antu');
  const userDept = user?.department || 'Computer Science & Engineering (CSE)';

  // Feature prominent courses from the curriculum
  const featuredCourses = CSE_BI_SEMESTER_COURSES.slice(10, 16);

  const stats = [
    { title: 'Resources saved', value: '24', icon: BookOpen },
    { title: 'Downloads', value: '186', icon: Download },
    { title: 'Contribution points', value: '420', icon: Trophy },
    { title: 'Curriculum Credits', value: '162.00', icon: GraduationCap },
  ];

  return (
    <div className="p-4 sm:p-7 max-w-7xl mx-auto space-y-7">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white overflow-hidden relative shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider mb-3">
            <GraduationCap size={14} /> {userDept}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back, {studentName} 👋
          </h1>
          <p className="mt-3 text-blue-100 max-w-xl text-sm sm:text-base leading-relaxed">
            Your university knowledge base is active. Explore the <b>CSE Bi-Semester Summary Syllabus</b>, download verified notes, or contribute past questions today.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/courses"
              className="rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-blue-700 hover:bg-blue-50 transition shadow-sm flex items-center gap-1.5"
            >
              <Layers size={16} /> View Bi-Semester Syllabus
            </Link>
            <Link
              to="/resources"
              className="rounded-xl bg-white/15 px-4 py-2.5 text-xs sm:text-sm font-bold text-white ring-1 ring-white/25 hover:bg-white/25 transition"
            >
              Explore Study Materials
            </Link>
          </div>
        </div>
        <div className="absolute -right-16 -bottom-20 h-72 w-72 rounded-full bg-white/10 pointer-events-none" />
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.title}</p>
                  <p className="mt-1 text-2xl font-black text-slate-800">{s.value}</p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Grid: Continue Learning & For You */}
      <div className="grid gap-7 xl:grid-cols-[1.5fr_1fr]">
        <section>
          <SectionTitle
            title="Bi-Semester Curriculum Courses"
            sub="Official B.Sc. in CSE courses & study files"
            action={
              <Link to="/courses" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                View All 77 Courses <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredCourses.map((c) => (
              <Card key={c.code} className="p-5 hover:-translate-y-0.5 transition duration-200">
                <div className="flex justify-between items-center">
                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-mono font-bold text-blue-700">
                    {c.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.type === 'Theory'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {c.type} · {c.credit.toFixed(2)} Cr
                  </span>
                </div>
                <h3 className="mt-4 font-bold text-slate-900 line-clamp-1">{c.name}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {c.termLabel} · {c.resourcesCount} resources
                </p>
                <div className="mt-5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-2/3 rounded-full bg-blue-600" />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>67% syllabus covered</span>
                  <Link to="/courses" className="text-blue-600 font-bold hover:underline">
                    Details →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <SectionTitle title="Community Highlights" sub="Most downloaded past papers & notes" />
            <Card className="divide-y divide-slate-100">
              {resources.slice(0, 4).map((r) => (
                <Link to="/resources" key={r.title} className="block p-4 hover:bg-slate-50 transition">
                  <div className="flex gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">{r.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {r.course} · ★ {r.rating} · {r.downloads} downloads
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </Card>
          </div>

          <Card className="p-5 bg-slate-900 text-white border-0 shadow-lg">
            <div className="flex gap-3">
              <Sparkles className="text-amber-400 shrink-0" size={24} />
              <div>
                <p className="font-bold text-sm">Study Smarter with AI</p>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Generate quizzes, extract key summaries, and analyze 8 semesters of CSE curriculum notes in seconds.
                </p>
                <Link
                  to="/ai"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300"
                >
                  Launch AI Study Assistant <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
