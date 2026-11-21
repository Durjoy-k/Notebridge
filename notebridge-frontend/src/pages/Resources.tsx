import React, { useState, useMemo } from 'react';
import {
  Download,
  FileText,
  Filter,
  Search,
  Star,
  Bookmark,
  Check,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { resources as initialResources } from '../data/mock';
import { CSE_BI_SEMESTER_COURSES, DEPARTMENTS } from '../data/curriculum';
import { Card, SectionTitle } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function Resources() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [bookmarkedTitles, setBookmarkedTitles] = useState<string[]>([]);
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({});

  const types = ['All', 'Previous Question', 'Lecture Notes', 'Lab Material', 'Lecture Slides'];

  const toggleBookmark = (title: string) => {
    setBookmarkedTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleDownload = (title: string, currentDownloads: number) => {
    setDownloadCounts((prev) => ({
      ...prev,
      [title]: (prev[title] || currentDownloads) + 1,
    }));
  };

  const filtered = useMemo(() => {
    return initialResources.filter((r) => {
      if (selectedType !== 'All' && r.type !== selectedType) return false;
      if (selectedCourse !== 'All' && r.course !== selectedCourse) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchCourse = r.course.toLowerCase().includes(q);
        const matchAuthor = r.author.toLowerCase().includes(q);
        if (!matchTitle && !matchCourse && !matchAuthor) return false;
      }
      return true;
    });
  }, [search, selectedType, selectedCourse]);

  return (
    <div className="p-4 sm:p-7 max-w-7xl mx-auto space-y-6">
      <SectionTitle
        title="Academic Resources & Past Papers"
        sub="Verified lecture notes, laboratory solutions, and previous exam question papers"
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm"
            placeholder="Search by note title, course code (e.g. CSE-2101), or topic..."
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter by Syllabus Course */}
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 px-3 py-2 shadow-sm">
          <GraduationCap size={16} className="text-slate-400" />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer max-w-[200px] truncate"
          >
            <option value="All">All Curriculum Courses</option>
            {CSE_BI_SEMESTER_COURSES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resource Type Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedType === t
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Resource Cards */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-base font-bold text-slate-700">No resources found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          filtered.map((r) => {
            const isBookmarked = bookmarkedTitles.includes(r.title);
            const downloads = downloadCounts[r.title] || r.downloads;

            return (
              <Card key={r.title} className="p-5 hover:border-blue-200 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                      <FileText size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-mono font-bold text-blue-700">
                          {r.course}
                        </span>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          {r.type}
                        </span>
                        {r.tag && (
                          <span className="rounded-lg bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-bold">
                            {r.tag}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2.5 text-base font-extrabold text-slate-900">{r.title}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Uploaded by <span className="font-semibold text-slate-700">{r.author}</span> · {r.updated}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 shrink-0">
                    <span className="flex items-center gap-1">
                      <Star size={15} className="fill-amber-400 text-amber-400" />
                      {r.rating}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Download size={15} />
                      {downloads}
                    </span>
                    <button
                      onClick={() => toggleBookmark(r.title)}
                      className={`rounded-xl p-2.5 border transition ${
                        isBookmarked
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                      title={isBookmarked ? 'Saved in library' : 'Bookmark resource'}
                    >
                      <Bookmark size={16} className={isBookmarked ? 'fill-blue-600' : ''} />
                    </button>
                    <button
                      onClick={() => handleDownload(r.title, r.downloads)}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition shadow-sm cursor-pointer"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
