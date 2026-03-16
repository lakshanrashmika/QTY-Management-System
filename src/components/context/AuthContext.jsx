import React, { useState, createContext, useContext } from 'react';

// Mock users for demo
const mockUsers = [
    {
        user_id: '1',
        business_id: 'biz1',
        full_name: 'John Admin',
        email: 'admin@demo.com',
        phone: '+1234567890',
        role: 'admin',
        status: 'active',
        password: 'admin123',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        user_id: '2',
        business_id: 'biz1',
        full_name: 'Jane Staff',
        email: 'staff@demo.com',
        phone: '+1234567891',
        role: 'staff',
        status: 'active',
        password: 'staff123',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        user_id: '3',
        full_name: 'Super Admin',
        email: 'super@demo.com',
        phone: '+1234567892',
        role: 'super_admin',
        status: 'active',
        password: 'super123',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// Role-based permissions
const rolePermissions = {
    super_admin: ['*'],
    admin: [
        'dashboard',
        'customers',
        'categories',
        'items',
        'wholesale',
        'couriers',
        'orders',
        'qty_management',
        'returns',
        'payments',
        'damages',
        'users',
        'reports',
        'settings',
        'revenue',
    ],
    staff: [
        'dashboard',
        'customers',
        'categories',
        'items',
        'orders',
        'qty_management',
        'returns',
        'damages',
        'couriers',
    ],
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (email, password) => {
        const foundUser = mockUsers.find(
            (u) => u.email === email && u.password === password
        );

        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const hasPermission = (permission) => {
        if (!user) return false;
        const permissions = rolePermissions[user.role];
        return permissions.includes('*') || permissions.includes(permission);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                hasPermission,
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

export default AuthContext;