import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@application/hooks';

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user, isAuthenticated, logout } = useAuth();

	return (
		<nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Logo y marca */}
					<div className="flex items-center">
						<Link to="/" className="flex items-center space-x-3">
							<img src="/vite.svg" className="h-8 w-8" alt="MisEventos Logo" />
							<span className="text-xl font-bold text-gray-900 dark:text-white">
								MisEventos
							</span>
						</Link>
					</div>

					{/* Navegación desktop */}
					<div className="hidden md:flex items-center space-x-8">
						<Link
							to="/"
							className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
						>
							Inicio
						</Link>
						{isAuthenticated && (
							<>
								{user?.role_id === 13 && (
									<Link
										to="/events"
										className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
									>
										Eventos
									</Link>
								)}
								{user?.role_id === 13 && (
									<Link
										to="/event/create"
										className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
									>
										Crear Evento
									</Link>
								)}
								{user?.role_id === 13  && (
									<Link
										to="/my-evens"
										className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
									>
										Mis Eventos
									</Link>
								)}
								<Link
									to="/profile"
									className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
								>
									Perfil
								</Link>
							</>
						)}
					</div>

					{/* Botones de autenticación desktop */}
					<div className="hidden md:flex items-center space-x-4">
						{isAuthenticated ? (
							<div className="flex items-center space-x-4">
								<span className="text-sm text-gray-700 dark:text-gray-300">
									Hola, {user?.first_name + ' ' + user?.last_name || 'Usuario'}
								</span>
								<button
									onClick={logout}
									className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
								>
									Cerrar Sesión
								</button>
							</div>
						) : (
							<div className="flex items-center space-x-4">
								<Link
									to="/login"
									className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
								>
									Iniciar Sesión
								</Link>
								<Link
									to="/register"
									className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
								>
									Registrarse
								</Link>
							</div>
						)}
					</div>

					{/* Botón de menú móvil */}
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:text-primary-600 dark:focus:text-primary-400"
						>
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								{isMenuOpen ? (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								) : (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Menú móvil */}
				{isMenuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
							<Link
								to="/"
								className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								Inicio
							</Link>

							{isAuthenticated && (
								<>
								{user?.role_id === 11 || user?.role_id === 12 && (
									<Link
										to="/crear-evento"
										className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
										onClick={() => setIsMenuOpen(false)}
									>
										Crear Evento
									</Link>
									)}

									{user?.role_id === 11  && (	
										<Link
											to="/events"
											className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
											onClick={() => setIsMenuOpen(false)}
										>
											Eventos
										</Link>
									)}
									{user?.role_id === 13 && (
										<Link
											to="/my-evens"
											className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
											onClick={() => setIsMenuOpen(false)}
										>
											Mis Eventos
										</Link>
									)}
									<Link
										to="/profile"
										className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
										onClick={() => setIsMenuOpen(false)}
									>
										Perfil
									</Link>
									<div className="border-t border-gray-200 dark:border-gray-700 pt-2">
										<span className="text-gray-700 dark:text-gray-300 block px-3 py-2 text-sm">
											Hola, {user?.first_name + ' ' + user?.last_name || 'Usuario'}
										</span>
										<button
											onClick={() => {
												logout();
												setIsMenuOpen(false);
											}}
											className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
										>
											Cerrar Sesión
										</button>
									</div>
								</>
							)}
							{!isAuthenticated && (
								<div className="border-t border-gray-200 dark:border-gray-700 pt-2">
									<Link
										to="/login"
										className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
										onClick={() => setIsMenuOpen(false)}
									>
										Iniciar Sesión
									</Link>
									<Link
										to="/register"
										className="bg-primary-600 hover:bg-primary-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
										onClick={() => setIsMenuOpen(false)}
									>
										Registrarse
									</Link>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
