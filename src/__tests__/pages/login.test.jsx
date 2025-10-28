import React from 'react'
import { render, screen, fireEvent, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/login/page'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

// Mock the hooks
jest.mock('next/navigation')
jest.mock('@/app/context/AuthContext')

const mockPush = jest.fn()
const mockLogin = jest.fn()

describe('Login Page', () => {
    beforeEach(() => {
        jest.clearAllMocks()

        useRouter.mockReturnValue({
            push: mockPush,
            replace: jest.fn(),
            prefetch: jest.fn(),
        })

        useAuth.mockReturnValue({
            login: mockLogin,
            user: null,
            loading: false,
        })
    })

    test('should render login form elements', () => {
        render(<LoginPage />)

        expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
    })

    test('should show validation errors for empty fields', async () => {
        const user = userEvent.setup()
        render(<LoginPage />)

        const submitButton = screen.getByRole('button', { name: /sign in/i })

        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument()
        })
    })

    test('should show email validation error for invalid email', async () => {
        const user = userEvent.setup()
        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/email address/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        await user.type(emailInput, 'invalid-email')
        await user.type(passwordInput, 'password123')
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/please fix the validation errors/i)).toBeInTheDocument()
        })
    })

    test('should submit form with valid credentials', async () => {
        const user = userEvent.setup()
        mockLogin.mockResolvedValueOnce({ user: { id: 1, name: 'Test User' } })

        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/email address/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
        })

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/posts')
        })
    })

    test('should handle login errors', async () => {
        const user = userEvent.setup()
        mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'))

        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/email address/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'wrongpassword')
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
        })
    })

    test('should toggle password visibility', async () => {
        const user = userEvent.setup()
        render(<LoginPage />)

        const passwordInput = screen.getByLabelText(/password/i)
        const toggleButton = screen.getByRole('button', { name: /👁️/ })

        expect(passwordInput).toHaveAttribute('type', 'password')

        await user.click(toggleButton)
        expect(passwordInput).toHaveAttribute('type', 'text')

        await user.click(toggleButton)
        expect(passwordInput).toHaveAttribute('type', 'password')
    })

    test('should handle Google OAuth login', async () => {
        const user = userEvent.setup()

        // Mock window.location.href
        delete window.location
        window.location = { href: '' }

        render(<LoginPage />)

        const googleButton = screen.getByRole('button', { name: /continue with google/i })

        await user.click(googleButton)

        expect(window.location.href).toBe('http://localhost:5000/auth/google')
    })

    test('should show loading state during submission', async () => {
        const user = userEvent.setup()

        // Mock a delayed login response
        mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/email address/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.click(submitButton)

        expect(screen.getByText(/signing in/i)).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
    })

    test('should have link to register page', () => {
        render(<LoginPage />)

        const registerLink = screen.getByRole('link', { name: /create new account/i })
        expect(registerLink).toHaveAttribute('href', '/register')
    })

    test('should validate email format in real-time', async () => {
        const user = userEvent.setup()
        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/email address/i)

        await user.type(emailInput, 'invalid')

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
        })

        await user.clear(emailInput)
        await user.type(emailInput, 'valid@example.com')

        await waitFor(() => {
            expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument()
        })
    })
})