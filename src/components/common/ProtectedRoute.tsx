import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@application/hooks';

// Interfaz para las propiedades del componente ProtectedRoute
interface ProtectedRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
	requireAuth?: boolean;
}

// Componente ProtectedRoute
// Protege rutas que requieren autenticación y redirige a usuarios no autenticados
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = '/login', requireAuth = true }) => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	// Mostrar loading mientras se verifica la autenticación
	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	// Si la ruta requiere autenticación y el usuario no está autenticado
	if (requireAuth && !isAuthenticated) {
		// Redirigir al login guardando la ubicación actual para volver después
		return <Navigate to={redirectTo} state={{ from: location }} replace />;
	}

	// Si la ruta es solo para usuarios no autenticados (como login) y el usuario está autenticado
	if (!requireAuth && isAuthenticated) {
		// Redirigir al dashboard o página principal
		return <Navigate to='/' replace />;
	}

	// Si todo está bien, renderizar el contenido
	return <>{children}</>;
};

export default ProtectedRoute;
