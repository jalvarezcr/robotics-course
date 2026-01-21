/* =========================================
   RoboLab - Interactive Components
   Componentes reutilizables (Tabs, Accordion, etc.)
   ========================================= */

// --- TABS COMPONENT ---
function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const container = btn.closest('.glass-panel');
            
            if (!container) return;
            
            // Update Buttons
            container.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('text-neon-blue', 'border-neon-blue');
                b.classList.add('text-slate-400', 'border-transparent');
            });
            btn.classList.add('text-neon-blue', 'border-neon-blue');
            btn.classList.remove('text-slate-400', 'border-transparent');

            // Update Content
            container.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
}

// --- ACCORDION COMPONENT ---
function initializeAccordion() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const body = trigger.nextElementSibling;
            const icon = trigger.querySelector('.ph-caret-down');
            
            if (!body || !icon) return;
            
            // Close others (opcional - remover para permitir múltiples abiertos)
            document.querySelectorAll('.accordion-body').forEach(otherBody => {
                if (otherBody !== body && otherBody.style.maxHeight) {
                    otherBody.style.maxHeight = null;
                    const otherIcon = otherBody.previousElementSibling.querySelector('.ph-caret-down');
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    otherBody.previousElementSibling.classList.remove('bg-white/10');
                }
            });

            // Toggle Current
            if (body.style.maxHeight) {
                body.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
                trigger.classList.remove('bg-white/10');
            } else {
                body.style.maxHeight = body.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
                trigger.classList.add('bg-white/10');
            }
        });
    });
}

// --- COPY CODE BUTTON ---
function initializeCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const codeId = btn.dataset.code;
            const codeElement = document.getElementById(codeId);
            
            if (!codeElement) return;
            
            const text = codeElement.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = `<i class="ph ph-check text-neon-green"></i> Copiado`;
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                }, 2000);
            });
        });
    });
}

// --- SLIDER / CAROUSEL ---
function initializeSlider() {
    const track = document.getElementById('slider-track');
    if (!track) return;
    
    let currentSlide = 0;
    const slides = track.children;
    const totalSlides = slides.length;
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
    }
}

// --- GENERIC MODAL TOGGLE ---
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const backdrop = modal.querySelector('.modal-backdrop');
    const panel = modal.querySelector('.modal-panel');
    
    if (!backdrop || !panel) return;
    
    if (modal.classList.contains('hidden')) {
        // Open
        modal.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            panel.classList.remove('opacity-0', 'scale-95');
            panel.classList.add('opacity-100', 'scale-100');
        }, 10);
    } else {
        // Close
        backdrop.classList.add('opacity-0');
        panel.classList.remove('opacity-100', 'scale-100');
        panel.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

// Close modal on backdrop click
function initializeGenericModals() {
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', function() {
            const modalId = this.closest('[role="dialog"]')?.id;
            if (modalId) toggleModal(modalId);
        });
    });
}

// --- QUIZ LOGIC ---
function initializeQuiz() {
    const checkQuizBtn = document.getElementById('check-quiz');
    if (!checkQuizBtn) return;
    
    checkQuizBtn.addEventListener('click', () => {
        const selected = document.querySelector('input[name="arduino-quiz"]:checked');
        const feedback = document.getElementById('quiz-feedback');
        
        if (!feedback) return;
        
        if (!selected) {
            feedback.textContent = "Por favor selecciona una respuesta.";
            feedback.className = "mt-4 p-3 rounded-lg text-sm bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 block";
            return;
        }

        if (selected.value === 'setup') {
            feedback.innerHTML = `<div class="flex items-center gap-2"><i class="ph ph-check-circle text-lg"></i> <span>¡Correcto! setup() corre una vez para configurar pines.</span></div>`;
            feedback.className = "mt-4 p-3 rounded-lg text-sm bg-green-500/10 text-green-400 border border-green-500/20 block";
        } else {
            feedback.innerHTML = `<div class="flex items-center gap-2"><i class="ph ph-x-circle text-lg"></i> <span>Incorrecto. Inténtalo de nuevo.</span></div>`;
            feedback.className = "mt-4 p-3 rounded-lg text-sm bg-red-500/10 text-red-400 border border-red-500/20 block";
        }
    });
}

// --- INICIALIZAR TODOS LOS COMPONENTES ---
function initializeComponents() {
    initializeTabs();
    initializeAccordion();
    initializeCopyButtons();
    initializeSlider();
    initializeGenericModals();
    initializeQuiz();
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComponents);
} else {
    initializeComponents();
}

// Exponer funciones globales necesarias
window.toggleModal = toggleModal;
