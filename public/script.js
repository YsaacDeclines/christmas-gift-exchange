document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('wishlistForm');
    const wishlistContainer = document.getElementById('wishlistContainer');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const lightModeIcon = document.getElementById('lightModeIcon');
    const developerInfo = document.getElementById('developerInfo');
    const developerName = document.getElementById('developerName');
    const developerImage = document.getElementById('developerImage');
    const modelContainer = document.getElementById('modelContainer');

    let darkMode = false;
    let scene, camera, renderer, model;

    function createSnowflakes() {
        const numberOfSnowflakes = 50;
        for (let i = 0; i < numberOfSnowflakes; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = '❄';
            snowflake.style.left = `${Math.random() * 100}vw`;
            snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
            snowflake.style.animationDelay = `${Math.random() * 2}s`;
            snowflake.dataset.speed = Math.random() * 0.5 + 0.1;
            document.body.appendChild(snowflake);
        }
    }

    function moveSnowflakes(e) {
        const snowflakes = document.querySelectorAll('.snowflake');
        snowflakes.forEach((flake) => {
            const speed = flake.dataset.speed;
            const x = (e.clientX * speed) / 100;
            const y = (e.clientY * speed) / 100;
            flake.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    function toggleDarkMode() {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        document.body.classList.toggle('light-mode', !darkMode);
        darkModeIcon.style.display = darkMode ? 'none' : 'inline';
        lightModeIcon.style.display = darkMode ? 'inline' : 'none';
    }

    async function fetchWishlist() {
        try {
            const response = await fetch('/api/wishlist');
            if (response.ok) {
                const wishlistItems = await response.json();
                wishlistContainer.innerHTML = '';
                wishlistItems.forEach(item => {
                    const wishlistItem = document.createElement('div');
                    wishlistItem.classList.add('wishlist-item');
                    wishlistItem.innerHTML = `
                        <h3>${item.codename}</h3>
                        <p>${item.wishlist}</p>
                    `;
                    wishlistContainer.appendChild(wishlistItem);
                });
            } else {
                console.error('Failed to fetch wishlist');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const codename = document.getElementById('codename').value;
        const wishlist = document.getElementById('wishlist').value;

        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codename, wishlist }),
            });

            if (response.ok) {
                form.reset();
                fetchWishlist();
            } else {
                console.error('Failed to submit wishlist');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    darkModeToggle.addEventListener('click', toggleDarkMode);
    window.addEventListener('mousemove', moveSnowflakes);

    developerInfo.addEventListener('mouseenter', () => {
        developerName.classList.remove('hidden');
    });

    developerInfo.addEventListener('mouseleave', () => {
        developerName.classList.add('hidden');
    });

    function initThreeJS() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        modelContainer.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        camera.position.z = 5;
    }

    function loadModel() {
        const loader = new THREE.GLTFLoader();
        loader.load(
            'your_model.glb',
            (gltf) => {
                model = gltf.scene;
                scene.add(model);
                animateModel();
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error happened', error);
            }
        );
    }

    function animateModel() {
        requestAnimationFrame(animateModel);

        if (model) {
            model.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
    }

    developerImage.addEventListener('click', () => {
        modelContainer.classList.add('active');
        if (!scene) {
            initThreeJS();
            loadModel();
        }
    });

    modelContainer.addEventListener('click', () => {
        modelContainer.classList.remove('active');
    });

    window.addEventListener('resize', () => {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    });

    createSnowflakes();
    fetchWishlist();
    document.body.classList.add('light-mode');
});
