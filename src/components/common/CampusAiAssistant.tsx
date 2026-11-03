import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ExternalLink,
  HelpCircle,
  Utensils,
  Clock,
  ShieldAlert,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actions?: { label: string; url?: string; actionId?: string }[];
}

const QUICK_PROMPTS = [
  { label: '📝 How to file a complaint?', key: 'complaint' },
  { label: '🍱 Today\'s Mess Schedule', key: 'mess' },
  { label: '📊 Attendance 75% Rule', key: 'attendance' },
  { label: '🎭 How to try Demo Roles?', key: 'demo' },
  { label: '🚨 Emergency Warden Contact', key: 'emergency' },
];

export const CampusAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Namaste! 👋 I am your CampusSaathi AI Assistant. How can I help you today?',
      timestamp: 'Just now',
      actions: [
        { label: 'File Complaint', url: '/app/student/new-complaint' },
        { label: 'View Attendance', url: '/app/student/attendance' },
        { label: 'Explore Portals', url: '/features' },
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateResponse = (query: string): { reply: string; actions?: { label: string; url?: string }[] } => {
    const q = query.toLowerCase();

    if (q.includes('complaint') || q.includes('grievance') || q.includes('report') || q.includes('issue') || q.includes('problem')) {
      return {
        reply: 'You can submit a grievance in under 30 seconds! Simply take a photo of the issue (e.g. broken fan, Wi-Fi problem, plumbing leak) and upload it via the Student Portal. Our AI auto-categorizes it for the Warden and technician.',
        actions: [
          { label: 'Submit Complaint Now', url: '/app/student/new-complaint' },
          { label: 'Track Existing Status', url: '/app/student/complaints' },
        ],
      };
    }

    if (q.includes('mess') || q.includes('food') || q.includes('lunch') || q.includes('dinner') || q.includes('breakfast')) {
      return {
        reply: 'Today\'s Mess Timings:\n• Breakfast: 7:30 AM – 9:00 AM\n• Lunch: 12:30 PM – 2:00 PM\n• Evening Snacks: 5:00 PM – 6:00 PM\n• Dinner: 8:00 PM – 9:30 PM\n\nYou can rate today\'s meal taste and hygiene in the Mess Portal!',
        actions: [{ label: 'Mess Feedback Portal', url: '/app/student/mess' }],
      };
    }

    if (q.includes('attendance') || q.includes('absent') || q.includes('75') || q.includes('percentage')) {
      return {
        reply: 'University Regulations require a minimum of 75% cumulative attendance to be eligible for end-semester exams. If your attendance dips below 75%, an automated warning is sent to your dashboard and guardian.',
        actions: [{ label: 'Check My Attendance', url: '/app/student/attendance' }],
      };
    }

    if (q.includes('demo') || q.includes('role') || q.includes('login') || q.includes('switch') || q.includes('test')) {
      return {
        reply: 'CampusSaathi features 9 distinct portals! You can test them without typing passwords using the "Role Switcher" button on the top-right header, or choose from Student, Warden, Faculty, Parent, and Admin.',
        actions: [
          { label: 'Student Portal', url: '/app/student' },
          { label: 'Warden Console', url: '/app/warden' },
          { label: 'Faculty Dashboard', url: '/app/teacher' },
        ],
      };
    }

    if (q.includes('warden') || q.includes('emergency') || q.includes('security') || q.includes('contact')) {
      return {
        reply: 'Hostel & Security Helpline:\n• Campus Central Control: +91 180 225 8097\n• Chief Warden Office: Block B, Room 102\n• Medical Emergency: Ext. 911 / Ambulance Bay',
        actions: [{ label: 'Contact Helpdesk', url: '/support' }],
      };
    }

    return {
      reply: 'I understand you are asking about: "' + query + '". CampusSaathi helps you manage academics, track attendance, report hostel grievances, and inspect campus notifications seamlessly.',
      actions: [
        { label: 'Visit Student Portal', url: '/app/student' },
        { label: 'View All Features', url: '/features' },
      ],
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const res = generateResponse(text);
      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: res.reply,
        timestamp: 'Just now',
        actions: res.actions,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (url?: string) => {
    if (url) {
      navigate(url);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-teal-600 via-sky-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-medium rounded-full shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/25 cursor-pointer"
            aria-label="Open Campus AI Assistant"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            </span>
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide">AI Assistant</span>
          </button>
        )}
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-teal-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Campus AI Assistant
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full font-medium border border-teal-500/30">
                    Online
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">24/7 Smart Campus Help & Guidance</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome-reset',
                      sender: 'ai',
                      text: 'Chat refreshed! Ask me anything about campus, mess, attendance, or complaints.',
                      timestamp: 'Just now',
                    },
                  ])
                }
                title="Reset conversation"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.key}
                onClick={() => handleSend(p.label)}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-teal-900/40 hover:text-teal-300 text-slate-300 border border-slate-700/60 hover:border-teal-500/40 transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5 text-teal-300">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={`max-w-[82%] space-y-1.5`}>
                  <div
                    className={`p-3 rounded-2xl whitespace-pre-line text-[13px] leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Optional Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act.url)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 bg-teal-500/15 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 rounded-lg transition-colors cursor-pointer"
                        >
                          {act.label}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5 text-blue-300">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs py-1">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 text-teal-300">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="flex items-center gap-1 bg-slate-800 px-3 py-2 rounded-2xl border border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about campus, mess, exams..."
              className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

