/* =========================================
   RoboLab - Main JavaScript
   Funcionalidades principales del sitio
   ========================================= */

// --- TOPICS DATA (Para index.html) ---
const topics = [
    {
        id: 1,
        title: "Introducción a la Robótica",
        description: "Conceptos básicos de robótica, historia y aplicaciones modernas. Componentes principales y tipos de robots.",
        category: "clase",
        level: "Básico",
        color: "blue",
        date: "21/ENE/2026 8:00 AM",
        icon: "ph-robot",
        link: "topics/topic-1.html"
    },
    {
        id: 2,
        title: "Conceptos Básicos de la Electricidad",
        description: "Conocer los fundamentos de electricidad necesarios para entender el funcionamiento de los robots.",
        category: "clase",
        level: "Básico",
        color: "green",
        date: "23/ENE/2026 8:00 AM",
        icon: "ph-plug",
        link: "topics/topic-2.html"
    }
    // Más temas pueden ser añadidos aquí
];

// --- UTILIDADES GENERALES ---

/**
 * Obtiene el color de categoría para badges
 */
function getCategoryColor(color) {
    const map = {
        'blue': 'text-neon-blue bg-neon-blue/10 border-neon-blue/20',
        'green': 'text-neon-green bg-neon-green/10 border-neon-green/20',
        'purple': 'text-neon-purple bg-neon-purple/10 border-neon-purple/20',
    };
    return map[color] || map['blue'];
}

/**
 * Renderiza las tarjetas de temas
 */
function renderTopics(data) {
    const grid = document.getElementById('topics-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (data.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');

    data.forEach((topic, index) => {
        const delay = index * 100;
        const card = document.createElement('div');
        card.className = `glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer group fade-in relative overflow-hidden`;
        card.style.animationDelay = `${delay}ms`;
        card.onclick = () => openModal(topic);

        const accentColor = topic.color === 'blue' ? '#38bdf8' : topic.color === 'green' ? '#34d399' : '#c084fc';
        
        card.innerHTML = `
            <div class="absolute top-0 left-0 w-full h-1" style="background: ${accentColor}"></div>
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition duration-300 group-hover:bg-white/10">
                    <i class="ph ${topic.icon}"></i>
                </div>
                <span class="px-2.5 py-1 rounded-md text-xs font-medium border ${getCategoryColor(topic.color)}">
                    ${topic.category.toUpperCase()}
                </span>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-neon-${topic.color} transition-colors">${topic.title}</h3>
            <p class="text-slate-400 text-sm mb-6 line-clamp-2">${topic.description}</p>
            
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div class="flex items-center gap-2 text-xs text-slate-500">
                    <i class="ph ph-clock"></i>
                    <span>${topic.date}</span>
                </div>
                <div class="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <span>${topic.level}</span>
                    <i class="ph ph-caret-right text-sm"></i>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- FILTROS Y BÚSQUEDA ---
let currentFilter = 'all';
let currentSearch = '';

function filterData() {
    const filtered = topics.filter(topic => {
        const matchesCategory = currentFilter === 'all' || topic.category === currentFilter;
        const matchesSearch = topic.title.toLowerCase().includes(currentSearch) || 
                              topic.description.toLowerCase().includes(currentSearch);
        return matchesCategory && matchesSearch;
    });
    renderTopics(filtered);
}

function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => {
                    b.classList.remove('bg-white/10', 'text-white', 'border-white/10');
                    b.classList.add('text-slate-400', 'border-transparent');
                });
                btn.classList.remove('text-slate-400', 'border-transparent');
                btn.classList.add('bg-white/10', 'text-white', 'border-white/10');

                currentFilter = btn.dataset.filter;
                filterData();
            });
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            filterData();
        });
    }
}

// --- MODAL LOGIC ---
function openModal(topic) {
    const modal = document.getElementById('topic-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalPanel = document.getElementById('modal-panel');
    
    if (!modal || !modalBackdrop || !modalPanel) return;
    
    // Populate data
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalId = document.getElementById('modal-id');
    const modalBadge = document.getElementById('modal-badge');
    const modalLink = document.getElementById('modal-link');
    
    if (modalTitle) modalTitle.textContent = topic.title;
    if (modalDescription) modalDescription.textContent = topic.description;
    if (modalId) modalId.textContent = `#00${topic.id}`;
    if (modalLink) modalLink.href = topic.link || '#';
    
    if (modalBadge) {
        modalBadge.textContent = topic.category.toUpperCase();
        modalBadge.className = `px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(topic.color)}`;
    }

    // Show modal
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalBackdrop.classList.remove('opacity-0');
        modalPanel.classList.remove('opacity-0', 'scale-95');
        modalPanel.classList.add('opacity-100', 'scale-100');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('topic-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalPanel = document.getElementById('modal-panel');
    
    if (!modal || !modalBackdrop || !modalPanel) return;
    
    modalBackdrop.classList.add('opacity-0');
    modalPanel.classList.remove('opacity-100', 'scale-100');
    modalPanel.classList.add('opacity-0', 'scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function initializeModal() {
    const closeModalBtn = document.getElementById('close-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const topicModal = document.getElementById('topic-modal');
            if (topicModal && !topicModal.classList.contains('hidden')) {
                closeModal();
            }
        }
    });
}

// --- TIMELINE INTERACTIVITY ---
/**
 * Inicializa la interactividad de la línea de tiempo expandible
 */
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;

    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            // Si ya está activo, no hacemos nada o podríamos colapsarlo
            const isActive = item.classList.contains('active');
            
            // Cerrar otros
            timelineItems.forEach(i => {
                i.classList.remove('active');
            });

            // Si no estaba activo, activarlo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// --- INICIALIZACIÓN ---
function initIndex() {
    renderTopics(topics);
    initializeFilters();
    initializeModal();
    initializeTimeline();
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIndex);
} else {
    initIndex();
}
