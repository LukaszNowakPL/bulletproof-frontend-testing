import {describe, expect, vi, test} from 'vitest';
import {renderWithContexts} from '../utils/render';
import {render} from 'vitest-browser-react';
import {userEvent} from 'vitest/browser';
import {it} from '../tests-env/itExtend';
import {CheckboxGroup, Theme} from '@radix-ui/themes';
import React from 'react';

/**
 * This set of tests just prove that the CheckboxGroup component of Radix library does not handle change actions on browser mode vitest tests.
 * That's why the AddAirportView.guard test cases contain a hack of selecting the checkbox using the keyboard.
 */
describe('Radix CheckboxGroup lack of integration', () => {
    describe('CheckboxGroup component', () => {
        /**
         * This test case renders the component using the React-dedicated function exposed by Vitest.
         */
        test('basic CheckboxGroup component', async () => {
            const handleChange = vi.fn();

            // The tested component has to be wrapped with Radix's Theme component
            const screen = await render(
                <Theme>
                    <RadixComponent handleChange={handleChange} options={availableOptions} />
                </Theme>,
            );

            // Assertions confirming the component is on expected state
            const optionToSelect = screen.getByRole('checkbox', {name: availableOptions[0].name});
            await expect.element(optionToSelect).toBeInTheDocument();
            await expect.element(optionToSelect).not.toBeChecked();

            await userEvent.click(optionToSelect);

            // If those assertions have 'not' negation removed, the test would fail
            expect(handleChange).not.toHaveBeenCalled();
            expect(handleChange).not.toHaveBeenCalledWith(['1']);
            await expect.element(optionToSelect).not.toBeChecked();
        });

        /**
         * This test case renders the component using renderWithContext
         */
        it('CheckboxGroup with renderWithContexts', async () => {
            const handleChange = vi.fn();

            // We use raw RadixComponent as renderWithContexts function wraps it with all necessary context providers
            const {screen} = await renderWithContexts(<RadixComponent handleChange={handleChange} options={availableOptions} />);

            const optionToSelect = screen.getByRole('checkbox', {name: availableOptions[0].name});
            await expect.element(optionToSelect).toBeInTheDocument();
            await expect.element(optionToSelect).not.toBeChecked();

            await userEvent.click(optionToSelect);

            // If those assertions have 'not' negation removed, the test would fail
            expect(handleChange).not.toHaveBeenCalled();
            expect(handleChange).not.toHaveBeenCalledWith(['1']);
            await expect.element(optionToSelect).not.toBeChecked();
        });
    });

    /**
     * The CheckboxGroup component currently prints native button component with a 'checkbox' role.
     * This set of tests just confirm that clicking on a checkbox-button component on vitest browser-mode triggers onChange action.
     */
    describe('Native button component with checkbox role', () => {
        /**
         * First we assert such interaction, printing the component with React-dedicated function of vitest.
         */
        it('basic button', async () => {
            const handleChange = vi.fn();

            const screen = await render(
                <Theme>
                    <NativeButtonComponent handleChange={handleChange} role={'checkbox'} />
                </Theme>,
            );

            const button = screen.getByRole('checkbox', {
                name: buttonLabel,
            });

            await userEvent.click(button);

            expect(handleChange).toHaveBeenCalled();
            expect(handleChange).toHaveBeenCalledWith([buttonValue]);
        });

        /**
         * Now we use renderWithContexts wrapper too.
         */
        it('basic button with renderWithContexts', async () => {
            const handleChange = vi.fn();

            const {screen} = await renderWithContexts(<NativeButtonComponent handleChange={handleChange} role={'checkbox'} />);

            const button = screen.getByRole('checkbox', {
                name: buttonLabel,
            });

            await userEvent.click(button);

            expect(handleChange).toHaveBeenCalled();
            expect(handleChange).toHaveBeenCalledWith([buttonValue]);
        });
    });

    /**
     * This set of tests proves that the clicking on a native button component also triggers a callback added to it.
     */
    describe('Native button component with undefined role', () => {
        /**
         * First we assert such interaction printing the component with React-dedicated function of vitest.
         */
        it('basic button', async () => {
            const handleChange = vi.fn();

            const screen = await render(
                <Theme>
                    <NativeButtonComponent handleChange={handleChange} />
                </Theme>,
            );

            const button = screen.getByRole('button', {
                name: buttonLabel,
            });

            await userEvent.click(button);

            expect(handleChange).toHaveBeenCalled();
            expect(handleChange).toHaveBeenCalledWith([buttonValue]);
        });

        /**
         * Now we use renderWithContexts wrapper to prove it does not mismatch anything for some reason.
         */
        it('basic button with renderWithContexts', async () => {
            const handleChange = vi.fn();

            const {screen} = await renderWithContexts(<NativeButtonComponent handleChange={handleChange} />);

            const button = screen.getByRole('button', {
                name: buttonLabel,
            });

            await userEvent.click(button);

            expect(handleChange).toHaveBeenCalled();
            expect(handleChange).toHaveBeenCalledWith([buttonValue]);
        });
    });
});

const availableOptions = [
    {id: '1', name: 'Option 1'},
    {id: '2', name: 'Option 2'},
];

const RadixComponent: React.FC<{handleChange: () => void; options: {id: string; name: string}[]}> = ({handleChange, options}) => (
    <CheckboxGroup.Root value={[options[1].id]} onValueChange={handleChange} typeof={'checkbox'}>
        {options.map(({id, name}) => (
            <CheckboxGroup.Item key={id} value={id}>
                {name}
            </CheckboxGroup.Item>
        ))}
    </CheckboxGroup.Root>
);

const buttonLabel = 'Native button';
const buttonValue = '123';
const NativeButtonComponent: React.FC<{handleChange: (value: string[]) => void; role?: 'checkbox'}> = ({handleChange, role}) => (
    <button onClick={() => handleChange([buttonValue])} role={role}>
        {buttonLabel}
    </button>
);
