import Navbar from '../../components/navbar';
import React from 'react';

// Interfaz para las propiedades del componente Layout
// Define que el componente debe recibir children (contenido hijo)
interface LayoutProps {
	children: React.ReactNode; // Contenido que se renderizará dentro del layout
}

// Componente Layout - Estructura base de todas las páginas
// Proporciona una estructura consistente con navbar y contenedor principal
const Layout = (props: LayoutProps) => {
	return (
		<div className="min-h-screen bg-gray-100">
			{/* Barra de navegación superior */}
			<Navbar />
			
			{/* Contenido principal */}
			<main className="flex-1">
				{props.children}
			</main>
		</div>
	);
};

export default Layout;
