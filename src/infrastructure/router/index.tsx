import { createBrowserRouter } from 'react-router-dom';
import Home from '@application/pages/home';
import Event from '@application/pages/event';
import Login from '@application/pages/auth/Login';
import Register from '@application/pages/auth/Register';
import ProtectedRoute from '@components/common/ProtectedRoute';
import EventDetail from '@/application/pages/event/EventDetail';
import RegisterEvent from '@/application/pages/registerEvent/RegisterEvent';
import EventForm from '@/application/pages/event/EventCreate';
import Profile from '@/application/pages/profile';
import EventSessions from '@/application/pages/event/EventSessions';
import SessionManager from '@/application/pages/session/SessionManager';

// Configuración del router principal de la aplicación
// Define todas las rutas disponibles y sus componentes correspondientes

// Creación del router usando React Router DOM
// Configura la navegación del lado del cliente (SPA)
const index = createBrowserRouter([
	{
		path: '/', // Ruta raíz de la aplicación
		element: (
			<ProtectedRoute>
				<Home />
			</ProtectedRoute>
		), // Componente que se renderiza en esta ruta
	},
	{
		path: '/login', // Ruta de login
		element: (
			<ProtectedRoute requireAuth={false} redirectTo='/'>
				<Login />
			</ProtectedRoute>
		),
	},
	{
		path: '/register', // Ruta de registro
		element: (
			<ProtectedRoute requireAuth={false} redirectTo='/'>
				<Register />
			</ProtectedRoute>
		),
	},
	{
		path: '/events',
		element: (
			<ProtectedRoute>
				<Event />
			</ProtectedRoute>
		),
	},
	{
		path: '/event/:id',
		element: (
			<ProtectedRoute>
				<EventDetail />
			</ProtectedRoute>
		),
	},
	{
		path: '/event/create',
		element: (
			<ProtectedRoute>
				<EventForm />
			</ProtectedRoute>
		),
	},
	{
		path: '/event/edit/:id',
		element: (
			<ProtectedRoute>
				<EventForm />
			</ProtectedRoute>
		),
	},
	{
		path: '/events/register/:id',
		element: (
			<ProtectedRoute>
				<RegisterEvent />
			</ProtectedRoute>
		),
	},
	{
		path: '/profile',
		element: (
			<ProtectedRoute>
				<Profile />
			</ProtectedRoute>
		),
	},
	{
		path: '/events/session/:id',
		element: (
			<ProtectedRoute>
				<EventSessions />
			</ProtectedRoute>
		),
	},
	{
		path: '/events/session/:id/manage',
		element: (
			<ProtectedRoute>
				<SessionManager />
			</ProtectedRoute>
		),
	},
]);

export default index;
