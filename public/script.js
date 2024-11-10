document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('wishlistForm');
    const wishlistContainer = document.getElementById('wishlistContainer');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const lightModeIcon = document.getElementById('lightModeIcon');

    let darkMode = false;

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

    createSnowflakes();
    fetchWishlist();
    document.body.classList.add('light-mode');
});
