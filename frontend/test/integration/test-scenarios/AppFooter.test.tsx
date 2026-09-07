import {render} from 'vitest-browser-react';
import {describe, expect, it} from 'vitest';
import {renderWithContexts} from '../utils/render';
import {AppFooter} from '../../../src/components/AppFooter/AppFooter';

describe('AppFooter', () => {
    /**
     * The aim of these tests is to measure performance impact the component wrapper pattern has on time of tests execution.
     * As you can see, it's the scale of single milliseconds, something more like a statistical error, than anything you should bother of.
     */
    it('renders raw Notification component', async () => {
        const screen = await render(<AppFooter />);
        await expect.element(screen.getByText('Łukasz Nowak')).toBeInTheDocument();
    });
    it('renders Notification component wrapped in component wrappers', async () => {
        const {screen} = await renderWithContexts(<AppFooter />);
        await expect.element(screen.getByText('Łukasz Nowak')).toBeInTheDocument();
    });
});
