import React from 'react'
import { render, screen, waitFor, act } from '../test-utils'
import { AuthProvider, useAuth } from '@/app/context/AuthContext'
import { api } from '@/lib/api'

// Mock the API
jest.mock('@/lib/api')
const mockApi = api

// Test component to access auth context
const TestComponent = () => {
    const { user, loading, login, register, logout } = useAuth()

    return (
        <div>
            <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
            <div data-testid="user">{user ? user.name : 'No User'}</div>
            <button
                data-testid="login-btn"
                onClick={() => login('test@example.com', 'password')}
            >
                Login
            </button>
            <button
                data-testid="register-btn"
                onClick={() => register('Test User', 'test@example.com', 'password')}
            >
                Register
            </button>
            <button data-testid="logout-btn" onClick={logout}>
                Logout
            </button>
        </div>
    )
}

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('should provide initial loading state', () => {
        mockApi.mockResolvedValueOnce({ user: null })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
        expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })

    test('should fetch user on mount', async () => {
        const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }
        mockApi.mockResolvedValueOnce({ user: mockUser })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
        })

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('Test User')
        })

        expect(mockApi).toHaveBeenCalledWith('/auth/me')
    })

    test('should handle login successfully', async () => {
        const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }

        // Mock initial fetch (no user)
        mockApi.mockResolvedValueOnce({ user: null })
        // Mock login response
        mockApi.mockResolvedValueOnce({ message: 'Login successful', user: mockUser })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
        })

        // Perform login
        await act(async () => {
            screen.getByTestId('login-btn').click()
        })

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('Test User')
        })

        expect(mockApi).toHaveBeenCalledWith('/auth/login', 'POST', {
            email: 'test@example.com',
            password: 'password'
        })
    })

    test('should handle register successfully', async () => {
        const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }

        // Mock initial fetch (no user)
        mockApi.mockResolvedValueOnce({ user: null })
        // Mock register response
        mockApi.mockResolvedValueOnce({ message: 'User created successfully', user: mockUser })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
        })

        // Perform registration
        await act(async () => {
            screen.getByTestId('register-btn').click()
        })

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('Test User')
        })

        expect(mockApi).toHaveBeenCalledWith('/auth/register', 'POST', {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password'
        })
    })

    test('should handle logout successfully', async () => {
        const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }

        // Mock initial fetch (with user)
        mockApi.mockResolvedValueOnce({ user: mockUser })
        // Mock logout response
        mockApi.mockResolvedValueOnce({ message: 'Logout successful' })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        // Wait for initial load with user
        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('Test User')
        })

        // Perform logout
        await act(async () => {
            screen.getByTestId('logout-btn').click()
        })

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('No User')
        })

        expect(mockApi).toHaveBeenCalledWith('/auth/logout', 'POST')
    })

    test('should handle API errors gracefully', async () => {
        // Mock API error
        mockApi.mockRejectedValueOnce(new Error('API Error'))

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
        })

        expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })

    test('should handle login errors', async () => {
        // Mock initial fetch (no user)
        mockApi.mockResolvedValueOnce({ user: null })
        // Mock login error
        mockApi.mockRejectedValueOnce(new Error('Invalid credentials'))

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
        })

        // Attempt login
        await act(async () => {
            screen.getByTestId('login-btn').click()
        })

        // User should still be null after failed login
        expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })
})