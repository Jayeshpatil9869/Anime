// API integration for AnimeVerse

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';
let currentAnimePage = 1;
let isAnimeLoading = false;

async function fetchTopAnime(page = 1) {
    try {
        const response = await fetch(`${JIKAN_API_BASE}/top/anime?page=${page}&filter=bypopularity`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching anime:', error);
        return [];
    }
}

function createAnimeCard(anime) {
    // Map genres to a string for the data-category attribute
    const genres = anime.genres.map(g => g.name.toLowerCase()).join(' ');
    // Also use demographics/themes if available to broaden filters
    const allTags = [
        ...anime.genres.map(g => g.name.toLowerCase()),
        ...(anime.themes ? anime.themes.map(t => t.name.toLowerCase()) : []),
        ...(anime.demographics ? anime.demographics.map(d => d.name.toLowerCase()) : [])
    ].join(' ');

    const title = anime.title_english || anime.title;
    const synopsis = anime.synopsis ?
        (anime.synopsis.length > 100 ? anime.synopsis.substring(0, 100) + '...' : anime.synopsis)
        : 'No synopsis available.';

    const year = anime.year || (anime.aired && anime.aired.prop && anime.aired.prop.from ? anime.aired.prop.from.year : 'Unknown');

    return `
        <div class="anime-card" data-category="${allTags}" style="display: block; animation: fadeInUp 0.5s ease-out;">
            <div class="anime-card-image">
                <img src="${anime.images.jpg.large_image_url}" alt="${title}" loading="lazy" />
                <div class="anime-card-overlay">
                    <div class="anime-card-info">
                        <h3>${title}</h3>
                        <p>${anime.genres.slice(0, 2).map(g => g.name).join(' • ')}</p>
                        <div class="anime-rating">
                            <i class="ri-star-fill"></i>
                            <span>${anime.score || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="anime-card-actions">
                        <button class="card-btn" onclick="openAnimeDetail('${title.replace(/'/g, "\\'")}')" title="Watch on HiAnime">
                            <i class="ri-play-circle-line"></i>
                        </button>
                        ${anime.trailer && anime.trailer.url ? `
                        <button class="card-btn" onclick="openVideoTrial('${title.replace(/'/g, "\\'")}')" title="Watch Trailer">
                            <i class="ri-play-circle-line"></i>
                        </button>` : ''}
                        <button class="card-btn" title="Add to Favorites">
                            <i class="ri-heart-line"></i>
                        </button>
                        <button class="card-btn" title="Share">
                            <i class="ri-share-line"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="anime-card-content">
                <h3 class="anime-card-title">${title}</h3>
                <p class="anime-card-synopsis">${synopsis}</p>
                <div class="anime-card-meta">
                    <span class="anime-episodes">${anime.episodes ? anime.episodes + ' Episodes' : 'Ongoing'}</span>
                    <span class="anime-year">${year}</span>
                </div>
            </div>
        </div>
    `;
}

// Gallery Integration

