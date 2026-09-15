// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// AUTHENTICATION & RBAC CONTEXT
// ==============================================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, RoleName } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  currentUser: UserProfile | null;
  availableUsers: UserProfile[];
  loading: boolean;
  loginAs: (user: UserProfile) => void;
  logout: () => void;
  hasRole: (role: RoleName | RoleName[]) => boolean;
  isAdmin: boolean;
  isEquipmentManager: boolean;
  isDepartmentHead: boolean;
  isTeacher: boolean;
  canManageEquipment: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const users = await api.getUsers();
        setAvailableUsers(users);

        // Restore saved user or default to Equipment Manager (core persona)
        const savedUserId = localStorage.getItem('cdx_user_id');
        const matched = users.find(u => u.id === savedUserId);
        if (matched) {
          setCurrentUser(matched);
        } else if (users.length > 1) {
          // Default to Equipment Manager for intuitive exploration
          const defaultUser = users.find(u => u.roles.includes('EQUIPMENT_MANAGER')) || users[0];
          setCurrentUser(defaultUser);
        }
      } catch (err) {
        console.error('Failed to load initial users:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const loginAs = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('cdx_user_id', user.id);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cdx_user_id');
  };

  const hasRole = (role: RoleName | RoleName[]): boolean => {
    if (!currentUser) return false;
    const requiredRoles = Array.isArray(role) ? role : [role];
    return currentUser.roles.some(r => requiredRoles.includes(r));
  };

  const isAdmin = hasRole('ADMIN');
  const isEquipmentManager = hasRole('EQUIPMENT_MANAGER');
  const isDepartmentHead = hasRole('DEPARTMENT_HEAD');
  const isTeacher = hasRole('TEACHER');

  // Can manage equipment: Admin or Equipment Manager
  const canManageEquipment = isAdmin || isEquipmentManager;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        availableUsers,
        loading,
        loginAs,
        logout,
        hasRole,
        isAdmin,
        isEquipmentManager,
        isDepartmentHead,
        isTeacher,
        canManageEquipment
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
