// DOM Content Loaded - Ejecutar cuando la página esté completamente cargada
document.addEventListener('DOMContentLoaded', function() {
    
    // Simple search functionality
    const searchButton = document.querySelector('.gradient-bg button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchInput = document.querySelector('input[placeholder*="servicio"]');
            const searchTerm = searchInput.value;
            
            if (searchTerm.trim()) {
                alert(`Buscando: "${searchTerm}". En una versión completa, esto mostraría resultados filtrados.`);
            } else {
                alert('Por favor, ingresa un término de búsqueda.');
            }
        });
    }

    // Enter key functionality for search
    const searchInput = document.querySelector('input[placeholder*="servicio"]');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // Contact buttons functionality
    const contactButtons = document.querySelectorAll('button');
    contactButtons.forEach(button => {
        if (button.textContent.includes('Contactar')) {
            button.addEventListener('click', function() {
                const card = this.closest('.bg-white');
                const professionalName = card.querySelector('h4').textContent;
                alert(`Iniciando conversación con ${professionalName}. En una versión completa, esto abriría un chat o formulario de contacto.`);
            });
        }
    });

    // Create profile button
    const createProfileButton = document.querySelector('button[class*="bg-white text-indigo-600"]');
    if (createProfileButton && createProfileButton.textContent.includes('Crear mi Perfil')) {
        createProfileButton.addEventListener('click', function() {
            alert('Redirigiendo al formulario de registro profesional. En una versión completa, esto abriría un formulario detallado para crear el perfil.');
        });
    }

    // Category hover effects and click functionality
    const categoryCards = document.querySelectorAll('.text-center.p-6');
    categoryCards.forEach(category => {
        // Solo aplicar a las categorías (que tienen emojis)
        if (category.querySelector('.text-3xl.mb-3')) {
            category.addEventListener('click', function() {
                const categoryName = this.querySelector('h4').textContent;
                alert(`Explorando la categoría: ${categoryName}. En una versión completa, esto mostraría todos los profesionales de esta categoría.`);
            });
        }
    });

    // "Ver todos" button functionality
    const viewAllButton = document.querySelector('button[class*="text-indigo-600"]');
    if (viewAllButton && viewAllButton.textContent.includes('Ver todos')) {
        viewAllButton.addEventListener('click', function() {
            alert('Mostrando todos los profesionales. En una versión completa, esto cargaría más profesionales con paginación.');
        });
    }

    // Navigation links functionality (placeholder)
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            alert(`Navegando a: ${linkText}. En una versión completa, esto llevaría a la página correspondiente.`);
        });
    });

    // Header buttons functionality
    const headerButtons = document.querySelectorAll('header button');
    headerButtons.forEach(button => {
        if (button.textContent.includes('Iniciar Sesión')) {
            button.addEventListener('click', function() {
                alert('Abriendo modal de inicio de sesión. En una versión completa, esto mostraría un formulario de login.');
            });
        } else if (button.textContent.includes('Ofrecer Servicios')) {
            button.addEventListener('click', function() {
                alert('Redirigiendo al registro de profesionales. En una versión completa, esto llevaría al formulario de registro.');
            });
        }
    });

    // Footer links functionality
    const footerLinks = document.querySelectorAll('footer a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            alert(`Navegando a: ${linkText}. En una versión completa, esto llevaría a la página correspondiente.`);
        });
    });

    // Smooth scroll for internal links (if any are added later)
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Add loading state to buttons
    function addLoadingState(button) {
        const originalText = button.textContent;
        button.textContent = 'Cargando...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);
    }

    // Add some visual feedback for interactions
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }
    });
});