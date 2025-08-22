import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import index from '@infrastructure/router/index';

// Punto de entrada principal de la aplicación React
// Aquí se inicializa la aplicación y se renderiza en el DOM

// Creación del elemento raíz de React
// Busca el elemento con id 'root' en el HTML y crea el contenedor de React
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Renderizado de la aplicación
// Inicia la aplicación con React.StrictMode para detectar problemas
root.render(
	<React.StrictMode>
		{/* Proveedor del router para manejar la navegación */}
		<RouterProvider router={index} />
	</React.StrictMode>
);
