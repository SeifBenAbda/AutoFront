import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    rollupOptions: {
      onwarn: (warning, rollupWarn) => {
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        rollupWarn(warning);
      },
    },
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
  plugins: [react()],
})
