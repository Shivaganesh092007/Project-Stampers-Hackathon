import { ChevronRight, ChevronDown, CheckCircle, Circle, PlayCircle, Book } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ pathway, activeSubtopic, setActiveSubtopic, activeSubject, setActiveSubject, availableSubjects }) {
  const [expandedTopics, setExpandedTopics] = useState({});

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'in_progress': return <PlayCircle className="w-4 h-4 text-primary" />;
      default: return <Circle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="w-[320px] bg-surface border-r border-slate-700/70 flex flex-col h-full shadow-lg z-10">
      <div className="px-6 py-5 border-b border-slate-700/70 bg-surface/80">
        <h2 className="text-[17px] font-bold text-slate-100 tracking-wide mb-3">Learning Pathway</h2>
        <div className="relative">
          <Book className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={activeSubject}
            onChange={(e) => setActiveSubject(e.target.value)}
            className="w-full bg-[#0f172a] border border-slate-600/80 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary appearance-none cursor-pointer"
          >
            {availableSubjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {pathway.map((topic) => (
          <div key={topic._id} className="mb-1">
            <button 
              onClick={() => toggleTopic(topic._id)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-700/40 transition-colors group"
            >
              <span className="font-semibold text-[15px] text-slate-200 group-hover:text-white transition-colors">{topic.title}</span>
              {expandedTopics[topic._id] ? (
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
              )}
            </button>
            
            {expandedTopics[topic._id] && (
              <div className="ml-5 mt-2 border-l-2 border-slate-700/70 pl-3 space-y-1.5">
                {topic.subtopics.map(sub => (
                  <button
                    key={sub._id}
                    onClick={() => setActiveSubtopic({ ...sub, topicTitle: topic.title })}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-[14.5px] font-medium transition-all ${
                      activeSubtopic?._id === sub._id 
                        ? 'bg-primary/15 text-primary border border-primary/20 shadow-sm' 
                        : 'hover:bg-slate-700/30 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {getStatusIcon(sub.status)}
                    <span className="truncate text-left">{sub.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}