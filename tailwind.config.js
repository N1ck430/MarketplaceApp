/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {
            fontSize: {
                '2xs': ['0.625rem', '0.75rem'],
                '3/2xl': ['1.375rem', '1.75rem'],
            },
            maxWidth: {
                50: '50%',
            },
        },
        colors: {
            primary: 'var(--ion-color-primary)',
            primary300: 'var(--ion-color-primary-300)',
            secondary: 'var(--ion-color-secondary)',
            secondary100: 'var(--ion-color-secondary-100)',
            light: ' var(--ion-color-light)',
            white: '#FFF',
        },
    },
    plugins: [],
};
