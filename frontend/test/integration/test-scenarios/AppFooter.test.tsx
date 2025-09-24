import {render, screen} from '@testing-library/react';
import {describe} from 'vitest';
import {renderWithContexts} from '../utils/render';
import {AppFooter} from '../../../src/components/AppFooter/AppFooter';

describe('AppFooter', () => {
    /**
     * The aim of these tests is to measure performance impact the component wrapper pattern has on time of tests execution.
     * As you can see, it's the scale of single milliseconds, something more like a statistical error, than anything you should bother of.
     */
    it('renders raw Notification component', async () => {
        render(<AppFooter />);
        expect(screen.getByText('Łukasz Nowak')).toBeInTheDocument();
    });
    it('renders Notification component wrapped in component wrappers', async () => {
        renderWithContexts(<AppFooter />);
        expect(screen.getByText('Łukasz Nowak')).toBeInTheDocument();
    });
});
