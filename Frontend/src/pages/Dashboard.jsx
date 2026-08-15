import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AgentChat from '../components/AgentChat';
import { mockCurriculums } from '../mockData';

export default function Dashboard() {
  const [availableSubjects, setAvailableSubjects] = useState(["DSA"]);
  const [activeSubject, setActiveSubject] = useState("DSA");
  
  const [activeSubtopic, setActiveSubtopic] = useState(null);
  const [pathway, setPathway] = useState([]);
  
  const studentId = localStorage.getItem('studentId') || '6a7f5dc25aecff29a17ee2bd';

  useEffect(() => {
    // Load selected subjects from local storage if available
    const stored = localStorage.getItem('selectedSubjects');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          setAvailableSubjects(parsed);
          setActiveSubject(parsed[0]);
        }
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    // Update the pathway whenever the active subject changes
    setPathway(mockCurriculums[activeSubject] || []);
    setActiveSubtopic(null); // clear subtopic when switching subject
  }, [activeSubject]);

  return (
    <div className="flex h-screen bg-background text-text font-sans overflow-hidden">
      <Sidebar 
        pathway={pathway} 
        activeSubtopic={activeSubtopic} 
        setActiveSubtopic={setActiveSubtopic} 
        activeSubject={activeSubject}
        setActiveSubject={setActiveSubject}
        availableSubjects={availableSubjects}
      />
      
      {activeSubtopic ? (
        <div className="flex flex-1 overflow-hidden">
          <AgentChat subtopic={activeSubtopic} studentId={studentId} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-surface/50">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Welcome to your Learning Pathway</h3>
          <p className="text-slate-400 text-center max-w-md">Select a topic from the roadmap on the left to begin your personalized learning session.</p>
        </div>
      )}
    </div>
  );
}