import React from 'react'
import { render, screen, waitFor } from '../test-utils'
import ProtectedRoute from '@/utils/ProtectedRoute'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

// Mock the hooks
jest.mock('@/app/context/AuthContext')
jest.mock('next/navigation')

const mockReplace = jest.fn()

const TestComponent = () => <div>Protected Content</div>

describe('ProtectedRoute', () => {
    beforeEach(() => {
        jest.clearAllMocks()

        useRouter.mockReturnValue({
            replace: mockReplace,
            push: jest.fn(),
            prefetch: jest.fn(),
        })
    })

    test('should show loading state when auth is loading', () => {
        useAuth.mockReturnValue({
            user: null,
            loading: true,
        })

        render(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        expect(screen.getByText(/checking authentication/i)).toBeInTheDocument()
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    test('should render children when user is authenticated', () => {
        useAuth.mockReturnValue({
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            loading: false,
        })

        render(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        expect(screen.getByText('Protected Content')).toBeInTheDocument()
        expect(mockReplace).not.toHaveBeenCalled()
    })

    test('should redirect to login when user is not authenticated', async () => {
        useAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        expect(screen.getByText(/redirecting to login/i)).toBeInTheDocument()
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/login')
        })
    })

    test('should handle transition from loading to authenticated', async () => {
        const { rerender } = render(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        // Initially loading
        useAuth.mockReturnValue({
            user: null,
            loading: true,
        })

        rerender(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        expect(screen.getByText(/checking authentication/i)).toBeInTheDocument()

        // Then authenticated
        useAuth.mockReturnValue({
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            loading: false,
        })

        rerender(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        expect(screen.getByText('Protected Content')).toBeInTheDocument()
        expect(mockReplace).not.toHaveBeenCalled()
    })

    test('should handle transition from loading to unauthenticated', async () => {
        const { rerender } = render(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        // Initially loading
        useAuth.mockReturnValue({
            user: null,
            loading: true,
        })

        rerender(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        expect(screen.getByText(/checking authentication/i)).toBeInTheDocument()

        // Then not authenticated
        useAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        rerender(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        expect(screen.getByText(/redirecting to login/i)).toBeInTheDocument()

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/login')
        })
    })

    test('should not redirect multiple times', async () => {
        useAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        const { rerender } = render(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/login')
        })

        // Re-render with same props
        rerender(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        // Should not call replace again
        expect(mockReplace).toHaveBeenCalledTimes(1)
    })

    test('should render multiple children correctly', () => {
        useAuth.mockReturnValue({
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            loading: false,
        })

        render(
            <ProtectedRoute>
                <div>First Child</div>
                <div>Second Child</div>
            </ProtectedRoute>
        )

        expect(screen.getByText('First Child')).toBeInTheDocument()
        expect(screen.getByText('Second Child')).toBeInTheDocument()
    })

    test('should handle undefined user gracefully', async () => {
        useAuth.mockReturnValue({
            user: undefined,
            loading: false,
        })

        render(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        )

        expect(screen.getByText(/redirecting to login/i)).toBeInTheDocument()

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/login')
        })
    })
})