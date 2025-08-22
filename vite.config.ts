import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import flowbiteReact from "flowbite-react/plugin/vite";

// Configuración de Vite para el proyecto
// Define la configuración del bundler y herramientas de desarrollo

// https://vite.dev/config/
export default defineConfig({
	// Plugins utilizados en el proyecto
	plugins: [react(), flowbiteReact()], // Plugin para soporte de React
	
	// Configuración de resolución de módulos
	resolve: {
		// Alias para importaciones - permite usar rutas cortas
		alias: {
			'@': path.resolve(__dirname, './src'), // Alias para la carpeta src
			'@components': path.resolve(__dirname, './src/components'), // Alias para componentes
			'@store': path.resolve(__dirname, './src/store'), // Alias para el store
			'@domain': path.resolve(__dirname, './src/domain'), // Alias para la capa de dominio
			'@application': path.resolve(__dirname, './src/application'), // Alias para la capa de aplicación
			'@infrastructure': path.resolve(__dirname, './src/infrastructure'), // Alias para la capa de infraestructura
			'@assets': path.resolve(__dirname, './src/assets') // Alias para assets
		}
	}
})