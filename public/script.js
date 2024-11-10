document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('wishlistForm');
    const wishlistContainer = document.getElementById('wishlistContainer');

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
                const result = await response.json();
                console.log(result.message);
                form.reset();
                fetchWishlist();
            } else {
                const errorData = await response.json();
                console.error('Failed to submit wishlist:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

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

    fetchWishlist();

    // Test database connection
    fetch('/test-db')
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Database test failed:', error));
});
