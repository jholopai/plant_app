import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		proxy: {
		  "/auth/register": {
			target: "http://0.0.0.0:5000/",
		  },
		  "/auth/login": {
			target: "http://0.0.0.0:5000/",
		  },
		  "/auth/password": {
			target: "http://0.0.0.0:5000/",
		  },
		},
		
	  },
  
  plugins: [react()],
})
