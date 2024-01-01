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

        // Inputs and their labels
        const emailInput = screen.queryByLabelText('Email Address');
        expect(emailInput).toBeInTheDocument();
        const usernameInput = screen.queryByLabelText('Username');
        expect(usernameInput).toBeInTheDocument();
        const passwordInput = screen.queryByLabelText('Password');
        expect(passwordInput).toBeInTheDocument();
        const confirmPasswordInput = screen.queryByLabelText('Confirm Password');
        expect(confirmPasswordInput).toBeInTheDocument();

        // Show/Hide password buttons

        // Form button

        // Card footer with link

    })
})