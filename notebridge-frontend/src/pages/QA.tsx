import React, { useState } from 'react';
import {
  MessageCircle,
  Plus,
  ArrowUp,
  CheckCircle,
  X,
  Search,
  Send,
  GraduationCap,
} from 'lucide-react';
import { questions as initialQuestions } from '../data/mock';
import { CSE_BI_SEMESTER_COURSES } from '../data/curriculum';
import { Card, SectionTitle } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function QA() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState(initialQuestions);
  const [upvotedIndices, setUpvotedIndices] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CSE-2201');

  const handleUpvote = (idx: number) => {
    if (upvotedIndices.includes(idx)) {
      setUpvotedIndices(upvotedIndices.filter((i) => i !== idx));
      setQuestions((prev) =>
        prev.map((q, i) => (i === idx ? { ...q, upvotes: q.upvotes - 1 } : q))
      );
    } else {
      setUpvotedIndices([...upvotedIndices, idx]);
      setQuestions((prev) =>
        prev.map((q, i) => (i === idx ? { ...q, upvotes: q.upvotes + 1 } : q))
      );
    }
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const authorName = user?.full_name || (user?.email ? user.email.split('@')[0] : 'CSE Student');
    setQuestions([
      {
        title: newTitle.trim(),
        answers: 0,
        upvotes: 1,
        course: newCourse,
        author: authorName,
        time: 'Just now',
      },
      ...questions,
    ]);
    setUpvotedIndices((prev) => [...prev, 0]);
    setNewTitle('');
    setModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-7 max-w-5xl mx-auto space-y-6">
      <SectionTitle
        title="Community Q&A"
        sub="Connect with seniors and peers across the CSE Bi-Semester curriculum"
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Ask Question
          </button>
        }
      />

      <div className="space-y-3">
        {questions.map((q, idx) => {
          const isUpvoted = upvotedIndices.includes(idx);
          return (
            <Card key={idx} className="p-5 hover:border-blue-200 transition">
              <div className="flex gap-4 items-start">
                {/* Upvote Button */}
                <button
                  onClick={() => handleUpvote(idx)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition cursor-pointer min-w-[48px] ${
                    isUpvoted
                      ? 'bg-blue-50 text-blue-600 font-black'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold'
                  }`}
                >
                  <ArrowUp size={18} className={isUpvoted ? 'text-blue-600 stroke-[3]' : ''} />
                  <span className="text-xs mt-0.5">{q.upvotes}</span>
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-mono font-bold text-blue-700">
                      {q.course}
                    </span>
                    {q.answers > 4 && (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle size={12} /> Active Discussion
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-extrabold text-slate-900">{q.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Asked by <span className="font-semibold text-slate-700">{q.author}</span> · {q.time}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl">
                  <MessageCircle size={16} />
                  <span>{q.answers} answers</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Ask Question Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl relative border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-black text-slate-900">Ask a Question</h2>
            <p className="text-xs text-slate-500 mt-1">
              Ask seniors or coursemates about topics from the CSE curriculum.
            </p>

            <form onSubmit={handleCreateQuestion} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Course
                </label>
                <div className="relative">
                  <GraduationCap size={18} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer"
                  >
                    {CSE_BI_SEMESTER_COURSES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Question Description
                </label>
                <textarea
                  rows={4}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What specific topic, equation, or past question do you need help with?"
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
                >
                  <Send size={14} /> Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
