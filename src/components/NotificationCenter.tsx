import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Calendar, 
  Sparkles, 
  TestTube2, 
  PackageCheck, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    unreadNotificationCount, 
    markNotificationRead, 
    markAllNotificationsRead,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    setPortal,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  if (!isNotificationDrawerOpen) return null;

  const filteredNotifs = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'analysis':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'sample':
        return <TestTube2 className="w-4 h-4 text-red-600" />;
      case 'order':
        return <PackageCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-5 flex items-center justify-between border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-700 text-white relative">
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-blue-900 animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">
                {t('notifications')}
              </h2>
              <p className="text-xs text-blue-200">
                {unreadNotificationCount} unread alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadNotificationCount > 0 && (
              <button
                id="mark-all-notifications-read-btn"
                onClick={markAllNotificationsRead}
                className="text-xs text-blue-200 hover:text-white underline font-medium px-2 py-1"
                title={t('markAllRead')}
              >
                <CheckCheck className="w-4 h-4 inline mr-1" />
                Read All
              </button>
            )}
            <button
              id="close-notifications-btn"
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-red-600 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex gap-2">
          <button
            id="tab-all-notifications"
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            id="tab-unread-notifications"
            onClick={() => setActiveTab('unread')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'unread'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unread ({unreadNotificationCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-slate-700 font-medium text-sm">
                {t('noNotifications')}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                You're all caught up! Updates regarding appointments, lab samples, and medicine orders will appear here.
              </p>
            </div>
          ) : (
            filteredNotifs.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationRead(item.id);
                  if (item.targetPortal) {
                    setPortal(item.targetPortal);
                    setIsNotificationDrawerOpen(false);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  !item.read
                    ? 'border-blue-300 bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                {!item.read && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-blue-600"></span>
                )}

                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    !item.read ? 'bg-white shadow-xs' : 'bg-slate-100'
                  }`}>
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 pr-3">
                    <h4 className="font-bold text-xs text-slate-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span>
                      {item.targetPortal && (
                        <span className="text-blue-600 font-semibold flex items-center gap-0.5 hover:underline">
                          View in {item.targetPortal.toUpperCase()}
                          <ArrowRight className="w-3 h-3 inline" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            AilynkX Health Notification Engine • Real-Time Alerts Across All Portals
          </p>
        </div>
      </div>
    </div>
  );
};
