import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '../../app/page'

// Mock the auth context
const mockUseAuth = jest.fn()

jest.mock('../../app/context/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}))

describe('Homepage (Simple)', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('should render homepage for unauthenticated users', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(<HomePage />)

        expect(screen.getByText(/welcome to samar blogs/i)).toBeInTheDocument()
        expect(screen.getByText(/join our community/i)).toBeInTheDocument()
        expect(screen.getByText(/sign in/i)).toBeInTheDocument()
    })

    test('should render homepage for authenticated users', () => {
        mockUseAuth.mockReturnValue({
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            loading: false,
        })

        render(<HomePage />)

        expect(screen.getByText(/welcome to samar blogs/i)).toBeInTheDocument()
        expect(screen.getByText(/start writing/i)).toBeInTheDocument()
        expect(screen.getByText(/browse posts/i)).toBeInTheDocument()
    })

    test('should render all feature cards', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(<HomePage />)

        expect(screen.getByText(/easy writing/i)).toBeInTheDocument()
        expect(screen.getByText(/smart search/i)).toBeInTheDocument()
        expect(screen.getByText(/community driven/i)).toBeInTheDocument()
        expect(screen.getByText(/secure & private/i)).toBeInTheDocument()
        expect(screen.getByText(/mobile friendly/i)).toBeInTheDocument()
        expect(screen.getByText(/lightning fast/i)).toBeInTheDocument()
    })

    test('should render statistics section', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(<HomePage />)

        expect(screen.getByText(/join thousands of writers/i)).toBeInTheDocument()
        expect(screen.getByText(/1000\+/)).toBeInTheDocument()
        expect(screen.getByText(/active writers/i)).toBeInTheDocument()
        expect(screen.getByText(/5000\+/)).toBeInTheDocument()
        expect(screen.getByText(/published posts/i)).toBeInTheDocument()
        expect(screen.getByText(/10000\+/)).toBeInTheDocument()
        expect(screen.getByText(/monthly readers/i)).toBeInTheDocument()
    })

    test('should render how it works section', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(<HomePage />)

        expect(screen.getByText(/how it works/i)).toBeInTheDocument()
        expect(screen.getByText(/create your account/i)).toBeInTheDocument()
        expect(screen.getByText(/write your first post/i)).toBeInTheDocument()
        expect(screen.getByText(/share & connect/i)).toBeInTheDocument()
    })

    test('should show final call to action for unauthenticated users', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(<HomePage />)

        expect(screen.getByText(/ready to start your blogging journey/i)).toBeInTheDocument()
    })

    test('should not show final call to action for authenticated users', () => {
        mockUseAuth.mockReturnValue({
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            loading: false,
        })

        render(<HomePage />)

        expect(screen.queryByText(/ready to start your blogging journey/i)).not.toBeInTheDocument()
    })
})