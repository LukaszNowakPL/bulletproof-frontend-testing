import {describe, expect, vi, test} from 'vitest';
import {renderWithContexts} from '../utils/render';
import {render} from 'vitest-browser-react';
import {userEvent} from 'vitest/browser';
import {CheckboxGroup, Theme} from '@radix-ui/themes';
import React, {useState} from 'react';

// @ts-expect-error env not available locally
const IS_HEADLESS = Boolean(import.meta.env.CI);

/**
 * This set of tests just prove that the CheckboxGroup component of Radix library does not handle change actions on a headed browser mode of vitest tests.
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
                    <RadixComponentFunctionalWrapper onChange={handleChange} />
                </Theme>,
            );

            // Assertions confirming the component is on expected state
            const optionToSelect = screen.getByRole('checkbox', {name: availableOptions[0].name});
            await expect.element(optionToSelect).toBeInTheDocument();
            await expect.element(optionToSelect).not.toBeChecked();

            await userEvent.click(optionToSelect);

            if (IS_HEADLESS) {
                // Tests fired on a headless mode will perform expected functionality
                expect(handleChange).toHaveBeenCalled();
                expect(handleChange).toHaveBeenCalledWith(['2', '1']);
                await expect.element(optionToSelect).toBeChecked();
            } else {
                // With a browser, however, the component does not trigger the callback (everything has to be negated)
                expect(handleChange).not.toHaveBeenCalled();
                await expect.element(optionToSelect).not.toBeChecked();
            }
        });

        /**
         * This test case renders the component using renderWithContext
         */
        test('CheckboxGroup with renderWithContexts', async () => {
            const handleChange = vi.fn();

            // We use raw RadixComponent as renderWithContexts function wraps it with all necessary context providers
            const {screen} = await renderWithContexts(<RadixComponentFunctionalWrapper onChange={handleChange} />);

            const optionToSelect = screen.getByRole('checkbox', {name: availableOptions[0].name});
            await expect.element(optionToSelect).toBeInTheDocument();
            await expect.element(optionToSelect).not.toBeChecked();

            await userEvent.click(optionToSelect);

            if (IS_HEADLESS) {
                // Tests fired on a headless mode will perform expected functionality
                expect(handleChange).toHaveBeenCalled();
                expect(handleChange).toHaveBeenCalledWith(['2', '1']);
                await expect.element(optionToSelect).toBeChecked();
            } else {
                // With a browser, however, the component does not trigger the callback (everything has to be negated)
                expect(handleChange).not.toHaveBeenCalled();
                await expect.element(optionToSelect).not.toBeChecked();
            }
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
        test('basic button', async () => {
            const handleChange = vi.fn();

            const screen = await render(
                <Theme>
                    <NativeButtonComponent onChange={handleChange} role={'checkbox'} />
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
        test('basic button with renderWithContexts', async () => {
            const handleChange = vi.fn();

            const {screen} = await renderWithContexts(<NativeButtonComponent onChange={handleChange} role={'checkbox'} />);

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
        test('basic button', async () => {
            const handleChange = vi.fn();

            const screen = await render(
                <Theme>
                    <NativeButtonComponent onChange={handleChange} />
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
        test('basic button with renderWithContexts', async () => {
            const handleChange = vi.fn();

            const {screen} = await renderWithContexts(<NativeButtonComponent onChange={handleChange} />);

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

/**
 * The aim of such a wrapper is to make the CheckboxGroup component controllable, so the clicked checkbox will become visually clicked too.
 * It also calls the callback during handling the onclick action, which is necessary for test assertions.
 */
const RadixComponentFunctionalWrapper: React.FC<{onChange: (v: string[]) => void}> = ({onChange}) => {
    const [values, setValues] = useState<string[]>([availableOptions[1].id]);

    const handleChange = (v: string[]) => {
        setValues(v);
        onChange(v);
    };

    return (
        <CheckboxGroup.Root value={values} onValueChange={handleChange} typeof={'checkbox'}>
            {availableOptions.map(({id, name}) => (
                <CheckboxGroup.Item key={id} value={id}>
                    {name}
                </CheckboxGroup.Item>
            ))}
        </CheckboxGroup.Root>
    );
};

const buttonLabel = 'Native button';
const buttonValue = '123';
const NativeButtonComponent: React.FC<{onChange: (value: string[]) => void; role?: 'checkbox'}> = ({onChange, role}) => (
    <button onClick={() => onChange([buttonValue])} role={role}>
        {buttonLabel}
    </button>
);
