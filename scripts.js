// AnimeVerse - Interactive Features
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all features
  initializeLoading();
  initializeNavigation();
  initializeScrollEffects();
  initializeMusicToggle();
  initializeAnimations();
  initializeCounters();
  initializeAnimeFilters();
  initializeGallery();
  initializeVideoPlayer();
});

// Loading Screen
function initializeLoading() {
  const loadingScreen = document.getElementById("loadingScreen");

  // Simulate loading time
  setTimeout(() => {
    loadingScreen.classList.add("hidden");

    // Remove from DOM after transition
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }, 3000);
}

// Navigation
function initializeNavigation() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Active link highlighting
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

// Scroll Effects
function initializeScrollEffects() {
  const scrollProgress = document.getElementById("scrollProgress");

  // Update scroll progress
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    scrollProgress.style.width = scrollPercent + "%";
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Music Toggle
function initializeMusicToggle() {
  const musicToggle = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");
  const backgroundMusic = document.getElementById("backgroundMusic");
  let isPlaying = false;
  let isLoaded = false;

  // Ensure audio starts muted
  backgroundMusic.muted = true;
  backgroundMusic.volume = 0.3;

  // Check if audio can be loaded
  backgroundMusic.addEventListener("canplaythrough", () => {
    isLoaded = true;
    console.log("Background music loaded successfully");
  });

  backgroundMusic.addEventListener("error", (e) => {
    console.error("Background music failed to load:", e);
    showMusicError();
  });

  // Handle audio events
  backgroundMusic.addEventListener("play", () => {
    isPlaying = true;
    musicIcon.className = "ri-volume-up-line";
    musicToggle.classList.add("playing");
  });

  backgroundMusic.addEventListener("pause", () => {
    isPlaying = false;
    musicIcon.className = "ri-volume-mute-line";
    musicToggle.classList.remove("playing");
  });

  backgroundMusic.addEventListener("ended", () => {
    isPlaying = false;
    musicIcon.className = "ri-volume-mute-line";
    musicToggle.classList.remove("playing");
  });

  // Click handler
  musicToggle.addEventListener("click", () => {
    if (!isLoaded) {
      showMusicLoadingMessage();
      return;
    }

    if (isPlaying) {
      backgroundMusic.pause();
      backgroundMusic.muted = true;
    } else {
      // Unmute and play
      backgroundMusic.muted = false;
      // Note: Auto-play might be blocked by browser policies
      backgroundMusic.play().catch((e) => {
        console.log("Audio play failed:", e);
        backgroundMusic.muted = true; // Re-mute if play fails
        showAutoplayBlockedMessage();
      });
    }
  });

  // Volume control with mouse wheel
  musicToggle.addEventListener("wheel", (e) => {
    e.preventDefault();

    // If music is muted and user scrolls up, unmute it
    if (backgroundMusic.muted && e.deltaY < 0) {
      backgroundMusic.muted = false;
    }

    const currentVolume = backgroundMusic.volume;
    const volumeChange = e.deltaY > 0 ? -0.1 : 0.1;
    const newVolume = Math.max(0, Math.min(1, currentVolume + volumeChange));
    backgroundMusic.volume = newVolume;

    // Mute if volume reaches 0
    if (newVolume === 0) {
      backgroundMusic.muted = true;
    }

    // Update visual feedback
    updateVolumeIndicator(newVolume);
  });
}

function showMusicError() {
  const musicToggle = document.getElementById("musicToggle");
  musicToggle.style.borderColor = "#ff0000";
  musicToggle.title = "Background music failed to load";

  setTimeout(() => {
    musicToggle.style.borderColor = "";
    musicToggle.title = "Background music (unavailable)";
  }, 3000);
}

function showMusicLoadingMessage() {
  const musicToggle = document.getElementById("musicToggle");
  const originalTitle = musicToggle.title;
  musicToggle.title = "Loading background music...";

  setTimeout(() => {
    musicToggle.title = originalTitle;
  }, 2000);
}

function showAutoplayBlockedMessage() {
  const musicToggle = document.getElementById("musicToggle");
  const originalTitle = musicToggle.title;
  musicToggle.title = "Click again to play music (autoplay blocked)";

  setTimeout(() => {
    musicToggle.title = originalTitle;
  }, 3000);
}

function updateVolumeIndicator(volume) {
  const musicIcon = document.getElementById("musicIcon");
  const backgroundMusic = document.getElementById("backgroundMusic");

  if (backgroundMusic.muted || volume === 0) {
    musicIcon.className = "ri-volume-mute-line";
  } else if (volume < 0.5) {
    musicIcon.className = "ri-volume-down-line";
  } else {
    musicIcon.className = "ri-volume-up-line";
  }
}

// Animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
      }
    });
  }, observerOptions);

  // Observe elements with animations
  document.querySelectorAll('[class*="fadeIn"]').forEach((el) => {
    observer.observe(el);
  });
}

