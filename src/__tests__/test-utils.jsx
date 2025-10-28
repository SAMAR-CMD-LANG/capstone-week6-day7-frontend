import React from 'react'
import { render } from '@testing-library/react'
import { AuthProvider } from '@/app/context/AuthContext'

// Mock the API module
jest.mock('@/lib/api', () => ({
    api: jest.fn(),
}))

// Custom render function that includes providers
const AllTheProviders = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}

const customRender = (ui, options) =>
    render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Mock user data for testing
export const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z'
}

// Mock posts data for testing
export const mockPosts = [
    {
        id: 1,
        title: 'First Test Post',
        body: 'This is the content of the first test post.',
        user_id: 1,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 2,
        title: 'Second Test Post',
        body: 'This is the content of the second test post.',
        user_id: 1,
        created_at: '2024-01-02T00:00:00Z'
    }
]

// Mock API responses
export const mockApiResponses = {
    login: {
        message: 'Login successful',
        user: mockUser
    },
    register: {
        message: 'User created successfully',
        user: mockUser
    },
    posts: {
        posts: mockPosts,
        totalPosts: 2,
        totalPages: 1,
        currentPage: 1
    },
    createPost: {
        message: 'post created successfully',
        post: mockPosts[0]
    }
}