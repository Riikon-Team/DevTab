import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Tắt sourcemap production để build nhanh hơn
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'date-vendor': ['date-fns'],
          'axios-vendor': ['axios'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Vite đã tự động cache node_modules và build cache
    // Nếu muốn xóa cache: npx vite --force
  },
})
