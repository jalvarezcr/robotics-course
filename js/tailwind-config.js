/* =========================================
   Tailwind CSS Configuration
   Custom theme setup for RoboLab
   ========================================= */

tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            colors: {
                dark: {
                    bg: '#0B0F19',       // Casi negro, azulado muy oscuro
                    card: '#111827',     // Gris oscuro para tarjetas
                    hover: '#1F2937',    // Gris para hovers
                    border: '#374151'    // Bordes sutiles
                },
                neon: {
                    blue: '#38bdf8',     // Sky 400
                    purple: '#c084fc',   // Purple 400
                    green: '#34d399',    // Emerald 400
                    red: '#f87171',      // Red 400
                    yellow: '#fbbf24'    // Yellow 400
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        }
    }
};
