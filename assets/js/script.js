// Intro Animation
window.addEventListener('load', () => {
    const introOverlay = document.getElementById('intro-overlay');
    // Wait for animation to finish (approx 3s total)
    setTimeout(() => {
        introOverlay.classList.add('fade-out');
        // Enable body scroll if we disabled it (optional, but good practice)
        document.body.style.overflow = 'auto';
    }, 3000);
});

// Initialize AOS
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Navigation & Hamburger Menu
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const header = document.querySelector("header");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

navLinks.forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Header Scroll Effect
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    // Active Link Highlight
    let current = "";
    const sections = document.querySelectorAll("section");

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});

// Theme Switcher
// Theme Switcher
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const themeLabel = document.querySelector('.theme-switch');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        toggleSwitch.checked = true;
    }
}

// Store click coordinates for animation origin
let switchX = window.innerWidth / 2;
let switchY = window.innerHeight / 2;

if (themeLabel) {
    themeLabel.addEventListener('click', (e) => {
        switchX = e.clientX;
        switchY = e.clientY;
    });
}

function switchTheme(e) {
    const isLight = e.target.checked;
    const theme = isLight ? 'light' : 'dark';

    // Fallback for browsers without View Transitions
    if (!document.startViewTransition) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        return;
    }

    const transition = document.startViewTransition(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    transition.ready.then(() => {
        const endRadius = Math.hypot(
            Math.max(switchX, innerWidth - switchX),
            Math.max(switchY, innerHeight - switchY)
        );

        const clipPath = [
            `circle(0px at ${switchX}px ${switchY}px)`,
            `circle(${endRadius}px at ${switchX}px ${switchY}px)`
        ];

        document.documentElement.animate(
            {
                clipPath: clipPath,
            },
            {
                duration: 500,
                easing: 'ease-in',
                pseudoElement: '::view-transition-new(root)',
            }
        );
    });
}

toggleSwitch.addEventListener('change', switchTheme);

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 200);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 200);
            }
        });
    });
});

// Image Modal
const modal = document.getElementById("img-modal");
const modalImg = document.getElementById("img01");
const captionText = document.getElementById("caption");
const zoomBtns = document.querySelectorAll(".project-zoom");
const closeBtn = document.getElementsByClassName("close")[0];

function openModal(imgSrc, title) {
    modal.style.display = "flex";
    modalImg.src = imgSrc;
    captionText.innerHTML = title;
    // Small timeout to allow display:flex to apply before adding opacity class
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
}

function closeModal() {
    modal.classList.remove("show");
    // Wait for transition to finish before hiding
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

zoomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.project-card');
        const img = card.querySelector('img');
        const title = card.querySelector('h3').innerText;
        openModal(img.src, title);
    });
});

closeBtn.onclick = function () {
    closeModal();
}

modal.onclick = function (e) {
    if (e.target === modal) {
        closeModal();
    }
}

// Canvas Background Animation (Particles)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Check particle position, check mouse position, move the particle, draw the particle
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    // Reduce particles on mobile for better performance
    const isMobile = window.innerWidth < 768;
    let numberOfParticles = isMobile
        ? (canvas.height * canvas.width) / 20000
        : (canvas.height * canvas.width) / 9000;

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * (canvas.width - size * 2)) + size;
        let y = (Math.random() * (canvas.height - size * 2)) + size;
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = 'rgba(0, 191, 201, 0.3)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(0, 191, 201,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Also handle orientation change on mobile
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    }, 100);
});

init();
animate();

// Contact Form Handling (Prevent Default)
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    // Here you would typically send the data to a server
    // For now, let's just show an alert or console log
    const btn = this.querySelector('button');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span>Sent!</span> <i class="fa-solid fa-check"></i>';
    btn.style.background = '#10b981';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        this.reset();
    }, 3000);
});

// Typing Text Effect
const typingText = document.querySelector('.typing-text');
const words = ["Creative Developer", "UI/UX Designer", "Tech Enthusiast", "Problem Solver"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2000); // Wait before deleting
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500); // Wait before typing next word
    } else {
        setTimeout(type, isDeleting ? 100 : 200);
    }
}

