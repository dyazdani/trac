/**
 * @jest-environment jsdom
 */

import React from 'react'
import { userEvent } from '@testing-library/user-event';
import {
    render,
    screen
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../../../client/app/store.js'
import RegisterForm from '../RegisterForm.js';

const mockHandleLinkClick = jest.fn();
const mockHandleSubmit = jest.fn();
const mockHandleOnMouseDown = jest.fn();

describe("RegisterForm component", () => {
    beforeEach(() =>{
        render(
            <Provider store={store}>
                <RegisterForm
                handleLinkClick={mockHandleLinkClick}
            />
            </Provider>
            
        )
    })
    it("should render all elements", () => {
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
        const loginLink = screen.queryByTestId('login-link')

        expect(footer).toBeInTheDocument();
        expect(loginLink).toBeInTheDocument();
    }),
    it("should fire submit handler when submit button is clicked", async () => {
        const user = userEvent.setup();

        const emailInput = screen.getByLabelText('Email Address');
        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');
        const confirmPasswordInput = screen.getByLabelText('Confirm Password');

        await user.type(emailInput, 'bob@bob.com')
        await user.type(usernameInput, 'Bob')
        await user.type(passwordInput, 'bobbybobpassword')
        await user.type(confirmPasswordInput, 'bobbybobpassword')

        const submitButton = screen.getByTestId('submit-button');
        const form = screen.getByTestId('register-form');

        form.onsubmit = mockHandleSubmit;
        await user.click(submitButton)

        expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
    }),
    it("should fire click handler when link in card footer is clicked", async () => {
        const user = userEvent.setup();

        const loginLink = screen.getByTestId('login-link')
        await user.click(loginLink)

        expect(mockHandleLinkClick).toHaveBeenCalledTimes(1);
    }),
    it("should fire onClick and onMouseDown handlers when password visibility buttons are clicked", async () => {
        const user = userEvent.setup();

        const passwordVisibilityButton = screen.getByTestId('password-visibility-button')
        passwordVisibilityButton.onclick = mockHandleOnMouseDown;
        const confirmPasswordVisibilityButton = screen.getByTestId('confirm-password-visibility-button')
        confirmPasswordVisibilityButton.onclick = mockHandleOnMouseDown;


        await user.click(passwordVisibilityButton)
        await user.click(confirmPasswordVisibilityButton)

        expect(mockHandleOnMouseDown).toHaveBeenCalledTimes(2);
    })
})