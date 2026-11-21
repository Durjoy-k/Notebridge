import { CSE_BI_SEMESTER_COURSES, CourseItem } from './curriculum';

export interface LegacyCourse {
  code: string;
  name: string;
  dept: string;
  semester: string;
  resources: number;
  color: string;
  credit?: number;
  type?: string;
  year?: string;
  termId?: string;
}

const colorMap = ['blue', 'indigo', 'violet', 'emerald', 'amber', 'rose', 'cyan'];

export const courses: LegacyCourse[] = CSE_BI_SEMESTER_COURSES.map((c, i) => ({
  code: c.code,
  name: c.name,
  dept: c.department,
  semester: `${c.year} Year, ${c.semester} Sem`,
  resources: c.resourcesCount,
  color: colorMap[i % colorMap.length],
  credit: c.credit,
  type: c.type,
  year: c.year,
  termId: c.termId,
}));

export const resources = [
  {
    title: 'CSE-2103: Data Structures — Comprehensive Final Review & Trees/Graphs Guide',
    type: 'Previous Question',
    course: 'CSE-2103',
    courseName: 'Data Structures',
    author: 'Rafi Ahmed (20221087012)',
    rating: 4.9,
    downloads: 234,
    updated: '2 days ago',
    tag: 'Exam Prep',
  },
  {
    title: 'CSE-2201: Database Systems — Relational Algebra & SQL Normalization',
    type: 'Lecture Notes',
    course: 'CSE-2201',
    courseName: 'Database Systems',
    author: 'Nusrat Jahan (20222087005)',
    rating: 4.8,
    downloads: 186,
    updated: '4 days ago',
    tag: 'Notes',
  },
  {
    title: 'CSE-2101: Object Oriented Programming — Java OOP Final Lab Solutions',
    type: 'Lab Material',
    course: 'CSE-2101',
    courseName: 'Object Oriented Programming',
    author: 'Tanvir Hasan (20221087033)',
    rating: 4.7,
    downloads: 142,
    updated: '1 week ago',
    tag: 'Lab',
  },
  {
    title: 'CSE-3201: System Programming & OS — Process Scheduling & Synchronization Slides',
    type: 'Lecture Slides',
    course: 'CSE-3201',
    courseName: 'System Programming and Operating System',
    author: 'Sadia Islam (20211087019)',
    rating: 4.6,
    downloads: 98,
    updated: '1 week ago',
    tag: 'Slides',
  },
  {
    title: 'CSE-3101: Microprocessors 8086 Instruction Set & Assembly Lab Manual',
    type: 'Lab Material',
    course: 'CSE-3101',
    courseName: 'Microprocessors and Microcontrollers',
    author: 'Arman Hossain (20212087021)',
    rating: 4.9,
    downloads: 167,
    updated: '3 days ago',
    tag: 'Lab',
  },
  {
    title: 'CSE-4119: Machine Learning — Supervised Learning Algorithms Formula Sheet',
    type: 'Lecture Notes',
    course: 'CSE-4119',
    courseName: 'Machine Learning',
    author: 'Farhana Yeasmin (20201087002)',
    rating: 4.9,
    downloads: 310,
    updated: 'Yesterday',
    tag: 'Exam Prep',
  },
];

export const questions = [
  {
    title: 'How do I distinguish Dijkstra vs Bellman-Ford in CSE-2203 Algorithm Exam?',
    answers: 6,
    upvotes: 24,
    course: 'CSE-2203',
    author: 'Arman H. (20231087015)',
    time: '3h ago',
  },
  {
    title: 'Any step-by-step example for BCNF and 3NF decomposition for CSE-2201 Database?',
    answers: 4,
    upvotes: 17,
    course: 'CSE-2201',
    author: 'Mim S. (20232087042)',
    time: '6h ago',
  },
  {
    title: 'What design patterns should we prioritize for CSE-2101 OOP lab test?',
    answers: 8,
    upvotes: 31,
    course: 'CSE-2101',
    author: 'Siam R. (20231087022)',
    time: '1d ago',
  },
  {
    title: 'Tips for 8086 Assembly code memory addressing modes in CSE-3101?',
    answers: 5,
    upvotes: 19,
    course: 'CSE-3101',
    author: 'Nafis K. (20221087008)',
    time: '2d ago',
  },
];
