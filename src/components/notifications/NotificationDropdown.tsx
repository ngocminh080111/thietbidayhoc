// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// PHASE 6: SMART NOTIFICATION & SYSTEM ALERT DROPDOWN
// ==============================================================================
import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Trash2,
  Wrench,
  ClipboardCheck,
  Info,
  Check,
  ExternalLink,
  X
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { AppNotification, NotificationType, NotificationSeverity } from '../../types/index.ts';

interface NotificationDropdownProps {
  onNavigate: (tab: any, params?: any) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'URGENT'>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Lỗi tải danh sách thông báo:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds for live awareness
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const urgentCount = notifications.filter(n => !n.is_read && (n.severity === 'URGENT' || n.severity === 'HIGH')).length;

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Lỗi đánh dấu đã đọc:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Lỗi đánh dấu tất cả đã đọc:', err);
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    handleMarkAsRead(notif.id);
    setIsOpen(false);

    // Contextual navigation based on notification type
    switch (notif.type) {
      case 'DAMAGE_ALERT':
        onNavigate('damages');
        break;
      case 'WARRANTY_EXPIRING':
        onNavigate('equipment');
        break;
      case 'LIQUIDATION_SUGGESTION':
        onNavigate('liquidation');
        break;
      case 'MAINTENANCE_DUE':
        onNavigate('maintenance');
        break;
      case 'INVENTORY_ALERT':
        onNavigate('inventory');
        break;
      default:
        onNavigate('dashboard');
        break;
    }
  };

  const getNotificationIcon = (type: NotificationType, severity: NotificationSeverity) => {
    switch (type) {
      case 'DAMAGE_ALERT':
        return <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />;
      case 'WARRANTY_EXPIRING':
        return <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'LIQUIDATION_SUGGESTION':
        return <Trash2 className="w-5 h-5 text-purple-600 shrink-0" />;
      case 'MAINTENANCE_DUE':
        return <Wrench className="w-5 h-5 text-blue-600 shrink-0" />;
      case 'INVENTORY_ALERT':
        return <ClipboardCheck className="w-5 h-5 text-emerald-600 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-slate-600 shrink-0" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'UNREAD') return !n.is_read;
    if (activeFilter === 'URGENT') return n.severity === 'URGENT' || n.severity === 'HIGH';
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
        title="Thông báo & Cảnh báo hệ thống"
        aria-label="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className={`absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white rounded-full ${
            urgentCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-blue-600'
          }`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div
          id="notification-dropdown-panel"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 origin-top-right overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900">Thông báo & Cảnh báo</h3>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Đã đọc tất cả</span>
              </button>
            )}
          </div>

          {/* Quick Filter Tabs */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('UNREAD')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeFilter === 'UNREAD'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
            <button
              onClick={() => setActiveFilter('URGENT')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeFilter === 'URGENT'
                  ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Khẩn cấp ({urgentCount})
            </button>
          </div>

          {/* List of Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Không có thông báo nào trong mục này</p>
              </div>
            ) : (
              filteredNotifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start space-x-3 text-left ${
                    !notif.is_read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="mt-0.5">
                    {getNotificationIcon(notif.type, notif.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-xs font-semibold truncate ${
                        !notif.is_read ? 'text-slate-900' : 'text-slate-700'
                      }`}>
                        {notif.title}
                      </span>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-1.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>
                        {new Date(notif.created_at).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {notif.target_code && (
                        <span className="inline-flex items-center space-x-0.5 text-blue-600 font-medium">
                          <span>{notif.target_code}</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pt-2.5 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate('dashboard');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              Xem trung tâm tổng quan hệ thống &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