// Counter Animation
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number");

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-count"));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  };

  // Intersection Observer for counters
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
}

// Utility Functions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

function openAnimeDetail(animeId) {
  // This would typically navigate to a detail page
  // For now, we'll show an alert
  alert(`Opening details for: ${animeId}`);
  // In a real application, you might do:
  // window.location.href = `anime-detail.html?id=${animeId}`;
}

// Parallax Effect for Video Background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const video = document.getElementById("heroVideo");
  if (video) {
    video.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Add some interactive hover effects
document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor");
  if (cursor) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  }
});

// Anime Filters and Search
function initializeAnimeFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const animeCards = document.querySelectorAll(".anime-card");
  const searchInput = document.getElementById("animeSearch");

  // Filter functionality
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active filter button
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      animeCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filter === "all" || category.includes(filter)) {
          card.style.display = "block";
          card.style.animation = "fadeInUp 0.5s ease-out";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();

      animeCards.forEach((card) => {
        const title = card
          .querySelector(".anime-card-title")
          .textContent.toLowerCase();
        const synopsis = card
          .querySelector(".anime-card-synopsis")
          .textContent.toLowerCase();

        if (title.includes(searchTerm) || synopsis.includes(searchTerm)) {
          card.style.display = "block";
          card.style.animation = "fadeInUp 0.5s ease-out";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
}

// Gallery functionality
function initializeGallery() {
  const galleryTabs = document.querySelectorAll(".gallery-tab");
  const galleryContents = document.querySelectorAll(".gallery-content");

  galleryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");

      // Update active tab
      galleryTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Update active content
      galleryContents.forEach((content) => {
        content.classList.remove("active");
        if (content.getAttribute("data-content") === targetTab) {
          content.classList.add("active");
        }
      });
    });
  });
}

