import { useState, useEffect } from 'react';
import { Send, BookOpen, MessageSquare, Code, X, ChevronRight } from 'lucide-react';

export default function AgentChat({ subtopic, studentId }) {
  const [mainHistory, setMainHistory] = useState([]);
  const [mainInput, setMainInput] = useState('');
  const [isMainLoading, setIsMainLoading] = useState(false);

  // Thread State
  const [activeThread, setActiveThread] = useState(null); // { questionId, title }
  const [threadTab, setThreadTab] = useState('doubt'); // 'doubt' | 'evaluation'
  const [threadHistory, setThreadHistory] = useState({}); // { [questionId]: [messages] }
  const [threadInput, setThreadInput] = useState('');
  const [isThreadLoading, setIsThreadLoading] = useState(false);

  useEffect(() => {
    // Reset state when subtopic changes
    setActiveThread(null);
    setThreadHistory({});
    
    const initMainAgent = async () => {
      setIsMainLoading(true);
      setMainHistory([]);
      setTimeout(() => {
        setMainHistory([
          { 
            id: 'msg_1', 
            sender: 'ai', 
            type: 'theory',
            text: `Welcome to the lesson on **${subtopic.title}**.\n\n${subtopic.theoryContent || "Here we will cover the fundamentals."}` 
          },
          { 
            id: 'msg_2', 
            sender: 'ai', 
            type: 'question',
            text: `**Practice Question:**\n${subtopic.starterCode ? "Implement the solution based on the starter code provided." : "How would you approach solving this problem?"}`,
            questionId: 'q_1'
          }
        ]);
        setIsMainLoading(false);
      }, 1000);
    };
    initMainAgent();
  }, [subtopic]);

  const handleSendMain = () => {
    if (!mainInput.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: 'student', text: mainInput, type: 'text' };
    setMainHistory(prev => [...prev, userMsg]);
    setMainInput('');
    setIsMainLoading(true);

    setTimeout(() => {
      setMainHistory(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'ai', 
        type: 'text', 
        text: `I see you are asking about "${userMsg.text}". Let's break that down...` 
      }]);
      setIsMainLoading(false);
    }, 1000);
  };

  const openThread = (questionId, title) => {
    setActiveThread({ questionId, title });
    if (!threadHistory[questionId]) {
      setThreadHistory(prev => ({
        ...prev,
        [questionId]: [
          { sender: 'ai', text: "I'm your assistant for this question. Do you have a doubt, or would you like to submit your code for evaluation?", type: 'text' }
        ]
      }));
    }
  };

  const handleSendThread = () => {
    if (!threadInput.trim() || !activeThread) return;
    const qId = activeThread.questionId;
    const userMsg = { sender: 'student', text: threadInput, type: 'text' };
    
    setThreadHistory(prev => ({
      ...prev,
      [qId]: [...(prev[qId] || []), userMsg]
    }));
    setThreadInput('');
    setIsThreadLoading(true);

    setTimeout(() => {
      const responseText = threadTab === 'doubt' 
        ? `Here is a hint for your doubt regarding: "${userMsg.text}". Try looking at the problem constraints.`
        : `Evaluating your code: "${userMsg.text}". \n\nSyntax looks correct, but it might fail on edge cases.`;
        
      setThreadHistory(prev => ({
        ...prev,
        [qId]: [...(prev[qId] || []), { sender: 'ai', text: responseText, type: 'text' }]
      }));
      setIsThreadLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-1 w-full h-full bg-[#0f172a] text-slate-200">
      
      {/* MAIN CHAT AREA */}
      <div className={`flex flex-col h-full transition-all duration-300 ${activeThread ? 'w-1/2 border-r border-slate-700/70' : 'w-full'}`}>
        <div className="flex items-center px-6 py-4 bg-surface/80 border-b border-slate-700/70">
          <BookOpen className="w-5 h-5 text-primary mr-3" />
          <h2 className="text-[16px] font-semibold tracking-wide">Main Instructor</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0f172a]">
          {mainHistory.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-5 shadow-sm text-[15px] leading-relaxed ${
                msg.sender === 'student' 
                  ? 'bg-primary text-white rounded-tr-sm' 
                  : 'bg-surface border border-slate-700/80 rounded-tl-sm'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                
                {/* If message is a question, render the "Open Thread" button */}
                {msg.type === 'question' && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <button 
                      onClick={() => openThread(msg.questionId, "Practice Question")}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-blue-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Open Thread for Doubts & Submission
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isMainLoading && (
            <div className="flex justify-start">
              <div className="bg-surface border border-slate-700/80 rounded-2xl rounded-tl-sm px-5 py-3.5 text-sm animate-pulse">
                Instructor is typing...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-surface/50 border-t border-slate-700/70">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <input 
              type="text"
              value={mainInput}
              onChange={(e) => setMainInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMain()}
              placeholder="Ask the instructor a general question..."
              className="flex-1 bg-[#0f172a] border border-slate-600/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <button 
              onClick={handleSendMain}
              disabled={isMainLoading}
              className="bg-primary text-white p-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* THREAD PANEL */}
      {activeThread && (
        <div className="w-1/2 flex flex-col h-full bg-surface/30">
          <div className="flex items-center justify-between px-6 py-4 bg-surface/80 border-b border-slate-700/70">
            <div className="flex items-center gap-3">
              <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase">Thread</span>
              <h3 className="text-[15px] font-medium text-slate-200">{activeThread.title}</h3>
            </div>
            <button 
              onClick={() => setActiveThread(null)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex border-b border-slate-700/70 bg-surface/50">
            <button 
              onClick={() => setThreadTab('doubt')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${threadTab === 'doubt' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <MessageSquare className="w-4 h-4" /> Doubt Agent
            </button>
            <button 
              onClick={() => setThreadTab('evaluation')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${threadTab === 'evaluation' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Code className="w-4 h-4" /> Code Evaluation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {(threadHistory[activeThread.questionId] || []).map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-[14.5px] leading-relaxed ${
                  msg.sender === 'student' 
                    ? (threadTab === 'evaluation' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-primary text-white rounded-tr-sm')
                    : 'bg-surface border border-slate-700/80 rounded-tl-sm'
                }`}>
                  <div className={msg.sender === 'student' && threadTab === 'evaluation' ? 'font-mono text-sm' : 'whitespace-pre-wrap'}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isThreadLoading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-slate-700/80 rounded-2xl rounded-tl-sm px-5 py-3.5 text-sm animate-pulse">
                  Agent is analyzing...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-surface border-t border-slate-700/70">
            <div className="flex gap-3">
              <textarea 
                value={threadInput}
                onChange={(e) => setThreadInput(e.target.value)}
                placeholder={threadTab === 'doubt' ? "Ask your doubt..." : "Paste your code here for evaluation..."}
                rows={threadTab === 'evaluation' ? 3 : 1}
                className={`flex-1 bg-[#0f172a] border border-slate-600/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all resize-none ${threadTab === 'evaluation' ? 'font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' : 'focus:border-primary focus:ring-1 focus:ring-primary'}`}
              />
              <button 
                onClick={handleSendThread}
                disabled={isThreadLoading}
                className={`text-white p-3 rounded-xl disabled:opacity-50 transition-colors shadow-md self-end ${threadTab === 'evaluation' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-primary hover:bg-blue-600'}`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}