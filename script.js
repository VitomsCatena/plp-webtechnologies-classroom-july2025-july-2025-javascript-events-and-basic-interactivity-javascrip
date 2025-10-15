// --- State and Data Definition ---
        const menuData = [
            { id: 1, name: "Seasonal Tartare", category: "Starters", price: 18.00, description: "Freshly prepared with capers, shallots, and house aioli." },
            { id: 3, name: "French Onion Soup", category: "Starters", price: 14.00, description: "Classic broth, caramelized onions, topped with Gruyère cheese." },
            { id: 5, name: "Wagyu Steak Frites", category: "Mains", price: 55.00, description: "8oz American Wagyu, herb butter, and fresh-cut fries." },
            { id: 6, name: "Mushroom Ravioli", category: "Mains", price: 26.00, description: "Hand-made pasta with a forest mushroom cream sauce." },
            { id: 8, name: "Chocolate Lava Cake", category: "Desserts", price: 15.00, description: "Warm center, vanilla bean ice cream, and raspberry dust." },
            { id: 9, name: "Crème Brûlée", category: "Desserts", price: 13.00, description: "Vanilla custard base with a hard caramel top." },
        ];

        let cart = []; 

        // --- Dynamic Tabbed Menu Logic ---
        window.changeCategory = function(category) {
            const menuContainer = document.getElementById('menu-items-container');
            const tabButtons = document.querySelectorAll('.menu-tab');

            // Update Tab Styling
            tabButtons.forEach(btn => {
                const isSelected = btn.dataset.category === category;
                btn.classList.toggle('text-black', isSelected);
                btn.classList.toggle('border-indigo-600', isSelected);
                btn.classList.toggle('text-gray-500', !isSelected);
                btn.classList.toggle('border-transparent', !isSelected);
            });

            // Filter and Render Menu Items
            const filteredItems = menuData.filter(item => item.category === category);
            menuContainer.innerHTML = ''; // Clear existing content

            if (filteredItems.length === 0) {
                menuContainer.innerHTML = '<p class="text-center text-gray-500 py-10">Nothing here yet! Check back soon.</p>';
                return;
            }

            filteredItems.forEach(item => {
                const itemHtml = `
                    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="text-xl font-semibold text-gray-800">${item.name}</h3>
                                <span class="text-lg font-bold text-indigo-600">$${item.price.toFixed(2)}</span>
                            </div>
                            <p class="text-sm text-gray-500 mb-4">${item.description}</p>
                        </div>
                        <button onclick="addToCart(${item.id})" 
                                class="add-to-cart-btn w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
                            Add to Order
                        </button>
                    </div>
                `;
                menuContainer.innerHTML += itemHtml;
            });
        }

        // --- Live Order Cart Management Logic ---
        window.addToCart = function(itemId) {
            const item = menuData.find(i => i.id === itemId);
            if (!item) return;

            const existingCartItem = cart.find(i => i.id === itemId);

            if (existingCartItem) {
                existingCartItem.quantity += 1;
            } else {
                cart.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1
                });
            }
            renderCart(); 
        }

        window.removeFromCart = function(itemId, removeAll = false) {
            const itemIndex = cart.findIndex(i => i.id === itemId);
            if (itemIndex === -1) return;

            if (removeAll || cart[itemIndex].quantity === 1) {
                cart.splice(itemIndex, 1); 
            } else {
                cart[itemIndex].quantity -= 1; 
            }

            renderCart(); 
        }

        function renderCart() {
            const cartContainer = document.getElementById('order-cart-items');
            const cartTotalElement = document.getElementById('cart-total');
            const cartCountElement = document.getElementById('cart-count');
            
            cartContainer.innerHTML = ''; 
            let total = 0;
            let totalItems = 0;

            if (cart.length === 0) {
                cartContainer.innerHTML = '<p class="text-center text-gray-500 py-8">Your cart is empty. Start adding items!</p>';
            }

            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                totalItems += item.quantity;
                
                const itemHtml = `
                    <div class="flex items-center justify-between py-2 border-b border-gray-100">
                        <div class="flex-1 pr-2">
                            <p class="font-medium text-gray-800">${item.name}</p>
                            <span class="text-sm text-gray-500">$${item.price.toFixed(2)} x ${item.quantity}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="removeFromCart(${item.id}, false)" class="text-indigo-600 hover:text-indigo-800 text-xl font-bold p-1 leading-none" aria-label="Decrease quantity">-</button>
                            <p class="w-6 text-center text-gray-800">${item.quantity}</p>
                            <button onclick="addToCart(${item.id})" class="text-indigo-600 hover:text-indigo-800 text-xl font-bold p-1 leading-none" aria-label="Increase quantity">+</button>
                        </div>
                        <span class="font-bold w-16 text-right">$${subtotal.toFixed(2)}</span>
                    </div>
                `;
                cartContainer.innerHTML += itemHtml;
            });
            
            cartTotalElement.textContent = total.toFixed(2);
            cartCountElement.textContent = totalItems;
        }

        // --- Custom Form Validation Logic (Replacing standard alert/confirm) ---
        window.validateContactForm = function(event) {
            event.preventDefault(); 
            
            const name = document.getElementById('reservation-name').value.trim();
            const email = document.getElementById('reservation-email').value.trim();
            const formFeedback = document.getElementById('form-feedback');
            
            formFeedback.classList.add('hidden'); 
            
            // Validation 1: Check Name Length
            if (name.length < 2) {
                formFeedback.textContent = 'Error: Please enter a valid name (must be at least 2 characters).';
                formFeedback.classList.remove('hidden', 'text-green-600');
                formFeedback.classList.add('text-red-600');
                return;
            }

            // Validation 2: Simple Email Format Check
            if (!email.includes('@') || !email.includes('.')) {
                formFeedback.textContent = 'Error: Please enter a valid email address.';
                formFeedback.classList.remove('hidden', 'text-green-600');
                formFeedback.classList.add('text-red-600');
                return;
            }

            // Validation Success
            formFeedback.textContent = 'Reservation details submitted successfully! We will contact you shortly.';
            formFeedback.classList.remove('hidden', 'text-red-600');
            formFeedback.classList.add('text-green-600');

            document.getElementById('reservation-form').reset();
            
            setTimeout(() => { formFeedback.classList.add('hidden'); }, 5000);
        }

        // --- Initialization ---
        window.onload = function() {
            changeCategory('Starters'); 
            renderCart();
            document.getElementById('reservation-form').addEventListener('submit', validateContactForm);
        };
