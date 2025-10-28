import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Simple Login Form Component for Testing
const LoginForm = () => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email) {
            setError('Email is required')
            return
        }

        if (!password) {
            setError('Password is required')
            return
        }

        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            if (email === 'test@example.com' && password === 'password') {
                setError('')
                alert('Login successful!')
            } else {
                setError('Invalid credentials')
            }
            setLoading(false)
        }, 1000)
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>

            {error && <div data-testid="error">{error}</div>}

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    )
}

// Simple Post Card Component
const PostCard = ({ post }) => (
    <div data-testid="post-card">
        <h3>{post.title}</h3>
        <p>{post.body}</p>
        <small>By: {post.author}</small>
    </div>
)

// Posts List Component
const PostsList = ({ posts }) => (
    <div>
        <h2>Blog Posts</h2>
        {posts.length === 0 ? (
            <p data-testid="no-posts">No posts available</p>
        ) : (
            posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))
        )}
    </div>
)

describe('React Testing Library - Frontend Tests', () => {

    describe('🔐 Login Form Tests', () => {
        test('should render login form elements', () => {
            render(<LoginForm />)

            expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
        })

        test('should show validation error for empty email', async () => {
            const user = userEvent.setup()
            render(<LoginForm />)

            const submitButton = screen.getByRole('button', { name: /sign in/i })
            await user.click(submitButton)

            expect(screen.getByTestId('error')).toHaveTextContent('Email is required')
        })

        test('should show validation error for empty password', async () => {
            const user = userEvent.setup()
            render(<LoginForm />)

            const emailInput = screen.getByLabelText(/email/i)
            const submitButton = screen.getByRole('button', { name: /sign in/i })

            await user.type(emailInput, 'test@example.com')
            await user.click(submitButton)

            expect(screen.getByTestId('error')).toHaveTextContent('Password is required')
        })

        test('should handle form input changes', async () => {
            const user = userEvent.setup()
            render(<LoginForm />)

            const emailInput = screen.getByLabelText(/email/i)
            const passwordInput = screen.getByLabelText(/password/i)

            await user.type(emailInput, 'test@example.com')
            await user.type(passwordInput, 'mypassword')

            expect(emailInput).toHaveValue('test@example.com')
            expect(passwordInput).toHaveValue('mypassword')
        })

        test('should show loading state during submission', async () => {
            const user = userEvent.setup()
            render(<LoginForm />)

            const emailInput = screen.getByLabelText(/email/i)
            const passwordInput = screen.getByLabelText(/password/i)
            const submitButton = screen.getByRole('button', { name: /sign in/i })

            await user.type(emailInput, 'test@example.com')
            await user.type(passwordInput, 'password')
            await user.click(submitButton)

            expect(screen.getByText(/signing in/i)).toBeInTheDocument()
            expect(submitButton).toBeDisabled()
        })

        test('should show error for invalid credentials', async () => {
            const user = userEvent.setup()
            render(<LoginForm />)

            const emailInput = screen.getByLabelText(/email/i)
            const passwordInput = screen.getByLabelText(/password/i)
            const submitButton = screen.getByRole('button', { name: /sign in/i })

            await user.type(emailInput, 'wrong@example.com')
            await user.type(passwordInput, 'wrongpassword')
            await user.click(submitButton)

            await waitFor(() => {
                expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials')
            }, { timeout: 2000 })
        })
    })

    describe('📝 Posts List Tests', () => {
        const mockPosts = [
            { id: 1, title: 'First Post', body: 'Content of first post', author: 'John Doe' },
            { id: 2, title: 'Second Post', body: 'Content of second post', author: 'Jane Smith' }
        ]

        test('should render posts list with posts', () => {
            render(<PostsList posts={mockPosts} />)

            expect(screen.getByRole('heading', { name: /blog posts/i })).toBeInTheDocument()
            expect(screen.getAllByTestId('post-card')).toHaveLength(2)
            expect(screen.getByText('First Post')).toBeInTheDocument()
            expect(screen.getByText('Second Post')).toBeInTheDocument()
        })

        test('should show no posts message when empty', () => {
            render(<PostsList posts={[]} />)

            expect(screen.getByTestId('no-posts')).toHaveTextContent('No posts available')
            expect(screen.queryAllByTestId('post-card')).toHaveLength(0)
        })

        test('should render post details correctly', () => {
            render(<PostsList posts={[mockPosts[0]]} />)

            expect(screen.getByText('First Post')).toBeInTheDocument()
            expect(screen.getByText('Content of first post')).toBeInTheDocument()
            expect(screen.getByText('By: John Doe')).toBeInTheDocument()
        })
    })

    describe('🎯 User Interactions', () => {
        test('should handle click events', async () => {
            const handleClick = jest.fn()
            const Button = () => (
                <button onClick={handleClick}>Click Me</button>
            )

            const user = userEvent.setup()
            render(<Button />)

            const button = screen.getByRole('button', { name: /click me/i })
            await user.click(button)

            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        test('should handle keyboard events', async () => {
            const handleKeyDown = jest.fn()
            const Input = () => (
                <input onKeyDown={handleKeyDown} placeholder="Type here" />
            )

            const user = userEvent.setup()
            render(<Input />)

            const input = screen.getByPlaceholderText(/type here/i)
            await user.type(input, 'Hello')

            expect(handleKeyDown).toHaveBeenCalled()
        })

        test('should handle form submission', async () => {
            const handleSubmit = jest.fn()
            const Form = () => (
                <form onSubmit={handleSubmit}>
                    <input name="test" />
                    <button type="submit">Submit</button>
                </form>
            )

            const user = userEvent.setup()
            render(<Form />)

            const submitButton = screen.getByRole('button', { name: /submit/i })
            await user.click(submitButton)

            expect(handleSubmit).toHaveBeenCalled()
        })
    })

    describe('🔍 Accessibility Tests', () => {
        test('should have proper ARIA labels', () => {
            const AccessibleForm = () => (
                <form>
                    <label htmlFor="username">Username</label>
                    <input id="username" aria-describedby="username-help" />
                    <div id="username-help">Enter your username</div>
                    <button type="submit" aria-label="Submit form">Submit</button>
                </form>
            )

            render(<AccessibleForm />)

            expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument()
        })

        test('should have proper heading hierarchy', () => {
            const Page = () => (
                <div>
                    <h1>Main Title</h1>
                    <h2>Section Title</h2>
                    <h3>Subsection Title</h3>
                </div>
            )

            render(<Page />)

            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Main Title')
            expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section Title')
            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Subsection Title')
        })
    })
})