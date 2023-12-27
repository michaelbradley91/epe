import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [],
	server: {
		host: '0.0.0.0',
		port: 8194,
		https: {
			key: "crt/epe.pineneedletea.com.key",
			cert: "crt/epe.pineneedletea.com.crt"
		},
	},
	clearScreen: false,
});
