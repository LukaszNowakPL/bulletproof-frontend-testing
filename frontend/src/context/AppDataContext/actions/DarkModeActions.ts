export type DarkModeActions = ReturnType<typeof setIsDarkMode>;

export const darkModeTypes = {
    SET_IS_DARK_MODE: 'SET_IS_DARK_MODE',
} as const;

export const setIsDarkMode = (isDarkMode: boolean) => ({
    type: darkModeTypes.SET_IS_DARK_MODE,
    isDarkMode,
});
