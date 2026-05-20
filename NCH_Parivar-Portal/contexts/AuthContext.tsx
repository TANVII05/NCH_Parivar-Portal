import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Employee {
  id: string;
  name: string;
  email: string;
  branch: string;
  department: string;
  designation: string;
  shiftTiming: string;
  lunchTiming: string;
  employeeId: string;
  joiningDate: string;
}

interface AuthContextType {
  user: Employee | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<Employee>) => void;
}

export interface SignupData {
  email: string;
  password: string;
  branch: string;
  shiftTiming: string;
  lunchTiming: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  updateUser: () => {},
});

const AUTH_KEY = '@nch_parivar_user';

// Helper to derive employee name from email
function getNameFromEmail(email: string): string {
  const local = email.split('@')[0] || '';
  return local
    .replace(/[._]/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.log('Failed to load user:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, _password: string): Promise<boolean> => {
    try {
      // For now, simulate login — check if user exists in AsyncStorage
      const storedAccounts = await AsyncStorage.getItem('@nch_parivar_accounts');
      const accounts: Record<string, Employee & { password: string }> = storedAccounts
        ? JSON.parse(storedAccounts)
        : {};

      const account = accounts[email.toLowerCase()];
      if (account && account.password === _password) {
        const { password: _, ...employeeData } = account;
        setUser(employeeData);
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(employeeData));
        return true;
      }

      // Demo fallback — allow any login for testing
      const demoUser: Employee = {
        id: 'demo-001',
        name: getNameFromEmail(email),
        email: email.toLowerCase(),
        branch: 'Core Team',
        department: 'Engineering',
        designation: 'Software Engineer',
        shiftTiming: '09:00 AM to 06:00 PM',
        lunchTiming: '01:00 PM to 01:30 PM',
        employeeId: 'NCH-' + Math.floor(1000 + Math.random() * 9000),
        joiningDate: '2024-06-15',
      };
      setUser(demoUser);
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(demoUser));
      return true;
    } catch (e) {
      console.log('Login failed:', e);
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      const name = getNameFromEmail(data.email);
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name,
        email: data.email.toLowerCase(),
        branch: data.branch,
        department: data.branch,
        designation: 'Employee',
        shiftTiming: data.shiftTiming,
        lunchTiming: data.lunchTiming,
        employeeId: 'NCH-' + Math.floor(1000 + Math.random() * 9000),
        joiningDate: new Date().toISOString().split('T')[0],
      };

      // Store account
      const storedAccounts = await AsyncStorage.getItem('@nch_parivar_accounts');
      const accounts: Record<string, Employee & { password: string }> = storedAccounts
        ? JSON.parse(storedAccounts)
        : {};
      
      accounts[data.email.toLowerCase()] = { ...newEmployee, password: data.password };
      await AsyncStorage.setItem('@nch_parivar_accounts', JSON.stringify(accounts));

      // Auto login
      setUser(newEmployee);
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newEmployee));
      return true;
    } catch (e) {
      console.log('Signup failed:', e);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_KEY);
  };

  const updateUser = (data: Partial<Employee>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
