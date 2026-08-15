import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';

const SUBJECTS = [
  "DSA",
  "C++ programming",
  "Java OOP",
  "Web Programming"
];

export default function Onboarding() {
  const [courseName, setCourseName] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('1');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const navigate = useNavigate();

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }
    // Save to local storage for the dashboard to use
    localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans py-12 px-4">
      <div className="w-full max-w-2xl bg-surface p-8 md:p-10 rounded-2xl shadow-2xl border border-slate-700/50">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">Personalize Your Pathway</h2>
          <p className="text-slate-400 mt-2">Tell us about your academic background so we can tailor the curriculum for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Degree / Course Name</label>
              <input
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600/80 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Year of Study</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600/80 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Which subjects do you want to master? (Select multiple)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUBJECTS.map((subject) => {
                const isSelected = selectedSubjects.includes(subject);
                return (
                  <div 
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={`cursor-pointer flex items-center justify-between p-4 rounded-lg border transition-all ${
                      isSelected 
                        ? 'bg-primary/10 border-primary text-white shadow-sm' 
                        : 'bg-[#0f172a] border-slate-700/80 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="font-medium text-sm">{subject}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-700/70">
            <button
              type="submit"
              className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition-all shadow-md"
            >
              Generate Pathway
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
