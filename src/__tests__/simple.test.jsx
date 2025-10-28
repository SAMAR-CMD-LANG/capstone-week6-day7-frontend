import React from 'react'
import { render, screen } from '@testing-library/react'

// Simple component for testing
const TestComponent = () => <div>Hello Test</div>

describe('Simple Test', () => {
    test('should render test component', () => {
        render(<TestComponent />)
        expect(screen.getByText('Hello Test')).toBeInTheDocument()
    })

    test('should pass basic assertion', () => {
        expect(1 + 1).toBe(2)
    })
})