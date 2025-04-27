
    
        // Sample cart items
        const cartItems = [
            { id: 1, name: 'Item 1', price: 20.00 },
            { id: 2, name: 'Item 2', price: 15.50 },
            { id: 3, name: 'Item 3', price: 30.00 }
        ];

        // Discount codes
        const discountCodes = {
            'SAVE10': 0.10, // 10% discount
            'SAVE20': 0.20  // 20% discount
        };

        // Render cart items
        const cartElement = document.getElementById('cart');
        const totalElement = document.getElementById('total');
        const messageElement = document.getElementById('message');

        let total = 0;

        function renderCart() {
            cartElement.innerHTML = '';
            total = 0;

            cartItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.textContent = `${item.name} - $${item.price.toFixed(2)}`;
                cartElement.appendChild(itemElement);
                total += item.price;
            });

            totalElement.textContent = total.toFixed(2);
        }

        // Apply discount
        document.getElementById('apply-discount').addEventListener('click', () => {
            const discountCode = document.getElementById('discount-code').value.trim().toUpperCase();

            if (discountCodes[discountCode]) {
                const discount = discountCodes[discountCode];
                const discountedTotal = total - (total * discount);
                totalElement.textContent = discountedTotal.toFixed(2);
                messageElement.textContent = `Discount applied: ${discount * 100}% off!`;
                messageElement.style.color = 'green';
            } else {
                messageElement.textContent = 'Invalid discount code.';
                messageElement.style.color = 'red';
            }
        });

        // Initialize cart
        renderCart();
