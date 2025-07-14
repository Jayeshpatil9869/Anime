// Anime Detail Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDetailPageFeatures();
});

function initializeDetailPageFeatures() {
    initializeParallaxEffect();
    initializeCharacterCards();
    initializeStoryArcs();
    initializeScrollAnimations();
}

// Parallax effect for hero background
function initializeParallaxEffect() {
    const heroSection = document.querySelector('.anime-hero');
    const heroImage = document.querySelector('.anime-hero-bg img');
    
    if (heroSection && heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Enhanced character card interactions
function initializeCharacterCards() {
    const characterCards = document.querySelectorAll('.character-card');
    
    characterCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add glow effect
            card.style.boxShadow = '0 20px 40px rgba(0, 255, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            // Remove glow effect
            card.style.boxShadow = '';
        });
        
        // Add click interaction for character details
        card.addEventListener('click', () => {
            const characterName = card.querySelector('.character-info h4').textContent;
            showCharacterModal(characterName);
        });
    });
}

// Story arc timeline interactions
function initializeStoryArcs() {
    const arcItems = document.querySelectorAll('.arc-item');
    
    arcItems.forEach((arc, index) => {
        // Add staggered animation delay
        arc.style.animationDelay = `${index * 0.2}s`;
        
        // Add click interaction
        arc.addEventListener('click', () => {
            const arcTitle = arc.querySelector('h3').textContent;
            showArcDetails(arcTitle);
        });
        
        // Add hover sound effect (if audio is available)
        arc.addEventListener('mouseenter', () => {
            // You can add sound effects here
            arc.style.transform = 'translateX(10px)';
        });
        
        arc.addEventListener('mouseleave', () => {
            arc.style.transform = 'translateX(0)';
        });
    });
}

// Scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for different elements
                if (entry.target.classList.contains('detail-card')) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                }
                
                if (entry.target.classList.contains('character-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1;
                    entry.target.style.animation = `fadeInUp 0.8s ease-out ${delay}s forwards`;
                }
                
                if (entry.target.classList.contains('arc-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.2;
                    entry.target.style.animation = `fadeInLeft 0.8s ease-out ${delay}s forwards`;
                }
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    document.querySelectorAll('.detail-card, .character-card, .arc-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Character modal functionality
function showCharacterModal(characterName) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'character-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="character-modal">
            <div class="modal-header">
                <h2>${characterName}</h2>
                <button class="modal-close" onclick="closeCharacterModal()">
                    <i class="ri-close-line"></i>
                </button>
            </div>
            <div class="modal-content">
                <div class="character-details">
                    <img src="./Assets/All1111111.jpeg" alt="${characterName}" />
                    <div class="character-bio">
                        <h3>Character Biography</h3>
                        <p>Detailed information about ${characterName} would go here. This could include their background, abilities, relationships, and character development throughout the series.</p>
                        
                        <h4>Abilities & Techniques</h4>
                        <ul>
                            <li>Special technique or ability</li>
                            <li>Combat skills</li>
                            <li>Unique powers</li>
                        </ul>
                        
                        <h4>Character Stats</h4>
                        <div class="character-stats">
                            <div class="stat-bar">
                                <span>Strength</span>
                                <div class="bar"><div class="fill" style="width: 85%"></div></div>
                            </div>
                            <div class="stat-bar">
                                <span>Speed</span>
                                <div class="bar"><div class="fill" style="width: 90%"></div></div>
                            </div>
                            <div class="stat-bar">
                                <span>Intelligence</span>
                                <div class="bar"><div class="fill" style="width: 75%"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden';
    
    // Animate modal in
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
}

function closeCharacterModal() {
    const modal = document.querySelector('.character-modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Story arc details
function showArcDetails(arcTitle) {
    // Simple alert for now - could be expanded to a full modal
    alert(`Detailed information about "${arcTitle}" would be displayed here. This could include episode lists, key events, character developments, and important plot points.`);
}

// Enhanced scroll effects for detail page
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax effect for section backgrounds
    const detailsSection = document.querySelector('.anime-details-section');
    if (detailsSection) {
        detailsSection.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    
    // Floating animation for detail cards
    const detailCards = document.querySelectorAll('.detail-card');
    detailCards.forEach((card, index) => {
        const offset = Math.sin(scrolled * 0.01 + index) * 5;
        card.style.transform = `translateY(${offset}px)`;
    });
});

// Keyboard navigation for detail page
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCharacterModal();
    }
    
    // Arrow key navigation for character cards
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const characterCards = document.querySelectorAll('.character-card');
        const activeCard = document.querySelector('.character-card.focused') || characterCards[0];
        const currentIndex = Array.from(characterCards).indexOf(activeCard);
        
        let nextIndex;
        if (e.key === 'ArrowLeft') {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : characterCards.length - 1;
        } else {
            nextIndex = currentIndex < characterCards.length - 1 ? currentIndex + 1 : 0;
        }
        
        characterCards.forEach(card => card.classList.remove('focused'));
        characterCards[nextIndex].classList.add('focused');
        characterCards[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Add CSS for modal and animations
const modalStyles = `
<style>
.character-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.character-modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.character-modal {
    background: var(--secondary-bg);
    border: 2px solid var(--neon-cyan);
    border-radius: var(--border-radius);
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.8);
    transition: transform 0.3s ease;
}

.character-modal-overlay.active .character-modal {
    transform: scale(1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.modal-header h2 {
    font-family: 'Orbitron', monospace;
    color: var(--neon-cyan);
}

.modal-close {
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 1.5rem;
    cursor: pointer;
    transition: var(--transition);
}

.modal-close:hover {
    color: var(--neon-cyan);
}

.modal-content {
    padding: 2rem;
}

.character-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
}

.character-details img {
    width: 100%;
    border-radius: var(--border-radius);
}

.character-bio h3, .character-bio h4 {
    color: var(--text-primary);
    margin: 1rem 0 0.5rem 0;
}

.character-bio p, .character-bio li {
    color: var(--text-secondary);
    line-height: 1.6;
}

.character-stats {
    margin-top: 1rem;
}

.stat-bar {
    margin-bottom: 1rem;
}

.stat-bar span {
    display: block;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
}

.fill {
    height: 100%;
    background: var(--gradient-primary);
    transition: width 1s ease;
}

.character-card.focused {
    border-color: var(--neon-pink);
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalStyles);
