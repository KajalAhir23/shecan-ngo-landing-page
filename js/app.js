/* 
========================================================================
   SHE CAN FOUNDATION - APPLICATION JAVASCRIPT
   Description: Interactivity, theme control, stats count-up, modals, 
                form validation, and lightbox slide controls
========================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================
       1. PRELOADER & SCREEN LOADER
       ========================================== */
    const preloader = document.getElementById("preloader");
    
    window.addEventListener("load", () => {
        // Fade out preloader smoothly
        if (preloader) {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 600); // matches CSS opacity transition
        }
    });

    // Fallback: hide preloader after 3 seconds in case window load event fires slowly
    setTimeout(() => {
        if (preloader && preloader.style.display !== "none") {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 600);
        }
    }, 3000);


    /* ==========================================
       2. LIGHT/DARK THEME MANAGER
       ========================================== */
    const themeToggleBtn = document.getElementById("theme-toggle");
    const body = document.body;
    
    // Check local storage for preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("dark-theme");
    } else {
        body.classList.remove("dark-theme");
    }

    // Toggle click event
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            body.classList.toggle("dark-theme");
            
            // Save theme status in LocalStorage
            if (body.classList.contains("dark-theme")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
        });
    }


    /* ==========================================
       3. STICKY NAVBAR, PROGRESS BAR & MOBILE MENU
       ========================================== */
    const navbar = document.getElementById("main-navbar");
    const scrollProgress = document.getElementById("scroll-progress");
    const hamburger = document.getElementById("nav-hamburger");
    const navLinksMenu = document.getElementById("nav-links");
    const navItems = document.querySelectorAll(".nav-item");

    // Scroll updates: Sticky header, page progress, scroll-to-top
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // A. Sticky navbar state
        if (scrollTop > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // B. Top Scroll progress bar width
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + "%";
            
            // Update back-to-top circle stroke offset
            updateBackToTopProgress(scrollPercent);
        }

        // C. Show/hide back to top button
        if (scrollTop > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    // Mobile Hamburger Menu Action
    if (hamburger && navLinksMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinksMenu.classList.toggle("active");
        });
    }

    // Close menu when clicking navigation links (mobile)
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            if (hamburger && navLinksMenu) {
                hamburger.classList.remove("active");
                navLinksMenu.classList.remove("active");
            }
        });
    });


    /* ==========================================
       4. ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
       ========================================== */
    const sections = document.querySelectorAll("section");
    
    const highlightActiveNav = () => {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 150; // offset for nav height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navItems.forEach(item => {
            item.classList.remove("active");
            if (item.getAttribute("href") === `#${currentSectionId}`) {
                item.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", highlightActiveNav);


    /* ==========================================
       5. SCROLL-REVEAL SYSTEM (INTERSECTION OBSERVER)
       ========================================== */
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");
                observer.unobserve(entry.target); // trigger animation only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ==========================================
       6. STATISTICS COUNT-UP ANIMATION
       ========================================== */
    const statsSection = document.getElementById("stats-counter-section");
    const statNumbers = document.querySelectorAll(".stat-number");
    let statsAnimated = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target"), 10);
            const duration = 2000; // milliseconds
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic progress curve
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(easeProgress * target);

                stat.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target; // force absolute correct target
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateStats();
                    observer.unobserve(entry.target); // stop observing once triggered
                }
            });
        }, {
            threshold: 0.3
        });
        
        statsObserver.observe(statsSection);
    }


    /* ==========================================
       7. VOLUNTEER DIALOG MODAL & FORM VALIDATION
       ========================================== */
    const joinModal = document.getElementById("join-modal");
    const openModalBtn = document.getElementById("join-movement-btn");
    const openModalHeroBtn = document.getElementById("hero-btn-join");
    const closeModalBtn = document.getElementById("close-join-modal");
    const volunteerForm = document.getElementById("volunteer-registration-form");
    const volunteerSuccessBanner = document.getElementById("vol-success-banner");

    const openModal = () => {
        if (joinModal) {
            joinModal.showModal();
            body.style.overflow = "hidden"; // disable background scrolling
        }
    };

    const closeModal = () => {
        if (joinModal) {
            joinModal.close();
            body.style.overflow = ""; // enable scrolling back
            // reset form errors and banner
            if (volunteerForm) {
                volunteerForm.reset();
                const groups = volunteerForm.querySelectorAll(".form-group");
                groups.forEach(g => g.classList.remove("invalid"));
            }
            if (volunteerSuccessBanner) {
                volunteerSuccessBanner.classList.remove("show");
            }
        }
    };

    if (openModalBtn) openModalBtn.addEventListener("click", openModal);
    if (openModalHeroBtn) openModalHeroBtn.addEventListener("click", (e) => {
        e.preventDefault(); // prevent anchor click scrolling default
        openModal();
    });
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

    // Close modal when clicking on the backdrop area outside modal card
    if (joinModal) {
        joinModal.addEventListener("click", (e) => {
            const rect = joinModal.getBoundingClientRect();
            const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                                rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                closeModal();
            }
        });
    }

    // Validate email helper helper
    const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    // Generic form group validator
    const validateFormGroup = (input) => {
        const group = input.closest(".form-group");
        let isValid = true;
        
        if (input.required) {
            if (input.value.trim() === "") {
                isValid = false;
            }
        }

        if (isValid && input.type === "email") {
            isValid = isValidEmail(input.value);
        }

        if (!isValid) {
            group.classList.add("invalid");
        } else {
            group.classList.remove("invalid");
        }

        return isValid;
    };

    // Volunteer Form Submission
    if (volunteerForm) {
        volunteerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const inputs = volunteerForm.querySelectorAll(".form-input");
            let isFormValid = true;

            inputs.forEach(input => {
                const valid = validateFormGroup(input);
                if (!valid) isFormValid = false;
            });

            // Re-validate on input/change
            inputs.forEach(input => {
                const handler = () => validateFormGroup(input);
                input.addEventListener("input", handler);
                input.addEventListener("change", handler);
            });

            if (isFormValid) {
                volunteerSuccessBanner.classList.add("show");
                // Reset form input values but keep success shown
                setTimeout(() => {
                    volunteerForm.reset();
                    // Close after 2 seconds
                    setTimeout(() => {
                        closeModal();
                    }, 1000);
                }, 1500);
            }
        });
    }


    /* ==========================================
       8. CONTACT FORM HANDLER & NEWSLETTER
       ========================================== */
    const contactForm = document.getElementById("ngo-contact-form");
    const contactSuccessBanner = document.getElementById("form-success-banner");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const inputs = contactForm.querySelectorAll(".form-input");
            let isFormValid = true;

            inputs.forEach(input => {
                const valid = validateFormGroup(input);
                if (!valid) isFormValid = false;
            });

            // Add real-time validators
            inputs.forEach(input => {
                const handler = () => validateFormGroup(input);
                input.addEventListener("input", handler);
                input.addEventListener("change", handler);
            });

            if (isFormValid) {
                if (contactSuccessBanner) {
                    contactSuccessBanner.classList.add("show");
                }
                
                // Reset fields
                setTimeout(() => {
                    contactForm.reset();
                    // Remove values floating class triggers
                    inputs.forEach(input => {
                        input.blur();
                    });
                    setTimeout(() => {
                        contactSuccessBanner.classList.remove("show");
                    }, 4000);
                }, 1000);
            }
        });
    }

    // Newsletter Subscription Form
    const newsletterForm = document.getElementById("newsletter-email-form");
    const newsletterSuccess = document.getElementById("newsletter-success-msg");

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector(".newsletter-input");
            
            if (emailInput && isValidEmail(emailInput.value)) {
                newsletterSuccess.style.display = "block";
                emailInput.value = "";
                setTimeout(() => {
                    newsletterSuccess.style.display = "none";
                }, 3500);
            }
        });
    }


    /* ==========================================
       9. RESPONSIVE LIGHTBOX PORTFOLIO/GALLERY
       ========================================== */
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("gallery-lightbox");
    const lightboxImg = document.getElementById("lightbox-active-img");
    const lightboxCaption = document.getElementById("lightbox-active-caption");
    const prevBtn = lightbox?.querySelector(".lightbox-prev-btn");
    const nextBtn = lightbox?.querySelector(".lightbox-next-btn");
    
    let activeGalleryIndex = 0;
    const galleryData = [];

    // Collect info from page DOM
    galleryItems.forEach((item, index) => {
        const img = item.querySelector(".gallery-img");
        const cap = item.getAttribute("data-caption");
        galleryData.push({
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            caption: cap || img.getAttribute("alt")
        });

        item.addEventListener("click", () => {
            activeGalleryIndex = index;
            openLightbox();
        });
    });

    const openLightbox = () => {
        if (lightbox && lightboxImg && lightboxCaption) {
            updateLightboxContent();
            lightbox.showModal();
            body.style.overflow = "hidden"; // disable parent scroll
        }
    };

    const updateLightboxContent = () => {
        const item = galleryData[activeGalleryIndex];
        if (item && lightboxImg && lightboxCaption) {
            // Apply subtle animate reset by duplicating img nodes or modifying src
            lightboxImg.style.opacity = "0";
            setTimeout(() => {
                lightboxImg.setAttribute("src", item.src);
                lightboxImg.setAttribute("alt", item.alt);
                lightboxCaption.textContent = item.caption;
                lightboxImg.style.opacity = "1";
            }, 100);
        }
    };

    const closeLightbox = () => {
        if (lightbox) {
            lightbox.close();
            body.style.overflow = ""; // enable scrolling
        }
    };

    // Close button click
    const closeFormBtn = lightbox?.querySelector(".lightbox-close-btn");
    if (closeFormBtn) {
        closeFormBtn.addEventListener("click", (e) => {
            e.preventDefault();
            closeLightbox();
        });
    }

    // Modal click backdrop close
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Prev/Next handlers
    const navigatePrev = () => {
        activeGalleryIndex = (activeGalleryIndex - 1 + galleryData.length) % galleryData.length;
        updateLightboxContent();
    };

    const navigateNext = () => {
        activeGalleryIndex = (activeGalleryIndex + 1) % galleryData.length;
        updateLightboxContent();
    };

    if (prevBtn) prevBtn.addEventListener("click", navigatePrev);
    if (nextBtn) nextBtn.addEventListener("click", navigateNext);

    // Keyboard controls inside lightbox
    document.addEventListener("keydown", (e) => {
        if (lightbox && lightbox.open) {
            if (e.key === "ArrowLeft") {
                navigatePrev();
            } else if (e.key === "ArrowRight") {
                navigateNext();
            }
        }
    });


    /* ==========================================
       10. BACK TO TOP PROGRESS CIRCLE
       ========================================== */
    const backToTopBtn = document.getElementById("back-to-top");
    const progressPath = backToTopBtn?.querySelector("path");
    
    let pathLength = 0;
    if (progressPath) {
        pathLength = progressPath.getTotalLength();
        progressPath.style.transition = "stroke-dashoffset 10ms linear";
        progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        progressPath.style.strokeDashoffset = pathLength;
    }

    const updateBackToTopProgress = (percent) => {
        if (progressPath) {
            const offset = pathLength - (percent * pathLength) / 100;
            progressPath.style.strokeDashoffset = offset;
        }
    };

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

});