// Image modal functionality
function openImageModal(button) {
  const galleryItem = button.closest(".gallery-item");
  const img = galleryItem.querySelector("img");
  const title = galleryItem.querySelector(".gallery-info h4").textContent;
  const description = galleryItem.querySelector(".gallery-info p").textContent;

  // Create modal
  const modal = document.createElement("div");
  modal.className = "image-modal-overlay";
  modal.innerHTML = `
    <div class="image-modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" onclick="closeImageModal()">
          <i class="ri-close-line"></i>
        </button>
      </div>
      <div class="modal-body">
        <img src="${img.src}" alt="${img.alt}" />
        <p>${description}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="downloadImage('${img.src}', '${title}')">
          <i class="ri-download-line"></i>
          <span>Download</span>
        </button>
        <button class="btn btn-outline">
          <i class="ri-heart-line"></i>
          <span>Add to Favorites</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    modal.classList.add("active");
  }, 10);
}

function closeImageModal() {
  const modal = document.querySelector(".image-modal-overlay");
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = "";
    }, 300);
  }
}

function downloadImage(src, filename) {
  // Create a temporary link element
  const link = document.createElement("a");
  link.href = src;
  link.download = filename || "anime-image";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Video Player functionality
function initializeVideoPlayer() {
  const videoOverlay = document.getElementById("videoPlayerOverlay");
  const video = document.getElementById("trialVideo");

  // Close video when clicking outside the video container
  videoOverlay.addEventListener("click", (e) => {
    if (e.target === videoOverlay) {
      closeVideoTrial();
    }
  });

  // Pause video when overlay is hidden
  videoOverlay.addEventListener("transitionend", () => {
    if (!videoOverlay.classList.contains("active")) {
      video.pause();
      video.currentTime = 0;
    }
  });

  // Handle video events
  video.addEventListener("loadstart", () => {
    console.log("Video loading started");
  });

  video.addEventListener("canplay", () => {
    console.log("Video can start playing");
  });

  video.addEventListener("error", (e) => {
    console.error("Video error:", e);
    showVideoError();
  });
}

function openVideoTrial(
  animeTitle = "Jujutsu Kaisen",
  videoSrc = "./Assets/THIS IS 4K ANIME (Jujutsu Kaisen).mp4"
) {
  const videoOverlay = document.getElementById("videoPlayerOverlay");
  const video = document.getElementById("trialVideo");
  const videoTitle = document.getElementById("videoTitle");
  const videoDescription = document.getElementById("videoDescription");

  // Update video information
  videoTitle.textContent = `${animeTitle} - Episode 1 Preview`;
  videoDescription.textContent = `Watch the exciting preview of ${animeTitle}`;

  // Update video source if different
  const currentSrc = video.querySelector("source").src;
  if (!currentSrc.includes(videoSrc)) {
    video.querySelector("source").src = videoSrc;
    video.load();
  }

  // Show overlay
  videoOverlay.classList.add("active");
  document.body.style.overflow = "hidden";

  // Auto-play video (with user interaction requirement)
  setTimeout(() => {
    video.play().catch((e) => {
      console.log("Auto-play prevented:", e);
      // Show play button overlay if auto-play fails
      showPlayButton();
    });
  }, 300);
}

function closeVideoTrial() {
  const videoOverlay = document.getElementById("videoPlayerOverlay");
  const video = document.getElementById("trialVideo");

  // Hide overlay
  videoOverlay.classList.remove("active");
  document.body.style.overflow = "";

  // Pause and reset video
  video.pause();
  video.currentTime = 0;

  // Hide any error messages or play buttons
  hideVideoError();
  hidePlayButton();
}

function showVideoError() {
  const videoContainer = document.querySelector(".video-player-container");

  // Remove existing error message
  const existingError = videoContainer.querySelector(".video-error");
  if (existingError) {
    existingError.remove();
  }

  // Create error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "video-error";
  errorDiv.innerHTML = `
    <div class="error-content">
      <i class="ri-error-warning-line"></i>
      <h4>Video Unavailable</h4>
      <p>Sorry, the video could not be loaded. Please try again later.</p>
      <button class="btn btn-primary" onclick="closeVideoTrial()">
        <span>Close</span>
      </button>
    </div>
  `;

  videoContainer.appendChild(errorDiv);
}

function hideVideoError() {
  const errorDiv = document.querySelector(".video-error");
  if (errorDiv) {
    errorDiv.remove();
  }
}

function showPlayButton() {
  const videoContainer = document.querySelector(".video-player-container");
  const video = document.getElementById("trialVideo");

  // Remove existing play button
  const existingButton = videoContainer.querySelector(".video-play-overlay");
  if (existingButton) {
    existingButton.remove();
  }

  // Create play button overlay
  const playOverlay = document.createElement("div");
  playOverlay.className = "video-play-overlay";
  playOverlay.innerHTML = `
    <button class="video-play-btn" onclick="playVideo()">
      <i class="ri-play-fill"></i>
    </button>
  `;

  videoContainer.appendChild(playOverlay);
}

function hidePlayButton() {
  const playOverlay = document.querySelector(".video-play-overlay");
  if (playOverlay) {
    playOverlay.remove();
  }
}

function playVideo() {
  const video = document.getElementById("trialVideo");
  video.play();
  hidePlayButton();
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close video player first
    const videoOverlay = document.getElementById("videoPlayerOverlay");
    if (videoOverlay && videoOverlay.classList.contains("active")) {
      closeVideoTrial();
      return;
    }

    // Close image modal
    const imageModal = document.querySelector(".image-modal-overlay");
    if (imageModal && imageModal.classList.contains("active")) {
      closeImageModal();
      return;
    }

    // Close character modal (if on detail page)
    if (typeof closeCharacterModal === "function") {
      closeCharacterModal();
    }

    // Close navigation menu
    const navMenu = document.getElementById("navMenu");
    const navToggle = document.getElementById("navToggle");

    if (navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  }

  // Space bar to play/pause video
  if (e.key === " " || e.code === "Space") {
    const videoOverlay = document.getElementById("videoPlayerOverlay");
    const video = document.getElementById("trialVideo");

    if (videoOverlay && videoOverlay.classList.contains("active")) {
      e.preventDefault(); // Prevent page scroll

      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  }

  // F key for fullscreen video
  if (e.key === "f" || e.key === "F") {
    const videoOverlay = document.getElementById("videoPlayerOverlay");
    const video = document.getElementById("trialVideo");

    if (videoOverlay && videoOverlay.classList.contains("active")) {
      e.preventDefault();

      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
  }
});
