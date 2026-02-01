/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'ripple-wave': 'ripple-wave 2s infinite linear',
                'enter': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'marquee': 'marquee 25s linear infinite',
                'print': 'printScroll 2.5s ease-out forwards',
            },
            keyframes: {
                'ripple-wave': {
                    '0%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.7), 0 0 0 0 rgba(255, 255, 255, 0.5)' },
                    '50%': { boxShadow: '0 0 0 20px rgba(255, 255, 255, 0), 0 0 0 10px rgba(255, 255, 255, 0.3)' },
                    '100%': { boxShadow: '0 0 0 40px rgba(255, 255, 255, 0), 0 0 0 20px rgba(255, 255, 255, 0)' },
                },
                slideUp: {
                    'from': { transform: 'translateY(30px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' },
                },
                marquee: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                printScroll: {
                    '0%': { height: '0', opacity: '0' },
                    '100%': { height: 'auto', minHeight: '240px', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
