        // Mobile menu toggle
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            const navLinks = document.getElementById('nav-links');
            
            mobileMenu.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
            
            // Filter functionality
            const filterButtons = document.querySelectorAll('.filter-btn');
            const projectCards = document.querySelectorAll('.project-card');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    const filterValue = this.getAttribute('data-filter');
                    
                    // Filter projects
                    projectCards.forEach(card => {
                        if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                            card.style.display = 'flex';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 10);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
            
            // Add scroll animation to project cards
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            projectCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
            
            // Prevent horizontal scroll on mobile
            document.body.style.overflowX = 'hidden';

            // Initialize Three.js background
            initThreeScene();
        });

        // Three.js Scene
        function initThreeScene() {
            const canvas = document.getElementById("hero-canvas");
            if (!canvas || typeof THREE === 'undefined') {
                console.warn('Three.js or canvas not available');
                return;
            }
            
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );

            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
            });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Particles
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 5000;

            const posArray = new Float32Array(particlesCount * 3);
            const colorArray = new Float32Array(particlesCount * 3);

            for (let i = 0; i < particlesCount * 3; i += 3) {
                posArray[i] = (Math.random() - 0.5) * 100;
                posArray[i + 1] = (Math.random() - 0.5) * 100;
                posArray[i + 2] = (Math.random() - 0.5) * 100;

                colorArray[i] = Math.random();
                colorArray[i + 1] = Math.random();
                colorArray[i + 2] = Math.random();
            }

            particlesGeometry.setAttribute(
                "position",
                new THREE.BufferAttribute(posArray, 3)
            );
            particlesGeometry.setAttribute(
                "color",
                new THREE.BufferAttribute(colorArray, 3)
            );

            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.1,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true,
            });

            const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particlesMesh);

            camera.position.z = 10;

            let mouseX = 0;
            let mouseY = 0;

            document.addEventListener("mousemove", (event) => {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            });

            const clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);

                const elapsedTime = clock.getElapsedTime();

                const positions = particlesGeometry.attributes.position.array;
                for (let i = 0; i < particlesCount * 3; i += 3) {
                    positions[i] += Math.sin(elapsedTime + i) * 0.01;
                    positions[i + 1] += Math.cos(elapsedTime + i) * 0.01;
                }
                particlesGeometry.attributes.position.needsUpdate = true;

                camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
                camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
            }

            window.addEventListener("resize", () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            animate();
        }