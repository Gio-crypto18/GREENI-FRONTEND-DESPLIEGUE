document.addEventListener('DOMContentLoaded', () => {
    const categoryInfo = {
        'interior': { title: 'Plantas de Interior', subtitle: 'Guías para que tus plantas prosperen lejos del sol directo.' },
        'acuaticas': { title: 'Plantas Acuáticas', subtitle: 'Descubre cómo mantener un ecosistema acuático saludable.' },
        'enfermedades': { title: 'Enfermedades y Plagas', subtitle: 'Aprende a identificar y tratar los problemas más comunes.' },
        'favoritos': { title: 'Mis Favoritos', subtitle: 'Tus guías guardadas para un acceso rápido.' }
    };

    const allGuides = [
        {
            id: 1,
            title: 'Cuidado de la Monstera Deliciosa',
            description: 'Aprende a cuidar tu Monstera para que sus hojas crezcan grandes y sanas.',
            image: 'https://www.farbio.com/cdn/shop/articles/monstera-pflanze-retten-tipps-zur-pflege-456715.png?v=1751286866',
            category: 'interior',
            favorite: true,
            fullContent: 'La Monstera Deliciosa, también conocida como Costilla de Adán, prefiere la luz indirecta brillante. Un riego excesivo puede causar pudrición de raíces, por lo que es mejor dejar que la capa superior del sustrato se seque entre riegos. Utiliza un fertilizante equilibrado cada mes durante la primavera y el verano.'
        },
        {
            id: 3,
            title: 'Control del Hongo Oídio',
            description: 'Identifica y elimina el oídio, un hongo común que afecta a muchas plantas.',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY7wuLA9rYyybuDx8vfU1cKtpdDyvrpyxJdA&s',
            category: 'enfermedades',
            favorite: false,
            fullContent: 'El oídio aparece como un polvo blanco en las hojas. Para tratarlo, mejora la circulación de aire alrededor de la planta y evita mojar el follaje. Puedes aplicar un fungicida a base de azufre o neem, o una solución casera de bicarbonato de sodio (una cucharadita por litro de agua con unas gotas de jabón).'
        },
        {
            id: 4,
            title: 'Elodea: La Planta Acuática Perfecta',
            description: 'Descubre cómo mantener la Elodea, una planta oxigenadora ideal para acuarios.',
            image: 'https://i0.wp.com/www.fanmascotas.com/wp-content/uploads/2019/09/WhatsApp-Image-2019-09-26-at-19.07.42.jpeg',
            category: 'acuaticas',
            favorite: false,
            fullContent: 'La Elodea es una planta acuática de crecimiento rápido que ayuda a mantener el agua del acuario limpia y oxigenada. No requiere sustrato, ya que puede flotar libremente o ser anclada. Prefiere aguas con temperaturas entre 10-25°C y una iluminación moderada a alta.'
        },
        {
            id: 5,
            title: 'Ficus Lyrata: Guía Completa',
            description: 'Todo lo que necesitas saber sobre el popular "árbol lira" para que prospere en tu hogar.',
            image: 'https://jardinpostal.com/wp-content/uploads/2024/07/Jardin-Postal-comprar-Ficus-Lyrata-cuadrada-1024x1024.png',
            category: 'interior',
            favorite: false,
            fullContent: 'El Ficus Lyrata necesita luz indirecta muy brillante y no le gustan los cambios bruscos de ubicación o temperatura. Riégalo cuando la parte superior del sustrato esté seca y asegúrate de que la maceta tenga un buen drenaje. Limpia sus grandes hojas con un paño húmedo para ayudar a la fotosíntesis.'
        },
        {
            id: 6,
            title: 'Tratamiento contra la Cochinilla',
            description: 'Aprende a identificar y eliminar esta plaga tan común en plantas de interior.',
            image: 'https://resizer.glanacion.com/resizer/v2/la-cochinilla-algodonosa-es-una-plaga-que-afecta-7G3B56I57NHMPICFAWIEH4BENA.jpg?auth=2ad3158f83169814d66ad32997a87a12131a11306fb373d1a4b5e38551520191&width=1200&quality=70&smart=false&height=800',
            category: 'enfermedades',
            favorite: true,
            fullContent: 'La cochinilla algodonosa se ve como pequeñas motas de algodón en los tallos y hojas. Para eliminarlas, puedes usar un hisopo con alcohol isopropílico para aplicarlo directamente sobre ellas. Para infestaciones más grandes, el aceite de neem es un tratamiento efectivo y natural.'
        },
        {
            id: 7,
            title: 'Mantenimiento de Anubias',
            description: 'Cuidados esenciales para las Anubias, plantas acuáticas resistentes y de bajo mantenimiento.',
            image: 'https://cdn.shopify.com/s/files/1/0230/7266/9773/files/Anubias_leaf_algae_1800-min.jpg?v=1623907348',
            category: 'acuaticas',
            favorite: false,
            fullContent: 'Las Anubias son plantas acuáticas muy resistentes, ideales para principiantes. Lo más importante es no enterrar su rizoma (el tallo horizontal grueso) en el sustrato, ya que se pudrirá. En su lugar, átala a una roca o tronco. Tolera condiciones de baja luz y no requiere fertilización intensiva.'
        },
        {
            id: 8,
            title: 'Guía Completa de Pothos (Epipremnum)',
            description: 'Cómo cuidar tu Pothos para que trepe y crezca con vigor.',
            image: 'https://allaboutplanties.com/cdn/shop/articles/8fea0a31af9f6992501385a62e8e1675.jpg?v=1729558541&width=1100',
            category: 'interior',
            favorite: false,
            fullContent: 'El Pothos tolera desde luz baja hasta media. Riégalo moderadamente, dejando que el sustrato seque parcialmente. Es ideal para colgar en cestas o dejar trepando. Si ves hojas amarillas, ajusta el riego y aporta un fertilizante balanceado cada 2 meses.'
        },
        {
            id: 9,
            title: 'Sansevieria: Lengua de Suegra',
            description: 'Resistente, decorativa y muy fácil de cuidar.',
            image: 'https://media.revistaad.es/photos/66de987f8441e1877f96f1dc/16:9/w_1411,h_794,c_limit/GettyImages-1336498787.jpg',
            category: 'interior',
            favorite: true,
            fullContent: 'La Sansevieria prefiere luz indirecta brillante pero soporta poca luz. Riega solo cuando el sustrato esté completamente seco (aprox. cada 3–4 semanas). Evita el exceso de agua para no pudrir las raíces. Colócala en macetas con buen drenaje.'
        },
        {
            id: 10,
            title: 'Dracaena Marginata: Elegancia Vertical',
            description: 'Guía para mantener tus Dracaenas erguidas y sanas.',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlkhqFq9r6f1GQEo4gFRy3qq5N0regGHrj7Q&s',
            category: 'interior',
            favorite: false,
            fullContent: 'La Dracaena marginata necesita luz indirecta y temperaturas estables entre 18–24 °C. Riega cuando los primeros 2 cm de tierra estén secos. Evita corrientes de aire y fertiliza ligeramente en primavera y verano.'
        },
        {
            id: 11,
            title: 'Prevención del Mildiu Polvoriento',
            description: 'Cómo evitar y tratar el mildiu en tus plantas de interior.',
            image: 'https://eos.com/wp-content/uploads/2024/02/powdery-mildew-cultural-treatment.png.webp',
            category: 'enfermedades',
            favorite: false,
            fullContent: 'El mildiu polvoriento se manifiesta con manchas blancas en hojas y tallos. Mantén buena ventilación y evita el exceso de humedad. Para tratarlo, aplica un fungicida específico o una mezcla de leche diluida al 10 % en agua cada 7 días.'
        },
        {
            id: 12,
            title: 'Cómo Combatir la Mosca Blanca',
            description: 'Métodos orgánicos y químicos para erradicar mosca blanca.',
            image: 'https://cdn0.ecologiaverde.com/es/posts/1/8/3/mosca_blanca_como_eliminarla_2381_orig.jpg',
            category: 'enfermedades',
            favorite: true,
            fullContent: 'La mosca blanca chupa savia y deja melaza en las hojas. Usa trampas adhesivas amarillas para monitoreo. Para un control natural, pulveriza jabón potásico o extracto de neem, y repite cada 10 días hasta su eliminación.'
        },
        {
            id: 13,
            title: 'Guía de Tratamiento contra Roya',
            description: 'Identifica y detén la roya antes de que se propague.',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStKBa5Ydi7V1eznbKvTsGUdml_GQzjor9o2A&s',
            category: 'enfermedades',
            favorite: false,
            fullContent: 'La roya provoca manchas amarillas u óxido en el envés de las hojas. Retira partes infectadas y mejora la circulación de aire. Aplica un fungicida a base de cobre siguiendo las instrucciones del fabricante.'
        },
        {
            id: 14,
            title: 'Mantenimiento de Vallisneria Americana',
            description: 'La planta ideal para fondos de acuarios de agua dulce.',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_CsNoBRUoM5VPZMGbyS1f9vFuYUGDLUqHOg&s',
            category: 'acuaticas',
            favorite: false,
            fullContent: 'La Vallisneria prospera en aguas frías y templadas. Siembra rizomas en sustrato fino y provee iluminación moderada. Retira hojas viejas para estimular el crecimiento. Es muy eficiente para oxigenar el agua.'
        },
        {
            id: 15,
            title: 'Cultivo de Cabomba',
            description: 'Cómo establecer y mantener tu Cabomba caroliniana.',
            image: 'https://www.2hraquarist.com/cdn/shop/articles/Cabomba_furcata_1800-min_7f973ad6-1c8c-4132-83d3-f8d723db7d4c_1799x.jpg?v=1742537064',
            category: 'acuaticas',
            favorite: false,
            fullContent: 'La Cabomba requiere luz intensa y CO₂ añadido para un crecimiento óptimo. Coloca los tallos en sustrato arenoso y controla la velocidad del agua. El poda regular previene el exceso de biomasa.'
        },
        {
            id: 16,
            title: 'Guía de Cuidado de Rotala Rotundifolia',
            description: 'Planta de tallos finos y hojas coloridas para acuarios.',
            image: 'https://i.redd.it/clpjordz4jq01.jpg',
            category: 'acuaticas',
            favorite: false,
            fullContent: 'La Rotala prefiere iluminación alta y aporte de CO₂. Planta varios esquejes en sustrato nutritivo y mantén nitratos y fosfatos estables. Poda regularmente para formar matorrales densos.'
        }
    ];


    const guidesContainer = document.getElementById('guides-container');
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noResultsMessage = document.getElementById('no-results-message');
    const modal = document.getElementById('guide-modal');
    const closeModalBtn = modal.querySelector('.close-modal-btn');
    let currentFilter = 'all';

    const renderGuides = () => {
        guidesContainer.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();

        const getFilteredGuides = () => {
            return allGuides.filter(guide => {
                const searchMatch = guide.title.toLowerCase().includes(searchTerm) || guide.description.toLowerCase().includes(searchTerm);
                if (currentFilter === 'all') return searchMatch;
                if (currentFilter === 'favoritos') return guide.favorite && searchMatch;
                return guide.category === currentFilter && searchMatch;
            });
        };

        const filteredGuides = getFilteredGuides();

        if (filteredGuides.length === 0) {
            noResultsMessage.classList.remove('hidden');
            return;
        }
        noResultsMessage.classList.add('hidden');

        const guidesByCategory = filteredGuides.reduce((acc, guide) => {
            const category = guide.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push(guide);
            return acc;
        }, {});

        if (currentFilter === 'favoritos') {
            if (filteredGuides.length > 0) {
                guidesContainer.appendChild(createCategoryRow('favoritos', filteredGuides));
            }
        } else {
            for (const category in guidesByCategory) {
                guidesContainer.appendChild(createCategoryRow(category, guidesByCategory[category]));
            }
        }
        initAllCarousels();
    };

    const createCategoryRow = (categoryKey, guides) => {
        const row = document.createElement('div');
        row.className = 'guide-category-row';
        const info = categoryInfo[categoryKey];

        const cardsHTML = guides.map(guide => `
            <div class="guide-card">
                <div class="guide-card-image" style="background-image: url('${guide.image}')">
                    <button class="favorite-btn ${guide.favorite ? 'is-favorite' : ''}" data-id="${guide.id}" title="Guardar en favoritos"><i class="fas fa-bookmark"></i></button>
                </div>
                <div class="guide-card-content">
                    <h3>${guide.title}</h3><p>${guide.description}</p>
                    <div class="guide-card-footer"><a class="read-more-btn" data-id="${guide.id}">Leer más <i class="fas fa-arrow-right"></i></a></div>
                </div>
            </div>
        `).join('');

        row.innerHTML = `
            <div class="category-header">
                <h2>${info.title}</h2>
                <p>${info.subtitle}</p>
            </div>
            <div class="guides-carousel-wrapper">
                <button class="carousel-btn prev" disabled>&lt;</button>
                <div class="guides-carousel"><div class="guides-track">${cardsHTML}</div></div>
                <button class="carousel-btn next">&gt;</button>
            </div>
        `;
        return row;
    };

    const initAllCarousels = () => {
        document.querySelectorAll('.guides-carousel-wrapper').forEach(wrapper => {
            const track = wrapper.querySelector('.guides-track');
            const prevBtn = wrapper.querySelector('.carousel-btn.prev');
            const nextBtn = wrapper.querySelector('.carousel-btn.next');
            const cards = track.querySelectorAll('.guide-card');
            if (cards.length === 0) return;

            let currentIndex = 0;
            const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(track).gap);

            const updateButtons = () => {
                prevBtn.disabled = currentIndex === 0;
                const visibleCards = Math.floor(wrapper.querySelector('.guides-carousel').offsetWidth / cardWidth);
                nextBtn.disabled = currentIndex >= cards.length - visibleCards;
            };

            nextBtn.addEventListener('click', () => { currentIndex++; track.style.transform = `translateX(-${currentIndex * cardWidth}px)`; updateButtons(); });
            prevBtn.addEventListener('click', () => { currentIndex--; track.style.transform = `translateX(-${currentIndex * cardWidth}px)`; updateButtons(); });

            updateButtons();
        });
    };

    const openModal = (guide) => {
        modal.querySelector('#modal-image').src = guide.image;
        modal.querySelector('#modal-title').textContent = guide.title;
        modal.querySelector('#modal-description').textContent = guide.fullContent;
        modal.classList.add('active');
    };

    const closeModal = () => modal.classList.remove('active');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            // Limpiar los filtros de categoría si se selecciona "Todos" o "Favoritos"
            if (currentFilter === 'all' || currentFilter === 'favoritos') {
                document.querySelectorAll('.filter-btn[data-filter]:not([data-filter="all"]):not([data-filter="favoritos"])').forEach(b => b.classList.remove('active'));
            } else {
                document.querySelector('.filter-btn[data-filter="all"]').classList.remove('active');
                document.querySelector('.filter-btn[data-filter="favoritos"]').classList.remove('active');
            }
            renderGuides();
        });
    });

    searchInput.addEventListener('input', renderGuides);

    guidesContainer.addEventListener('click', (e) => {
        const favoriteBtn = e.target.closest('.favorite-btn');
        const readMoreBtn = e.target.closest('.read-more-btn');

        if (favoriteBtn) {
            const guideId = parseInt(favoriteBtn.dataset.id);
            const guide = allGuides.find(g => g.id === guideId);
            if (guide) {
                guide.favorite = !guide.favorite;
                renderGuides();
            }
        }

        if (readMoreBtn) {
            const guideId = parseInt(readMoreBtn.dataset.id);
            const guide = allGuides.find(g => g.id === guideId);
            if(guide) openModal(guide);
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    renderGuides();
});
