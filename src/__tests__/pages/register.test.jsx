import React from 'react'
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import RegisterPage from '@/app/register/page'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

// Mock the hooks
jest.mock('next/navigation')
jest.mock('@/app/context/AuthContext')

const mockPush = jest.fn()
const mockRegister = jest.fn()

describe('Register Page', () => {
    beforeEach(() => {
        jest.clearAllMocks()

        useRouter.mockReturnValue({
            push: mockPush,
            replace: jest.fn(),
            prefetch: jest.fn(),
        })

        useAuth.mockReturnValue({
            register: mockRegister,
            user: null,
            loading: false,
        })
    })

    test('should render registration form elements', () => {
        render(<RegisterPage />)

        expect(screen.getByRole('heading', { name: /join our community/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
    })

    test('should show validation errors for empty fields', async () => {
        const user = userEvent.setup()
        render(<RegisterPage />)

        const submitButton = screen.getByRole('button', { name: /create account/i })

        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/please enter your name/i)).toBeInTheDocument()
        })
    })

    test('should validate name length', async () => {
        const user = userEvent.setup()
        render(<RegisterPage />)

        const nameInput = screen.getByLabelText(/full name/i)

        await user.type(nameInput, 'A')

        await waitFor(() => {
            expect(screen.getByText(/name should be at least 2 characters/i)).toBeInTheDocument()
        })

        await user.clear(nameInput)
        await user.type(nameInput, 'Valid Name')

        await waitFor(() => {
            expect(screen.queryByText(/name should be at least 2 characters/i)).not.toBeInTheDocument()
        })
    })

    test('should validate email format', async () => {
        const user = userEvent.setup()
        render(<RegisterPage />)

        const emailInput = screen.getByLabelText(/email address/i)

        await user.type(emailInput, 'invalid-email')

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
        })
    })

    test('should validate password length', async () => {
        const user = userEvent.setup()
        render(<RegisterPage />)

        const passwordInput = screen.getByLabelText(/^password$/i)

        await user.type(passwordInput, '123')

        await waitFor(() => {
            expect(screen.getByText(/password should be at least 6 characters/i)).toBeInTheDocument()
        })

        await user.clear(passwordInput)
        await user.type(passwordInput, '123456')

        await waitFor(() => {
            expect(screen.getByText(/password looks good!/i)).toBeInTheDocument()
        })
    })

    test('should validate password confirmation', async () => {
        const user = userEvent.setup()
        render(<RegisterPage />)

        const passwordInput = screen.getByLabelText(/^password$/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'different')

        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
        })

        await user.clear(confirmPasswordInput)
        await user.type(confirmPasswordInput, 'password123')

        await waitFor(() => {
            expect(screen.getByText(/passwords match!/i)).toBeInTheDocument()
        })
    })

    test('should submit form with valid data', async () => {
        const user = userEvent.setup()
        mockRegister.mockResolvedValueOnce({ user: { id: 1, name: 'Test User' } })

        render(<RegisterPage />)

        const nameInput = screen.getByLabelText(/full name/i)
        const emailInput = screen.getByLabelText(/email address/i)
        const passwordInput = screen.getByLabelText(/^password$/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        await user.type(nameInput, 'Test User')
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'password123')
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123')
        })

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/posts')
        })
    })

    test('should handle registration errors', async () => {
        const user = userEvent.setup()
        mockRegister.mockRejectedValueOnce(new Error('Email already exists'))

        render(<RegisterPage />)

        const nameInput = screen.getByLabelText(/full name/i)
        const emailInput = screen.getByLabelText(/email address/i)
        const passwordInput = screen.getByLabelText(/^password$/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        await user.type(nameInput, 'Test User')
        await user.type(emailInput, 'existing@example.com')
        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'password123')
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
        })
    })

    test('should toggle password visibility', async () => {
        const user = userEvent.setup()
        render(<RegisterPage />)

        const passwordInput = screen.getByLabelText(/^password$/i)
        const toggleButton = screen.getByRole('button', { name: /👁️/ })

        expect(passwordInput).toHaveAttribute('type', 'password')

        await user.click(toggleButton)
        expect(passwordInput).toHaveAttribute('type', 'text')

        await user.click(toggleButton)
        expect(passwordInput).toHaveAttribute('type', 'password')
    })

    test('should handle Google OAuth registration', async () => {
        const user = userEvent.setup()

        // Mock window.location.href
        delete window.location
        window.location = { href: '' }

        render(<RegisterPage />)

        const googleButton = screen.getByRole('button', { name: /continue with google/i })

        await user.click(googleButton)

        expect(window.location.href).toBe('http://localhost:5000/auth/google')
    })

    test('should show loading state during submission', async () => {
        const user = userEvent.setup()

        // Mock a delayed register response
        mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

        render(<RegisterPage />)

        const nameInput = screen.getByLabelText(/full name/i)
        const emailInput = screen.getByLabelText(/email address/i)
        const passwordInput = screen.getByLabelText(/^password$/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        await user.type(nameInput, 'Test User')
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'password123')
        await user.click(submitButton)

        expect(screen.getByText(/creating account/i)).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
    })

    test('should have link to login page', () => {
        render(<RegisterPage />)

        const loginLink = screen.getByRole('link', { name: /sign in instead/i })
        expect(loginLink).toHaveAttribute('href', '/login')
    })

    test('should prevent submission with validation errors', async () => {
        const user = userEvent.setup()
        render(<RegisterPage />)

        const nameInput = screen.getByLabelText(/full name/i)
        const emailInput = screen.getByLabelText(/email address/i)
        const passwordInput = screen.getByLabelText(/^password$/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        // Fill with invalid data
        await user.type(nameInput, 'A') // Too short
        await user.type(emailInput, 'invalid-email')
        await user.type(passwordInput, '123') // Too short
        await user.type(confirmPasswordInput, '456') // Doesn't match

        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/please fix the validation errors/i)).toBeInTheDocument()
        })

        expect(mockRegister).not.toHaveBeenCalled()
    })
})