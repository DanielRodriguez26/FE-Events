interface PaginatorProps {
	pagination: {
		page: number;
		size: number;
		total_items: number;
		total_pages: number;
	};
	onPageChange?: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({ pagination, onPageChange }) => {
	const { page, size, total_items, total_pages } = pagination;
	
	// Calcular el rango de elementos mostrados
	const startItem = (page - 1) * size + 1;
	const endItem = Math.min(page * size, total_items);
	
	// Generar array de páginas a mostrar
	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;
		
		if (total_pages <= maxVisiblePages) {
			// Mostrar todas las páginas si hay 5 o menos
			for (let i = 1; i <= total_pages; i++) {
				pages.push(i);
			}
		} else {
			// Mostrar páginas alrededor de la página actual
			let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
			const endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);
			
			// Ajustar si estamos cerca del final
			if (endPage - startPage < maxVisiblePages - 1) {
				startPage = Math.max(1, endPage - maxVisiblePages + 1);
			}
			
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}
		}
		
		return pages;
	};
	
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= total_pages && newPage !== page) {
			onPageChange?.(newPage);
		}
	};
	
	return (
		<div className='flex justify-between items-center px-4 py-3'>
			<div className='text-sm text-slate-500'>
				Mostrando <b>{startItem}-{endItem}</b> de {total_items}
			</div>
			<div className='flex space-x-1'>
				{/* Botón Anterior */}
				<button 
					onClick={() => handlePageChange(page - 1)}
					disabled={page <= 1}
					className={`px-3 py-1 min-w-9 min-h-9 text-sm font-normal border rounded transition duration-200 ease ${
						page <= 1 
							? 'text-slate-300 bg-slate-100 border-slate-200 cursor-not-allowed' 
							: 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-400'
					}`}
				>
					Anterior
				</button>
				
				{/* Números de página */}
				{getPageNumbers().map(pageNum => (
					<button 
						key={pageNum}
						onClick={() => handlePageChange(pageNum)}
						className={`px-3 py-1 min-w-9 min-h-9 text-sm font-normal border rounded transition duration-200 ease ${
							pageNum === page
								? 'text-white bg-slate-800 border-slate-800 hover:bg-slate-600 hover:border-slate-600'
								: 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-400'
						}`}
					>
						{pageNum}
					</button>
				))}
				
				{/* Botón Siguiente */}
				<button 
					onClick={() => handlePageChange(page + 1)}
					disabled={page >= total_pages}
					className={`px-3 py-1 min-w-9 min-h-9 text-sm font-normal border rounded transition duration-200 ease ${
						page >= total_pages 
							? 'text-slate-300 bg-slate-100 border-slate-200 cursor-not-allowed' 
							: 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-400'
					}`}
				>
					Siguiente
				</button>
			</div>
		</div>
	);
};

export default Paginator;
