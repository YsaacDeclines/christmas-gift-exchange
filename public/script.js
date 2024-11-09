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
                form.reset();
                fetchWishlist();
            } else {
                console.error('Failed to submit wishlist');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function fetchWishlist() {
        try {
            const response = await fetch('/api/wishlist');
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
        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchWishlist();
});