// Start typing effect
document.addEventListener('DOMContentLoaded', type);

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    document.getElementById('scroll-progress').style.width = scrolled + "%";
});

// 3D Tilt Effect for Cards
const cards = document.querySelectorAll('.project-card, .skill-card, .service-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Increased multiplier for more visible effect
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        // Disable transition during movement for instant response
        card.style.transition = 'none';
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        // Re-enable transition for smooth reset
        card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
    } else {
        backToTopBtn.classList.remove('active');
    }
});

backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Custom Cursor Logic
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

// Check if device has fine pointer (mouse)
if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with animation (using animate for performance)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, label, .project-card, .skill-card, .service-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
} else {
    // Hide custom cursor on touch devices
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
}

// Animate Skills Progress Bars on Scroll
const skillsProgressSection = document.querySelector('.skills-progress-section');

if (skillsProgressSection) {
    const progressBars = document.querySelectorAll('.progress-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate all progress bars
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-progress');
                    // Use setTimeout to create a staggered effect
                    setTimeout(() => {
                        bar.style.width = targetWidth + '%';
                    }, 200);
                });
                // Stop observing after animation starts
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3 // Trigger when 30% of element is visible
    });

    observer.observe(skillsProgressSection);
}

// Testimonials Carousel
const testimonialWrapper = document.querySelector('.testimonial-wrapper');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dotsContainer = document.querySelector('.slider-dots');

if (testimonialWrapper && testimonialCards.length > 0) {
    let currentSlide = 0;
    const totalSlides = testimonialCards.length;
    let autoSlideInterval;

    // Create dots
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        if (currentSlide >= totalSlides) currentSlide = 0;

        testimonialWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
        resetAutoSlide();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Pause on hover
    testimonialWrapper.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    testimonialWrapper.addEventListener('mouseleave', startAutoSlide);

    // Initialize
    startAutoSlide();
}

// Multi-Language System
const translations = {
    id: {
        // Navigation
        'nav.home': 'Beranda',
        'nav.about': 'Tentang',
        'nav.skills': 'Keahlian',
        'nav.projects': 'Proyek',
        'nav.contact': 'Kontak',

        // Hero Section
        'hero.greeting': "Halo, Saya",
        'hero.subtitle': "Mahasiswa di <strong>Universitas STEKOM</strong> & ",
        'hero.description': "Saya membangun pengalaman web yang mudah diakses, pixel-perfect, dan berkinerja tinggi. Passionate tentang desain UI/UX dan mewujudkan ide dengan kode.",
        'hero.hire': "Rekrut Saya",
        'hero.download': "Unduh CV",

        // Section Headers
        'section.about.subtitle': "Siapa Saya",
        'section.about.title': "Tentang <span class='highlight'>Saya</span>",
        'section.skills.subtitle': "Keahlian Saya",
        'section.skills.title': "Keahlian <span class='highlight'>Saya</span>",
        'section.services.subtitle': "Yang Saya Tawarkan",
        'section.services.title': "<span class='highlight'>Layanan</span> Saya",
        'section.projects.subtitle': "Portofolio Saya",
        'section.projects.title': "Karya <span class='highlight'>Terbaru</span>",
        'section.contact.subtitle': "Hubungi Saya",
        'section.contact.title': "<span class='highlight'>Kontak</span> Saya",

        // Testimonials
        'section.testimonials.subtitle': "Testimoni",
        'section.testimonials.title': "Apa Kata <span class='highlight'>Mereka</span>",

        // Skills Progress
        'skills.technical': "Kemampuan Teknis",

        // Contact
        'contact.email': "Email",
        'contact.whatsapp': "WhatsApp",
        'contact.location': "Lokasi",
        'contact.form.name': "Nama",
        'contact.form.email': "Email",
        'contact.form.message': "Pesan",
        'contact.form.send': "Kirim Pesan"
    },
    en: {
        // Navigation  
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.skills': 'Skills',
        'nav.projects': 'Projects',
        'nav.contact': 'Contact',

        // Hero Section
        'hero.greeting': "Hello, I'm",
        'hero.subtitle': "Student at <strong>STEKOM University</strong> & ",
        'hero.description': "I build accessible, pixel-perfect, and performant web experiences. Passionate about UI/UX design and bringing ideas to life with code.",
        'hero.hire': "Hire Me",
        'hero.download': "Download CV",

        // Section Headers
        'section.about.subtitle': "Who I Am",
        'section.about.title': "About <span class='highlight'>Me</span>",
        'section.skills.subtitle': "My Expertise",
        'section.skills.title': "My <span class='highlight'>Skills</span>",
        'section.services.subtitle': "What I Offer",
        'section.services.title': "My <span class='highlight'>Services</span>",
        'section.projects.subtitle': "My Portfolio",
        'section.projects.title': "Recent <span class='highlight'>Works</span>",
        'section.contact.subtitle': "Get In Touch",
        'section.contact.title': "Contact <span class='highlight'>Me</span>",

        // Testimonials
        'section.testimonials.subtitle': "Testimonials",
        'section.testimonials.title': "What People <span class='highlight'>Say</span>",

        // Skills Progress
        'skills.technical': "Technical Proficiency",

        // Contact
        'contact.email': "Email",
        'contact.whatsapp': "WhatsApp",
        'contact.location': "Location",
        'contact.form.name': "Name",
        'contact.form.email': "Email",
        'contact.form.message': "Message",
        'contact.form.send': "Send Message"
    }
};
// Language Switcher Logic
const langButtons = document.querySelectorAll('.lang-btn');
const currentLang = localStorage.getItem('language') || 'id';

