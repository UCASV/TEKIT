       const professionals = [
            {
                id: 1,
                name: "Juan Martínez",
                role: "Fontanero Profesional",
                rating: 5,
                reviews: 28,
                price: 25,
                category: "fontaneria",
                location: "San Salvador",
                avatar: "JM",
                avatarClass: "avatar-blue",
                description: "Especialista en reparaciones de tuberías, instalación de grifos y sistemas de agua. 15 años de experiencia.",
                available: true,
                emergency: true,
                dateAdded: new Date('2024-01-15')
            },
            {
                id: 2,
                name: "Ana Rodríguez",
                role: "Fontanera Certificada",
                rating: 5,
                reviews: 45,
                price: 30,
                category: "fontaneria",
                location: "Santa Ana",
                avatar: "AR",
                avatarClass: "avatar-green",
                description: "Servicios de fontanería residencial y comercial. Especializada en emergencias 24/7.",
                available: true,
                emergency: true,
                weekend: true,
                dateAdded: new Date('2024-02-10')
            },
            
        ];

        const categories = [
            { id: 'fontaneria', name: 'Fontanería', count: 23, active: true },
            { id: 'limpieza', name: 'Limpieza', count: 15, active: false },
            { id: 'construccion', name: 'Construcción', count: 9, active: false },
            { id: 'electricidad', name: 'Electricidad', count: 12, active: false }
        ];

        const locations = [
            'Toda El Salvador',
            'San Salvador',
            'Santa Ana', 
            'San Miguel',
            'Sonsonate',
            'La Libertad'
        ];

        
        let currentFilters = {
            categories: ['fontaneria'],
            priceMin: 10,
            priceMax: 100,
            rating: 4,
            location: 'Toda El Salvador',
            availability: []
        };

        let currentSort = 'relevant';
        let currentPage = 1;
        const resultsPerPage = 9;

        function renderCategories() {
            const container = document.querySelector('.category-options');
            container.innerHTML = categories.map(cat => `
                <div class="checkbox-option">
                    <input type="checkbox" id="${cat.id}" ${cat.active ? 'checked' : ''}>
                    <label for="${cat.id}">${cat.name}</label>
                    <span class="option-count">(${cat.count})</span>
                </div>
            `).join('');

 
            categories.forEach(cat => {
                document.getElementById(cat.id).addEventListener('change', (e) => {
                    handleCategoryChange(cat.id, e.target.checked);
                });
            });
        }

        function renderLocations() {
            const select = document.querySelector('.location-select');
            select.innerHTML = locations.map(loc => `
                <option value="${loc}" ${loc === currentFilters.location ? 'selected' : ''}>${loc}</option>
            `).join('');
        }

        function renderResults(filteredProfessionals) {
            const grid = document.querySelector('.results-grid');
            const startIndex = (currentPage - 1) * resultsPerPage;
            const endIndex = startIndex + resultsPerPage;
            const pageResults = filteredProfessionals.slice(startIndex, endIndex);

            grid.innerHTML = pageResults.map(prof => `
                <div class="professional-card" data-id="${prof.id}">
                    <div class="professional-info">
                        <div class="avatar ${prof.avatarClass}">${prof.avatar}</div>
                        <div class="professional-details">
                            <h4 class="professional-name">${prof.name}</h4>
                            <p class="professional-role">${prof.role}</p>
                            <div class="rating">
                                <span class="stars">${'★'.repeat(prof.rating)}${'☆'.repeat(5-prof.rating)}</span>
                                <span class="reviews">(${prof.reviews} reseñas)</span>
                            </div>
                        </div>
                    </div>
                    <p class="professional-description">${prof.description}</p>
                    <div class="professional-footer">
                        <span class="price">Desde €${prof.price}/hora</span>
                        <button class="contact-btn" onclick="contactProfessional(${prof.id})">Contactar</button>
                    </div>
                </div>
            `).join('');

            updateResultsCount(filteredProfessionals.length);
        }

        function updateResultsCount(total) {
            const counter = document.querySelector('.results-count');
            const start = ((currentPage - 1) * resultsPerPage) + 1;
            const end = Math.min(currentPage * resultsPerPage, total);
            
            counter.innerHTML = `
                Mostrando <strong>${start}-${end}</strong> de <strong>${total}</strong> resultados para <strong>"fontanería"</strong>
            `;
        }

        function handleCategoryChange(categoryId, isChecked) {
            if (isChecked) {
                if (!currentFilters.categories.includes(categoryId)) {
                    currentFilters.categories.push(categoryId);
                }
            } else {
                currentFilters.categories = currentFilters.categories.filter(id => id !== categoryId);
            }
            applyFilters();
        }

        function applyFilters() {
            let filtered = professionals;

            if (currentFilters.categories.length > 0) {
                filtered = filtered.filter(prof => 
                    currentFilters.categories.includes(prof.category)
                );
            }

            filtered = filtered.filter(prof => 
                prof.price >= currentFilters.priceMin && prof.price <= currentFilters.priceMax
            );

            filtered = filtered.filter(prof => prof.rating >= currentFilters.rating);

            if (currentFilters.location !== 'Toda El Salvador') {
                filtered = filtered.filter(prof => prof.location === currentFilters.location);
            }

            if (currentFilters.availability.includes('available-now')) {
                filtered = filtered.filter(prof => prof.available);
            }
            if (currentFilters.availability.includes('emergency')) {
                filtered = filtered.filter(prof => prof.emergency);
            }
            if (currentFilters.availability.includes('weekend')) {
                filtered = filtered.filter(prof => prof.weekend);
            }

            filtered = sortResults(filtered);

            currentPage = 1;

            renderResults(filtered);
        }

        function sortResults(professionals) {
            switch (currentSort) {
                case 'price-low':
                    return [...professionals].sort((a, b) => a.price - b.price);
                case 'price-high':
                    return [...professionals].sort((a, b) => b.price - a.price);
                case 'rating':
                    return [...professionals].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
                case 'newest':
                    return [...professionals].sort((a, b) => b.dateAdded - a.dateAdded);
                case 'oldest':
                    return [...professionals].sort((a, b) => a.dateAdded - b.dateAdded);
                default: // relevant
                    return [...professionals].sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            renderCategories();
            renderLocations();
            applyFilters();

            document.querySelector('.price-input[placeholder="Min €"]').addEventListener('input', (e) => {
                currentFilters.priceMin = parseInt(e.target.value) || 0;
                debounce(applyFilters, 500)();
            });

            document.querySelector('.price-input[placeholder="Max €"]').addEventListener('input', (e) => {
                currentFilters.priceMax = parseInt(e.target.value) || 1000;
                debounce(applyFilters, 500)();
            });

            document.querySelectorAll('input[name="rating"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    currentFilters.rating = parseInt(e.target.value);
                    applyFilters();
                });
            });

            document.querySelector('.location-select').addEventListener('change', (e) => {
                currentFilters.location = e.target.value;
                applyFilters();
            });

            document.querySelectorAll('.filter-group:last-child input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        currentFilters.availability.push(e.target.id);
                    } else {
                        currentFilters.availability = currentFilters.availability.filter(id => id !== e.target.id);
                    }
                    applyFilters();
                });
            });

            document.querySelector('.sort-select').addEventListener('change', (e) => {
                const sortMap = {
                    'Más relevantes': 'relevant',
                    'Precio: menor a mayor': 'price-low',
                    'Precio: mayor a menor': 'price-high',
                    'Mejor calificados': 'rating',
                    'Más recientes': 'newest',
                    'Más antiguos': 'oldest'
                };
                currentSort = sortMap[e.target.value];
                applyFilters();
            });

            document.querySelector('.clear-filters-btn').addEventListener('click', () => {
                currentFilters = {
                    categories: [],
                    priceMin: 0,
                    priceMax: 1000,
                    rating: 1,
                    location: 'Toda El Salvador',
                    availability: []
                };

                document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
                document.querySelector('.price-input[placeholder="Min €"]').value = '';
                document.querySelector('.price-input[placeholder="Max €"]').value = '';
                document.querySelector('.location-select').value = 'Toda El Salvador';

                applyFilters();
            });

            document.querySelector('.main-search-input').addEventListener('input', debounce((e) => {
                const searchTerm = e.target.value.toLowerCase();
                console.log('Searching for:', searchTerm);
            }, 300));

            document.querySelector('.load-more-btn').addEventListener('click', () => {
                currentPage++;
                applyFilters();
            });
        });

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        function contactProfessional(profId) {
            console.log('Contacting professional with ID:', profId);
            alert('¡Funcionalidad de contacto! (En desarrollo)');
        }

        function addNewFilter(filterType, options) {
           
            console.log('Adding new filter:', filterType, options);
        }

        
        function updateCategories(newCategories) {
            categories.length = 0;
            categories.push(...newCategories);
            renderCategories();
        }

        async function loadMoreProfessionals() {
            
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        
                    ]);
                }, 1000);
            });
        }
