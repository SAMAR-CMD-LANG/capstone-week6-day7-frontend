import React from 'react'
import { render, screen } from '../test-utils'
import HomePage from '@/app/page'
import { useAuth } from '@/app/context/AuthContext'

// Mock the auth context
jest.mock('@/app/context/AuthContext')

describe('Homepage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('should render homepage for unauthenticated users', () => {
        useAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(<HomePage />)

        expect(screen.getByText(/welcome to samar blogs/i)).toBeInTheDocument()
        expect(screen.getByText(/join our community/i)).toBeInTheDocument()
        expect(screen.getByText(/sign in/i)).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /join our community/i })).toHaveAttribute('href', '/register')
        expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
    })

    test('should render homepage for authenticated users', () => {
        useAuth.mockReturnValue({
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            loading: false,
        })

        render(<HomePage />)

        expect(screen.getByText(/welcome to samar blogs/i)).toBeInTheDocument()
        expect(screen.getByText(/start writing/i)).toBeInTheDocument()
        expect(screen.getByText(/browse posts/i)).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /start writing/i })).toHaveAttribute('href', '/create-post')
        expect(screen.getByRole('link', { name: /browse posts/i })).toHaveAttribute('href', '/posts')
    })

    test('should render all feature cards', () => {
        useAuth.mockReturnValue({
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
        useAuth.mockReturnValue({
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
        useAuth.mockReturnValue({
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
        useAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(<HomePage />)

        expect(screen.getByText(/ready to start your blogging journey/i)).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /get started now - it's free!/i })).toHaveAttribute('href', '/register')
    })

    test('should not show final call to action for authenticated users', () => {
        useAuth.mockReturnValue({
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            loading: false,
        })

        render(<HomePage />)

        expect(screen.queryByText(/ready to start your blogging journey/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/get started now - it's free!/i)).not.toBeInTheDocument()
    })

    test('should have proper feature descriptions', () => {
        useAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(<HomePage />)

        expect(screen.getByText(/create beautiful blog posts with our intuitive editor/i)).toBeInTheDocument()
        expect(screen.getByText(/find exactly what you're looking for/i)).toBeInTheDocument()
        expect(screen.getByText(/connect with like-minded writers/i)).toBeInTheDocument()
        expect(screen.getByText(/your data is protected with industry-standard security/i)).toBeInTheDocument()
        expect(screen.getByText(/access your blog anywhere, anytime/i)).toBeInTheDocument()
        expect(screen.getByText(/built with modern technology for optimal performance/i)).toBeInTheDocument()
    })

    test('should have proper step descriptions in how it works', () => {
        useAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(<HomePage />)

        expect(screen.getByText(/sign up in seconds with just your email and password/i)).toBeInTheDocument()
        expect(screen.getByText(/use our clean, distraction-free editor/i)).toBeInTheDocument()
        expect(screen.getByText(/publish your post and watch it reach readers worldwide/i)).toBeInTheDocument()
    })

    test('should render with proper semantic structure', () => {
        useAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(<HomePage />)

        // Check for main heading
        expect(screen.getByRole('heading', { level: 1, name: /welcome to samar blogs/i })).toBeInTheDocument()

        // Check for section headings
        expect(screen.getByRole('heading', { level: 2, name: /join thousands of writers/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 2, name: /how it works/i })).toBeInTheDocument()
    })

    test('should have accessible feature cards', () => {
        useAuth.mockReturnValue({
            user: null,
            loading: false,
        })

        render(<HomePage />)

        const featureCards = screen.getAllByRole('heading', { level: 3 })
        expect(featureCards).toHaveLength(9) // 6 features + 3 how-it-works steps
    })
})