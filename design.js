// =============================================
// PORTFOLIO WEBSITE – FULL INTERACTIVITY (with Dark/Light Mode)
// =============================================

document.addEventListener('DOMContentLoaded', function() {

    // ---------- 0. DARK / LIGHT MODE TOGGLE ----------
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        root.setAttribute('data-theme', 'light');
    } else {
        root.setAttribute('data-theme', 'dark');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ---------- 1. MOBILE NAVIGATION TOGGLE ----------
    const hamburger = document.getElementById('menu-toggle');
    const mobileMenu = document.querySelector('header nav');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !expanded);
            document.body.style.overflow = !expanded ? 'hidden' : '';
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ---------- 2. SMOOTH SCROLL (with header offset) ----------
    const navHeight = () => {
        const header = document.querySelector('header');
        return header ? header.offsetHeight + 20 : 90;
    };
    const allInternalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    allInternalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offset = navHeight();
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
                history.pushState(null, null, targetId);
            }
        });
    });
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const offset = navHeight();
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - offset,
                    behavior: 'smooth'
                });
            }
        }, 300);
    }

    // ---------- 3. ACTIVE NAV HIGHLIGHT ON SCROLL ----------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    function highlightActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight() - 10;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        // Handle page bottom scroll edge case
        const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 5;
        if (isAtBottom && sections.length > 0) {
            current = sections[sections.length - 1].getAttribute('id');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink();

    // ---------- 4. TYPING TEXT ROTATOR (NO BLINK) ----------
    const typingSpan = document.querySelector('.typing-text span');
    if (typingSpan) {
        const roles = [
            "Web Developer",
            "UI/UX Designer",
            "App Developer",
            "Data Analyst",
            "Blogger"
        ];
        let index = 0;
        typingSpan.textContent = roles[0];
        setInterval(() => {
            index = (index + 1) % roles.length;
            typingSpan.textContent = roles[index];
        }, 2500);
    }


    // ---------- 6. ANIMATED STATS COUNTERS ----------
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length) {
        const animateNumber = (element) => {
            const raw = element.innerText.trim();
            const target = parseInt(raw, 10);
            if (isNaN(target)) return; // e.g. "BEST" — left untouched
            const suffix = raw.replace(/^\d+/, ''); // captures "%", "hr", "+" etc.
            let current = 0;
            const increment = target / 40;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.innerText = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    element.innerText = target + suffix;
                }
            };
            updateCounter();
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(stat => observer.observe(stat));
    }

    // ---------- 7. DYNAMIC GOOGLE FORM PRE‑FILL FOR PRICING BUTTONS ----------
    const PLAN_ENTRY_ID = '546913836'; // 👈 Replace with your actual entry ID
    const FORM_BASE_URL = 'https://docs.google.com/forms/d/1XxNe5_WG-wAanO6U07uIXiYTBlBRsB-J5b52zIYjQcg/viewform';
    
    const getStartedButtons = document.querySelectorAll('.pricing-card .btn');
    getStartedButtons.forEach(button => {
        const href = button.getAttribute('href');
        if (href && (href === '#' || href === '#contact' || href.includes('docs.google.com/forms'))) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const planCard = this.closest('.pricing-card');
                let plan = '';
                if (planCard) {
                    const planNameElement = planCard.querySelector('.plan-badge');
                    if (planNameElement) {
                        plan = planNameElement.textContent.trim().replace('Most popular', '').trim();
                    }
                }
                if (!plan) plan = 'Not sure';
                const prefilledUrl = `${FORM_BASE_URL}?usp=pp_url&entry.${PLAN_ENTRY_ID}=${encodeURIComponent(plan)}`;
                window.open(prefilledUrl, '_blank');
            });
        }
    });

    // ---------- 8. FIX FOR MOBILE VH ----------
    const setVH = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', setVH);
    setVH();

});