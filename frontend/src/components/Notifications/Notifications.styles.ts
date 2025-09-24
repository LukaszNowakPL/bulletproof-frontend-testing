import {css} from '@emotion/css';

export const asideContainer = css({
    position: 'fixed',
    left: '10px',
    bottom: '10px',
});

export const calloutContainer = (color: 'red' | 'green', isDarkMode: boolean = false) =>
    css({
        backgroundColor: `${getBackgroundColor(color, isDarkMode)} !important`,
        marginTop: '10px',
    });

const getBackgroundColor = (color: 'red' | 'green', isDarkMode: boolean) => {
    if (color === 'green') {
        return isDarkMode ? '#132d22' : '#e6f6eb';
    }
    if (color === 'red') {
        return isDarkMode ? '#3b121a' : '#feebec';
    }
    return '0 none';
};
