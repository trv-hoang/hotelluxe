import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  server: {
    port: 5173,
    //Với proxy này, FE gọi /api/... sẽ tự chuyển tiếp sang BE http://localhost:8080/api/... mà không cần bật CORS trong BE (ở môi trường dev).
    proxy: {
      '/api': {
        target: "http://127.0.0.1:8000", // đổi nếu BE cổng khác
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