// Set initial language
setLanguage(currentLang);

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
        localStorage.setItem('language', lang);

        // Update active state
        langButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

function setLanguage(lang) {
    const elements = {
        // Navigation (Target span inside anchor)
        'nav.home': document.querySelector('a[href="#home"] span'),
        'nav.about': document.querySelector('a[href="#about"] span'),
        'nav.skills': document.querySelector('a[href="#skills"] span'),
        'nav.projects': document.querySelector('a[href="#projects"] span'),
        'nav.contact': document.querySelector('a[href="#contact"] span'),

        // Hero
        'hero.greeting': document.querySelector('.greeting'),
        'hero.subtitle': document.querySelector('.static-subtitle'),
        'hero.description': document.querySelector('.hero-description'),
        'hero.hire': document.querySelector('.btn-primary span'),
        'hero.download': document.querySelector('.btn-outline span'),

        // Section Headers
        'section.about.subtitle': document.querySelector('#about .section-subtitle'),
        'section.about.title': document.querySelector('#about .section-title'),
        'section.skills.subtitle': document.querySelector('#skills .section-subtitle'),
        'section.skills.title': document.querySelector('#skills .section-title'),
        'skills.technical': document.querySelector('.progress-title'),
        'section.services.subtitle': document.querySelector('#services .section-subtitle'),
        'section.services.title': document.querySelector('#services .section-title'),
        'section.projects.subtitle': document.querySelector('#projects .section-subtitle'),
        'section.projects.title': document.querySelector('#projects .section-title'),
        'section.contact.subtitle': document.querySelector('#contact .section-subtitle'),
        'section.contact.title': document.querySelector('#contact .section-title'),

        // Testimonials
        'section.testimonials.subtitle': document.querySelector('#testimonials .section-subtitle'),
        'section.testimonials.title': document.querySelector('#testimonials .section-title'),

        // Contact Form
        'contact.form.send': document.querySelector('#contact-form button span')
    };

    // Update all elements
    Object.keys(elements).forEach(key => {
        if (elements[key] && translations[lang][key]) {
            elements[key].innerHTML = translations[lang][key];
        }
    });

    // Update active button state
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Sound Effects Manager
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'hover') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime); // Lower volume
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'click') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'theme') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }
}

// Attach sounds to elements
document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .testimonial-card, input, textarea');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
        el.addEventListener('click', () => playSound('click'));
    });

    // Attach sound to theme switch
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', () => playSound('theme'));
    }
});
