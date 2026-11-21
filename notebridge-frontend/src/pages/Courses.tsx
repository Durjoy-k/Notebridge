import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  Layers,
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  MessageSquare,
  X,
  ExternalLink,
  Table as TableIcon,
  LayoutGrid,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  CSE_BI_SEMESTER_COURSES,
  CSE_SEMESTER_SUMMARIES,
  CSE_CURRICULUM_METADATA,
  DEPARTMENTS,
  CourseItem,
  SemesterSummary,
} from '../data/curriculum';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Courses() {
  const { user } = useAuth();

  // Department state - default to CSE or user department if it matches
  const [selectedDept, setSelectedDept] = useState<string>('CSE');
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [activeCourse, setActiveCourse] = useState<CourseItem | null>(null);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return CSE_BI_SEMESTER_COURSES.filter((course) => {
      // Term filter
      if (selectedTerm !== 'all' && course.termId !== selectedTerm) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all') {
        if (selectedType === 'Theory' && course.type !== 'Theory') return false;
        if (selectedType === 'Laboratory' && course.type !== 'Laboratory') return false;
        if (selectedType === 'Thesis/Project' && course.type !== 'Thesis/Project') return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const codeMatch = course.code.toLowerCase().includes(query);
        const nameMatch = course.name.toLowerCase().includes(query);
        const termMatch = course.termLabel.toLowerCase().includes(query);
        if (!codeMatch && !nameMatch && !termMatch) return false;
      }
      return true;
    });
  }, [selectedTerm, selectedType, searchQuery]);

  // Group filtered courses by semester summary
  const groupedBySemester = useMemo(() => {
    const map = new Map<string, { summary: SemesterSummary; courses: CourseItem[] }>();

    CSE_SEMESTER_SUMMARIES.forEach((summary) => {
      if (selectedTerm === 'all' || selectedTerm === summary.termId) {
        map.set(summary.termId, { summary, courses: [] });
      }
    });

    filteredCourses.forEach((c) => {
      if (map.has(c.termId)) {
        map.get(c.termId)!.courses.push(c);
      }
    });

    return Array.from(map.values()).filter((group) => group.courses.length > 0);
  }, [filteredCourses, selectedTerm]);

  const totalCreditsFiltered = useMemo(() => {
    return filteredCourses.reduce((sum, c) => sum + c.credit, 0).toFixed(2);
  }, [filteredCourses]);

  return (
    <div className="p-4 sm:p-7 max-w-7xl mx-auto space-y-7">
      {/* Official Syllabus Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <GraduationCap size={14} /> {CSE_CURRICULUM_METADATA.faculty}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wider">
              <CheckCircle2 size={13} /> {CSE_CURRICULUM_METADATA.system}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {CSE_CURRICULUM_METADATA.department}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-300 font-medium">
            Program: {CSE_CURRICULUM_METADATA.program}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-slate-400 font-medium">Total Curriculum Credits</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">
                {CSE_CURRICULUM_METADATA.totalCredits.toFixed(2)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-slate-400 font-medium">Total Courses</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">
                {CSE_CURRICULUM_METADATA.totalCourses} Courses
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-slate-400 font-medium">Academic Duration</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">
                4 Years · 8 Semesters
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-slate-400 font-medium">Your Active Dept</p>
              <p className="text-xl sm:text-2xl font-black text-blue-400 mt-1 truncate">
                {user?.department ? user.department.split('(')[1]?.replace(')', '') || 'CSE' : 'CSE'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Department Selection & View Toggle */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm"
            placeholder="Search by course code (e.g. CSE-2201, Math-1131) or title..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters & View Switches */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Selector */}
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 px-3 py-1.5 shadow-sm">
            <GraduationCap size={16} className="text-slate-500" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 px-3 py-1.5 shadow-sm">
            <Filter size={15} className="text-slate-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="Theory">Theory Only</option>
              <option value="Laboratory">Laboratory Only</option>
              <option value="Thesis/Project">Project / Thesis</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon size={15} />
              <span>Syllabus Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid size={15} />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Semester Filter Tabs */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedTerm('all')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedTerm === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All 8 Semesters ({CSE_BI_SEMESTER_COURSES.length})
          </button>
          {CSE_SEMESTER_SUMMARIES.map((term) => (
            <button
              key={term.termId}
              onClick={() => setSelectedTerm(term.termId)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedTerm === term.termId
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{term.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedTerm === term.termId
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {term.coursesCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary Info */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>
          Showing <span className="text-slate-900 font-bold">{filteredCourses.length}</span> courses
          {selectedTerm !== 'all' && (
            <span> in <span className="text-blue-600 font-bold">{CSE_SEMESTER_SUMMARIES.find(t => t.termId === selectedTerm)?.title}</span></span>
          )}
        </span>
        <span className="font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
          Filtered Credits: {totalCreditsFiltered} hrs
        </span>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        /* OFFICIAL SYLLABUS TABLE VIEW */
        <div className="space-y-8">
          {groupedBySemester.map(({ summary, courses }) => (
            <div
              key={summary.termId}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
            >
              {/* Semester Header */}
              <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white font-black text-xs">
                    {summary.termId}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Year : {summary.year} &nbsp;&nbsp; Semester : {summary.semester}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Faculty of Science and Technology · B.Sc. in CSE
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg">
                    Theory: {summary.theoryCredits} Cr
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg">
                    Sessional: {summary.sessionalCredits} Cr
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-lg">
                    Semester Total: {summary.totalCredits.toFixed(2)} Cr
                  </span>
                </div>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/60 text-[11px] font-black uppercase tracking-wider text-slate-600">
                      <th className="py-3 px-4 w-12 text-center">SN</th>
                      <th className="py-3 px-4 w-36">Course Code</th>
                      <th className="py-3 px-6">Course Title</th>
                      <th className="py-3 px-4 w-28 text-center">Credit</th>
                      <th className="py-3 px-4 w-36 text-center">Type</th>
                      <th className="py-3 px-4 w-32 text-center">Pre-Requisite</th>
                      <th className="py-3 px-4 w-28 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {courses.map((course) => (
                      <tr
                        key={course.code}
                        onClick={() => setActiveCourse(course)}
                        className="hover:bg-blue-50/50 transition cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-xs">
                          {course.sn}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block font-mono font-bold text-blue-700 bg-blue-50/80 group-hover:bg-blue-100 px-2 py-0.5 rounded text-xs transition">
                            {course.code}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 font-bold text-slate-800">
                          {course.name}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                          {course.credit.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              course.type === 'Theory'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                : course.type === 'Thesis/Project'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            }`}
                          >
                            {course.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs text-slate-400">
                          {course.preRequisite || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCourse(course);
                            }}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 group-hover:underline"
                          >
                            Details <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Semester Summary Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-4">
                  <span>Theory : <b>{summary.theoryCredits}</b></span>
                  <span>•</span>
                  <span>Sessional : <b>{summary.sessionalCredits}</b></span>
                  <span>•</span>
                  <span>Thesis/Project : <b>{summary.thesisCredits}</b></span>
                </div>
                <div className="font-bold text-slate-900">
                  Total Semester Credits : <span className="font-mono text-blue-700">{summary.totalCredits.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* INTERACTIVE CARDS GRID VIEW */
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.code}
              onClick={() => setActiveCourse(course)}
              className="rounded-3xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {course.code}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      course.type === 'Theory'
                        ? 'bg-amber-50 text-amber-700'
                        : course.type === 'Thesis/Project'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {course.type}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                  {course.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {course.termLabel} · Credit: <span className="font-bold font-mono text-slate-700">{course.credit.toFixed(2)}</span>
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <FileText size={15} className="text-slate-400" />
                  {course.resourcesCount} resources
                </span>
                <button
                  type="button"
                  className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  Explore <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Detail Modal Drawer */}
      {activeCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveCourse(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl relative border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveCourse(null)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                {activeCourse.code}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activeCourse.type === 'Theory'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    : activeCourse.type === 'Thesis/Project'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                }`}
              >
                {activeCourse.type}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Credit: <b>{activeCourse.credit.toFixed(2)}</b>
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mt-2">
              {activeCourse.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {CSE_CURRICULUM_METADATA.faculty} · {CSE_CURRICULUM_METADATA.department}
            </p>

            {/* Course Meta Info */}
            <div className="mt-5 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Academic Term</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{activeCourse.termLabel}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Pre-Requisite</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{activeCourse.preRequisite || 'None'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Course Category</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{activeCourse.type} Course</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Shared Materials</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{activeCourse.resourcesCount} Files Available</p>
              </div>
            </div>

            {/* Study Resources Preview */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Available Resources & Activities
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 flex items-center justify-between transition">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{activeCourse.code} Lecture Notes & Slides</p>
                      <p className="text-[11px] text-slate-400">Semester exam prep and lecture materials</p>
                    </div>
                  </div>
                  <Link
                    to="/resources"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 flex items-center justify-between transition">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{activeCourse.code} Previous Years Questions</p>
                      <p className="text-[11px] text-slate-400">Midterm and Final semester question bank</p>
                    </div>
                  </div>
                  <Link
                    to="/resources"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/resources"
                className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-center text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition"
              >
                Browse All Materials
              </Link>
              <Link
                to="/qa"
                className="rounded-xl border border-slate-200 hover:bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition"
              >
                <MessageSquare size={15} />
                Ask Question
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
