import React from 'react'
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import PostsPage from '@/app/posts/page'
import { api } from '@/lib/api'
import { useAuth } from '@/app/context/AuthContext'

// Mock the API and auth
jest.mock('@/lib/api')
jest.mock('@/app/context/AuthContext')

const mockApi = api
const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com'
}

const mockPosts = [
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
        user_id: 2,
        created_at: '2024-01-02T00:00:00Z'
    }
]

describe('Posts Page', () => {
    beforeEach(() => {
        jest.clearAllMocks()

        useAuth.mockReturnValue({
            user: mockUser,
            loading: false,
        })
    })

    test('should render posts page with loading state', () => {
        mockApi.mockImplementation(() => new Promise(() => { })) // Never resolves

        render(<PostsPage />)

        expect(screen.getByText(/discover amazing stories/i)).toBeInTheDocument()
        expect(screen.getByText(/loading amazing posts/i)).toBeInTheDocument()
    })

    test('should render posts when API call succeeds', async () => {
        mockApi.mockResolvedValueOnce({
            posts: mockPosts,
            totalPosts: 2,
            totalPages: 1,
            currentPage: 1
        })

        render(<PostsPage />)

        await waitFor(() => {
            expect(screen.getByText('First Test Post')).toBeInTheDocument()
        })

        expect(screen.getByText('Second Test Post')).toBeInTheDocument()
        expect(screen.getByText(/this is the content of the first test post/i)).toBeInTheDocument()
    })

    test('should handle API errors gracefully', async () => {
        mockApi.mockRejectedValueOnce(new Error('Failed to fetch posts'))

        render(<PostsPage />)

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch posts/i)).toBeInTheDocument()
        })
    })

    test('should show empty state when no posts exist', async () => {
        mockApi.mockResolvedValueOnce({
            posts: [],
            totalPosts: 0,
            totalPages: 0,
            currentPage: 1
        })

        render(<PostsPage />)

        await waitFor(() => {
            expect(screen.getByText(/no posts yet/i)).toBeInTheDocument()
        })

        expect(screen.getByText(/be the first to share your story/i)).toBeInTheDocument()
    })

    test('should handle search functionality', async () => {
        const user = userEvent.setup()

        // Initial posts load
        mockApi.mockResolvedValueOnce({
            posts: mockPosts,
            totalPosts: 2,
            totalPages: 1,
            currentPage: 1
        })

        // Search results
        mockApi.mockResolvedValueOnce({
            posts: [mockPosts[0]],
            totalPosts: 1,
            totalPages: 1,
            currentPage: 1
        })

        render(<PostsPage />)

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('First Test Post')).toBeInTheDocument()
        })

        const searchInput = screen.getByPlaceholderText(/search posts by title/i)
        const searchButton = screen.getByRole('button', { name: /search/i })

        await user.type(searchInput, 'First')
        await user.click(searchButton)

        await waitFor(() => {
            expect(mockApi).toHaveBeenCalledWith('/posts?page=1&limit=5&search=First')
        })
    })

    test('should show no results message for empty search', async () => {
        const user = userEvent.setup()

        // Initial posts load
        mockApi.mockResolvedValueOnce({
            posts: mockPosts,
            totalPosts: 2,
            totalPages: 1,
            currentPage: 1
        })

        // Empty search results
        mockApi.mockResolvedValueOnce({
            posts: [],
            totalPosts: 0,
            totalPages: 0,
            currentPage: 1
        })

        render(<PostsPage />)

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('First Test Post')).toBeInTheDocument()
        })

        const searchInput = screen.getByPlaceholderText(/search posts by title/i)
        const searchButton = screen.getByRole('button', { name: /search/i })

        await user.type(searchInput, 'nonexistent')
        await user.click(searchButton)

        await waitFor(() => {
            expect(screen.getByText(/no posts match "nonexistent"/i)).toBeInTheDocument()
        })

        expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument()
    })

    test('should handle pagination', async () => {
        const user = userEvent.setup()

        // Initial posts load (page 1)
        mockApi.mockResolvedValueOnce({
            posts: mockPosts,
            totalPosts: 10,
            totalPages: 2,
            currentPage: 1
        })

        // Page 2 load
        mockApi.mockResolvedValueOnce({
            posts: [mockPosts[1]],
            totalPosts: 10,
            totalPages: 2,
            currentPage: 2
        })

        render(<PostsPage />)

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
        })

        const nextButton = screen.getByRole('button', { name: /next/i })
        expect(nextButton).not.toBeDisabled()

        await user.click(nextButton)

        await waitFor(() => {
            expect(mockApi).toHaveBeenCalledWith('/posts?page=2&limit=5&search=')
        })
    })

    test('should disable pagination buttons appropriately', async () => {
        mockApi.mockResolvedValueOnce({
            posts: mockPosts,
            totalPosts: 2,
            totalPages: 1,
            currentPage: 1
        })

        render(<PostsPage />)

        await waitFor(() => {
            expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()
        })

        const prevButton = screen.getByRole('button', { name: /previous/i })
        const nextButton = screen.getByRole('button', { name: /next/i })

        expect(prevButton).toBeDisabled()
        expect(nextButton).toBeDisabled()
    })

    test('should truncate long post content', async () => {
        const longPost = {
            id: 3,
            title: 'Long Post',
            body: 'A'.repeat(250), // 250 characters
            user_id: 1,
            created_at: '2024-01-03T00:00:00Z'
        }

        mockApi.mockResolvedValueOnce({
            posts: [longPost],
            totalPosts: 1,
            totalPages: 1,
            currentPage: 1
        })

        render(<PostsPage />)

        await waitFor(() => {
            expect(screen.getByText('Long Post')).toBeInTheDocument()
        })

        // Should show truncated content with ellipsis
        const truncatedContent = screen.getByText(/A{200}\.\.\./)
        expect(truncatedContent).toBeInTheDocument()
    })

    test('should clear search when clear button is clicked', async () => {
        const user = userEvent.setup()

        // Initial posts load
        mockApi.mockResolvedValueOnce({
            posts: mockPosts,
            totalPosts: 2,
            totalPages: 1,
            currentPage: 1
        })

        // Empty search results
        mockApi.mockResolvedValueOnce({
            posts: [],
            totalPosts: 0,
            totalPages: 0,
            currentPage: 1
        })

        // Posts after clearing search
        mockApi.mockResolvedValueOnce({
            posts: mockPosts,
            totalPosts: 2,
            totalPages: 1,
            currentPage: 1
        })

        render(<PostsPage />)

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('First Test Post')).toBeInTheDocument()
        })

        const searchInput = screen.getByPlaceholderText(/search posts by title/i)
        const searchButton = screen.getByRole('button', { name: /search/i })

        // Perform search
        await user.type(searchInput, 'nonexistent')
        await user.click(searchButton)

        await waitFor(() => {
            expect(screen.getByText(/no posts match "nonexistent"/i)).toBeInTheDocument()
        })

        // Clear search
        const clearButton = screen.getByRole('button', { name: /clear search/i })
        await user.click(clearButton)

        await waitFor(() => {
            expect(searchInput).toHaveValue('')
        })
    })

    test('should show author information for posts', async () => {
        mockApi.mockResolvedValueOnce({
            posts: mockPosts,
            totalPosts: 2,
            totalPages: 1,
            currentPage: 1
        })

        render(<PostsPage />)

        await waitFor(() => {
            expect(screen.getByText('First Test Post')).toBeInTheDocument()
        })

        expect(screen.getByText(/author: 1/i)).toBeInTheDocument()
        expect(screen.getByText(/author: 2/i)).toBeInTheDocument()
    })
})