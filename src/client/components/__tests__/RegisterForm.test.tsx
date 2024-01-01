/**
 * @jest-environment jsdom
 */

import React from 'react';
import {
    render,
    screen
} from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '../RegisterForm.js';

const mockHandleLinkClick = jest.fn()

describe("RegisterForm component", () => {
    it("should render all elements", () => {
        render(
            <RegisterForm
                handleLinkClick={mockHandleLinkClick}
            />
        )

        // Card header with app name and tag line
        const header = screen.queryByText('trac');
        const headerSubtitle = screen.queryByText('Stay on trac by signing up.')

        expect(header).toBeInTheDocument();
        expect(headerSubtitle).toBeInTheDocument();

        // Inputs and their labels
        const emailInput = screen.queryByLabelText('Email Address');
        const usernameInput = screen.queryByLabelText('Username');
        const passwordInput = screen.queryByLabelText('Password');
        const confirmPasswordInput = screen.queryByLabelText('Confirm Password');

        expect(emailInput).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();

        // Show/Hide password buttons and Form button
        const buttons = screen.queryAllByRole('button')

        expect(buttons.length).toBe(3);

        // Card footer with link

        const footer = screen.queryByText(/Already/);
        const loginLink = screen.queryByTestId('loginLink')

        expect(footer).toBeInTheDocument();
        expect(loginLink).toBeInTheDocument();
    })
})