async function fetchTopCharacters(page = 1) {
    try {
        const response = await fetch(`${JIKAN_API_BASE}/top/characters?page=${page}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
}

function createGalleryItem(imageSrc, title, subtitle, category) {
    // Escape single quotes in title for the onclick handler
    const safeTitle = title.replace(/'/g, "\\'");
    return `
        <div class="gallery-item" data-category="${category}" style="display: block; animation: fadeIn 0.5s ease-out;">
            <img src="${imageSrc}" alt="${title}" loading="lazy" />
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <h4>${title}</h4>
                    <p>${subtitle}</p>
                </div>
                <div class="gallery-actions">
                    <button class="gallery-btn" onclick="openImageModal(this)">
                        <i class="ri-eye-line"></i>
                    </button>
                    <button class="gallery-btn" onclick="downloadImage('${imageSrc}', '${safeTitle}')">
                        <i class="ri-download-line"></i>
                    </button>
                    <button class="gallery-btn">
                        <i class="ri-heart-line"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function populateGallery() {
    const tabs = {
        wallpapers: document.querySelector('.gallery-content[data-content="wallpapers"] .gallery-masonry'),
        artwork: document.querySelector('.gallery-content[data-content="artwork"] .gallery-masonry'),
        screenshots: document.querySelector('.gallery-content[data-content="screenshots"] .gallery-masonry'),
        fanart: document.querySelector('.gallery-content[data-content="fanart"] .gallery-masonry')
    };

    // 1. Wallpapers: Use Top Anime (High Res)
    if (tabs.wallpapers) {
        const anime = await fetchTopAnime(1); // Page 1
        if (anime) {
            tabs.wallpapers.innerHTML = anime.slice(0, 10).map(a =>
                createGalleryItem(a.images.jpg.large_image_url, a.title, 'High Res Wallpaper', 'wallpaper')
            ).join('');
        }
    }

    // 2. Artwork: Use Top Characters
    if (tabs.artwork) {
        const characters = await fetchTopCharacters(1);
        if (characters) {
            tabs.artwork.innerHTML = characters.slice(0, 10).map(c =>
                createGalleryItem(c.images.jpg.image_url, c.name, 'Character Design', 'artwork')
            ).join('');
        }
    }

    // 3. Screenshots: Use Top Anime Page 2 (Simulating screenshots with anime covers for now, or use promo images if available)
    // Jikan doesn't have a direct "screenshots" endpoint easily accessible for a list, so we'll use more anime covers or specific promotional images.
    if (tabs.screenshots) {
        const anime = await fetchTopAnime(2); // Page 2
        if (anime) {
            tabs.screenshots.innerHTML = anime.slice(0, 10).map(a =>
                createGalleryItem(a.images.jpg.large_image_url, a.title, 'Official Visual', 'screenshot')
            ).join('');
        }
    }

    // 4. Fan Art: Use Top Characters Page 2
    if (tabs.fanart) {
        const characters = await fetchTopCharacters(2);
        if (characters) {
            tabs.fanart.innerHTML = characters.slice(0, 10).map(c =>
                createGalleryItem(c.images.jpg.image_url, c.name, 'Fan Creation', 'fanart')
            ).join('');
        }
    }
}

async function initializeAnimeGrid() {
    const grid = document.getElementById('animeGrid');
    if (grid) {
        // Show loading state (optional, or just clear)
        grid.innerHTML = '<div class="loading-spinner" style="grid-column: 1/-1; text-align: center; color: var(--neon-cyan);">Loading Top Anime...</div>';

        const topAnime = await fetchTopAnime();

        if (topAnime && topAnime.length > 0) {
            grid.innerHTML = topAnime.map(createAnimeCard).join('');

            // Re-initialize filters since DOM has changed
            if (typeof initializeAnimeFilters === 'function') {
                initializeAnimeFilters();
            } else {
                console.warn('initializeAnimeFilters not found in global scope');
            }
        } else {
            grid.innerHTML = '<div class="error-message" style="grid-column: 1/-1; text-align: center;">Failed to load anime data.</div>';
        }
    }

    // Initialize Gallery as well
    populateGallery();

    // Setup Load More Button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.onclick = loadMoreAnime;
    }
}

async function loadMoreAnime() {
    if (isAnimeLoading) return;

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const btnText = loadMoreBtn.querySelector('span');
    const originalText = btnText.textContent;

    try {
        isAnimeLoading = true;
        loadMoreBtn.classList.add('loading');
        btnText.textContent = 'Loading...';

        currentAnimePage++;
        const moreAnime = await fetchTopAnime(currentAnimePage);

        if (moreAnime && moreAnime.length > 0) {
            const grid = document.getElementById('animeGrid');
            const newCards = moreAnime.map(createAnimeCard).join('');
            grid.insertAdjacentHTML('beforeend', newCards);

            // Re-apply filters if needed (optional)
        } else {
            // No more results
            loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading more anime:', error);
        currentAnimePage--; // Revert on error
    } finally {
        isAnimeLoading = false;
        loadMoreBtn.classList.remove('loading');
        btnText.textContent = originalText;
    }
}


// Expose initialization to global scope or run it
window.initializeAnimeGrid = initializeAnimeGrid;
