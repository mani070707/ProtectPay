let selectedType = '';

        function selectType(type) {
            selectedType = type;
            
            // Remove selected class from all account types
            document.querySelectorAll('.account-type').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Add selected class to clicked type
            const selectedElement = event.currentTarget;
            selectedElement.classList.add('selected');
            
            // Show login form
            const loginForm = document.querySelector('.login-form');
            loginForm.classList.add('active');
            
            // Update welcome text
            const welcomeText = document.getElementById('welcomeText');
            welcomeText.textContent = `Hello ${type}!\nPlease fill out the form below to get started`;
        }

        function handleLogin(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Basic validation
            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }

            // Store email in localStorage for use in other pages
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userType', selectedType);

            // Redirect based on account type
            if (selectedType === 'ward') {
                window.location.href = 'ward.html';
            } else if (selectedType === 'guardian') {
                window.location.href = 'guardian.html';
            }
        }

        function showError(message) {
            const errorDiv = document.getElementById('emailError');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }

        // Clear stored data when the page loads
        window.onload = function() {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userType');
        }