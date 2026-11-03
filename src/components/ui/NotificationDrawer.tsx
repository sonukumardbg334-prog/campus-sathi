import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, X, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import { Notification } from '../../types';
import { useNavigate } from 'react-router-dom';

export const NotificationDrawer: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const update = () => {
      setNotifications(campusStore.getNotifications(user.id));
    };
    update();
    return campusStore.subscribe(update);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = () => {
    if (user) {
      campusStore.markAllNotificationsRead(user.id);
    }
  };

  const handleClickItem = (n: Notification) => {
    campusStore.markNotificationRead(n.id);
    setIsOpen(false);
    if (user?.role === 'warden') navigate('/app/warden');
    else if (user?.role === 'student') navigate('/app/student');
    else if (user?.role === 'maintenance') navigate('/app/maintenance');
    else if (user?.role === 'parent') navigate('/app/parent');
    else if (user?.role === 'institution_admin') navigate('/app/admin');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setIsOpen(false)} />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-white/15 flex flex-col text-slate-900 dark:text-white">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-cyan-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--page-foreground)]">Notifications</h3>
                    <p className="text-[11px] text-[var(--muted-foreground)]">{unreadCount} unread updates</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center text-[var(--muted-foreground)] text-xs">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleClickItem(n)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-xs ${
                        !n.is_read
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/30 text-slate-900 dark:text-white'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-[var(--page-foreground)] flex items-center gap-1.5">
                          {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />}
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[var(--muted-foreground)] shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Just now
                        </span>
                      </div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{n.message}</p>
                      <div className="mt-2 flex items-center justify-end text-[11px] font-semibold text-blue-600 dark:text-cyan-400">
                        <span className="flex items-center gap-1">
                          View details <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

