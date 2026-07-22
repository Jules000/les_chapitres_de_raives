// script.js
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Countdown Logic ---
    const targetDate = new Date('August 21, 2026 15:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const countdownContainer = document.getElementById('countdown-container');
        if (!countdownContainer) return;

        if (distance < 0) {
            countdownContainer.innerHTML = '<div class="text-primary font-headline-md">Le jour J est arrivé !</div>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-minutes');
        const sEl = document.getElementById('cd-seconds');

        if(dEl) dEl.innerText = String(days).padStart(2, '0');
        if(hEl) hEl.innerText = String(hours).padStart(2, '0');
        if(mEl) mEl.innerText = String(minutes).padStart(2, '0');
        if(sEl) sEl.innerText = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --- Scroll Reveal Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove fade-in prep classes
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                // For countdown items
                entry.target.classList.add('opacity-100', 'translate-y-0');
                
                // For general reveal elements
                entry.target.classList.add('is-revealed');
                
                observer.unobserve(entry.target);
            }
        
    // --- Internationalization (i18n) ---
    const savedLang = localStorage.getItem('site_lang') || 'fr';
    let currentLang = savedLang;

    function setLanguage(lang) {
        if (!translations || !translations[lang]) return;
        currentLang = lang;
        document.documentElement.lang = lang;
        localStorage.setItem('site_lang', lang);

        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Update buttons state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.id === 'lang-' + lang) {
                btn.classList.add('text-primary', 'font-bold');
                btn.classList.remove('text-on-surface-variant');
            } else {
                btn.classList.remove('text-primary', 'font-bold');
                btn.classList.add('text-on-surface-variant');
            }
        });
    }

    // Init language
    if(typeof translations !== 'undefined') {
        setLanguage(currentLang);
    }

    // Attach events
    document.querySelectorAll('#lang-fr').forEach(btn => {
        btn.addEventListener('click', () => setLanguage('fr'));
    });
    document.querySelectorAll('#lang-en').forEach(btn => {
        btn.addEventListener('click', () => setLanguage('en'));
    });

});
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.countdown-item, .reveal-element').forEach(item => {
        observer.observe(item);
    });

    // --- Sticky Nav & Parallax ---
    let lastScroll = 0;
    const header = document.getElementById('main-header');
    const parallaxContainer = document.getElementById('hero-parallax-container');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (header) {
            // Sticky Nav Logic
            if (currentScroll > lastScroll && currentScroll > 50) {
                // Scrolling down
                header.classList.add('-translate-y-full');
            } else {
                // Scrolling up
                header.classList.remove('-translate-y-full');
            }

            if (currentScroll > 10) {
                header.classList.remove('bg-transparent', 'border-transparent', 'shadow-none');
                header.classList.add('bg-surface/90', 'backdrop-blur-md', 'shadow-sm', 'border-outline-variant/30');
            } else {
                header.classList.add('bg-transparent', 'border-transparent', 'shadow-none');
                header.classList.remove('bg-surface/90', 'backdrop-blur-md', 'shadow-sm', 'border-outline-variant/30');
            }
        }
        
        lastScroll = currentScroll;

        // Subtle Parallax Effect
        if (parallaxContainer) {
            parallaxContainer.style.transform = `translateY(${currentScroll * 0.3}px)`;
        }
    });
    
    // Trigger scroll event once to set initial state
    window.dispatchEvent(new Event('scroll'));

    // --- Confetti Logic ---
    function fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#c09d55', '#e8c175', '#ffffff', '#954552']; // Gold, light gold, white, burgundy

        for (let i = 0; i < 100; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2 + 100, // Origin from the envelope
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 1) * 20 - 5,
                size: Math.random() * 5 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }

        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // gravity
                p.rotation += p.rotationSpeed;
                
                if (p.y < canvas.height) active = true;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                ctx.restore();
            });

            if (active) {
                requestAnimationFrame(animateConfetti);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        
        animateConfetti();
    }

    // --- RSVP Envelope Animation ---
    const seal = document.getElementById('wax-seal');
    const openBtn = document.getElementById('open-envelope-btn');
    const flap = document.getElementById('envelope-flap');
    const innerCard = document.getElementById('inner-card');
    const cardContent = document.getElementById('card-content');
    const introScreen = document.getElementById('intro-screen');
    const mainSite = document.getElementById('main-site');
    const textTop = document.getElementById('intro-text-top');
    const textBottom = document.getElementById('intro-text-bottom');

    let isEnvelopeOpen = false;

    function openEnvelope() {
        if (isEnvelopeOpen) return;
        isEnvelopeOpen = true;

        // 1. Seal glows and fades, and hide button
        seal.classList.add('glow');
        if(textTop) textTop.style.opacity = '0';
        if(textBottom) textBottom.style.opacity = '0';
        if(openBtn) {
            openBtn.style.opacity = '0';
            openBtn.style.pointerEvents = 'none';
        }

        // 2. Flap opens
        setTimeout(() => {
            flap.classList.add('open');
            fireConfetti();
        }, 400);

        // 3. Card slides up & text fades in
        setTimeout(() => {
            innerCard.classList.add('slide-up');
            cardContent.classList.remove('opacity-0');
            cardContent.classList.add('opacity-100');
        }, 1000);

        // 4. Card expands to center of screen
        setTimeout(() => {
            innerCard.classList.add('expand');
        }, 3000); // Give time after slide up

        // 5. Fade out and transition to main site
        setTimeout(() => {
            innerCard.classList.add('fade-out');
            setTimeout(() => {
                introScreen.classList.add('hidden-intro');
                mainSite.classList.add('visible');
                document.body.classList.remove('overflow-hidden'); // Allow scrolling
            }, 1000);
        }, 7000); // Stay on screen for 4 seconds so the user can read the card
    }

    if(seal) {
        seal.addEventListener('click', openEnvelope);
    }
    if(openBtn) {
        openBtn.addEventListener('click', openEnvelope);
    }

    // --- RSVP Form Submission ---
    const form = document.getElementById('rsvp-form');
    const rsvpSection = document.getElementById('rsvp-section');
    const successSection = document.getElementById('success-section');
    const sendingOverlay = document.getElementById('sending-overlay');
    const errorOverlay = document.getElementById('error-overlay');
    const retryBtn = document.getElementById('retry-btn');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            sendingOverlay.classList.remove('hidden');
            requestAnimationFrame(() => {
                sendingOverlay.style.opacity = '1';
            });

            // Simulate network request
            setTimeout(() => {
                const isSuccess = true; // Always succeed for demonstration

                if (isSuccess) {
                    rsvpSection.style.opacity = '0';
                    
                    setTimeout(() => {
                        rsvpSection.classList.add('hidden');
                        successSection.classList.remove('hidden');
                        
                        requestAnimationFrame(() => {
                            successSection.style.opacity = '1';
                            successSection.classList.add('success-active');
                        });
                    }, 500);
                } else {
                    sendingOverlay.style.opacity = '0';
                    setTimeout(() => {
                        sendingOverlay.classList.add('hidden');
                        errorOverlay.classList.remove('hidden');
                        requestAnimationFrame(() => {
                            errorOverlay.style.opacity = '1';
                        });
                    }, 300);
                }
                
            }, 2000);
        });
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            errorOverlay.style.opacity = '0';
            setTimeout(() => {
                errorOverlay.classList.add('hidden');
            }, 300);
        });
    }

    // --- Smooth Scrolling for Navigation Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- ScrollSpy for Navigation ---
    const sections = document.querySelectorAll('.section-spy');
    const navLinks = document.querySelectorAll('.nav-link');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let id = entry.target.getAttribute('id');
                // Highlight corresponding nav links
                navLinks.forEach(link => {
                    link.classList.remove('text-primary', 'bg-surface-variant', 'bg-primary-container', 'text-on-primary-container');
                    
                    // Specific logic based on if it's mobile or desktop
                    if (link.closest('#mobile-nav-list')) {
                        link.classList.remove('text-primary');
                        link.classList.add('text-on-surface-variant');
                        
                        // Icon specific logic for mobile
                        const icon = link.querySelector('.material-symbols-outlined');
                        if(icon) icon.style.fontVariationSettings = "'FILL' 0";
                    } else if (link.closest('#desktop-nav-list')) {
                        link.classList.remove('bg-primary-container', 'text-on-primary-container', 'text-primary', 'bg-surface-variant');
                        link.classList.add('text-on-surface-variant');
                        
                        const icon = link.querySelector('.material-symbols-outlined');
                        if(icon) icon.style.fontVariationSettings = "'FILL' 0";
                    }

                    if (link.getAttribute('href') === `#${id}`) {
                        if (link.closest('#mobile-nav-list')) {
                            link.classList.remove('text-on-surface-variant');
                            link.classList.add('text-primary');
                            const icon = link.querySelector('.material-symbols-outlined');
                            if(icon) icon.style.fontVariationSettings = "'FILL' 1";
                        } else if (link.closest('#desktop-nav-list')) {
                            link.classList.remove('text-on-surface-variant');
                            link.classList.add('bg-primary-container', 'text-on-primary-container');
                            const icon = link.querySelector('.material-symbols-outlined');
                            if(icon) icon.style.fontVariationSettings = "'FILL' 1";
                        }
                    }
                });
            }
        });
    }, {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: "-20% 0px -20% 0px"
    });

    sections.forEach(sec => spyObserver.observe(sec));

    // --- Internationalization (i18n) ---
    const savedLang = localStorage.getItem('site_lang') || 'fr';
    let currentLang = savedLang;

    function setLanguage(lang) {
        if (!translations || !translations[lang]) return;
        currentLang = lang;
        document.documentElement.lang = lang;
        localStorage.setItem('site_lang', lang);

        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Update buttons state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.id === 'lang-' + lang) {
                btn.classList.add('text-primary', 'font-bold');
                btn.classList.remove('text-on-surface-variant');
            } else {
                btn.classList.remove('text-primary', 'font-bold');
                btn.classList.add('text-on-surface-variant');
            }
        });
    }

    // Init language
    if(typeof translations !== 'undefined') {
        setLanguage(currentLang);
    }

    // Attach events
    document.querySelectorAll('#lang-fr').forEach(btn => {
        btn.addEventListener('click', () => setLanguage('fr'));
    });
    document.querySelectorAll('#lang-en').forEach(btn => {
        btn.addEventListener('click', () => setLanguage('en'));
    });


    // Background Music Logic
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    let isMusicPlaying = false;

    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicIcon.textContent = 'music_off';
                isMusicPlaying = false;
            } else {
                bgMusic.play();
                musicIcon.textContent = 'volume_up';
                isMusicPlaying = true;
            }
        });
    }

    // Try to play music when envelope is opened
    // Use the already defined openBtn if possible, or query it manually without redefining
    const envelopeBtnForMusic = document.getElementById('open-envelope-btn');
    if (envelopeBtnForMusic) {
        envelopeBtnForMusic.addEventListener('click', () => {
            if (bgMusic && musicToggle) {
                musicToggle.classList.remove('hidden');
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicIcon.textContent = 'volume_up';
                }).catch((e) => {
                    console.log("Autoplay prevented:", e);
                    isMusicPlaying = false;
                    musicIcon.textContent = 'music_off';
                });
            }
        });
    }

});