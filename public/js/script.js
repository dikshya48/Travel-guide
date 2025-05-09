document.addEventListener('DOMContentLoaded', () => {


    const registerForm = document.getElementById('registerForm');


    const loginForm = document.getElementById('loginForm');

    const message = document.getElementById('message');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {

            e.preventDefault();
            const username = document.getElementById('username').value;


            const email = document.getElementById('email').value;


            const password = document.getElementById('password').value;

            if (!username || !email || !password) {

                message.className = 'error';

                message.textContent = 'All fields are required.';
                return;
            }

            try {
            
                
                let users = [];
                try {
                    const response = await fetch('user.json');
                    if (response.ok) {
                        users = await response.json();
                    }
                } catch (fetchError) {
                    console.warn('Could not read user.json. Starting with empty user list.', fetchError);
                }

      
                
                if (users.some(user => user.email === email)) {
                    message.className = 'error';
                    message.textContent = 'Email already registered.';
                    return;
                }

               
                users.push({ username, email, password });

        
                try {
                    const saveResponse = await fetch('user.json', {
                        method: 'POST',

                        headers: { 'Content-Type': 'application/json' },

                        body: JSON.stringify(users)
                    });

                    if (!saveResponse.ok) {
                        throw new Error('Server did not accept the write operation.');
                    }

                    message.className = 'message';
                    message.textContent = 'Registration successful! Redirecting to login...';
                    setTimeout(() => window.location.href = 'login.html', 2000);

                } catch (saveError) {


                    console.error('Failed to write to user.json:', saveError);
                    message.className = 'error';

                    message.textContent = 'Registration failed: Server does not support saving data. Check console for details.';
               
                    console.log('Simulated user registration:', { username, email, password });
                }
            } catch (error) {
                message.className = 'error';
                message.textContent = 'Error during registration. Please try again.';
                console.error('Registration error:', error);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                message.className = 'error';
                message.textContent = 'All fields are required.';
                return;
            }

            try {
               
                const response = await fetch('user.json');

                if (!response.ok) {

                    message.className = 'error';


                    message.textContent = 'Error accessing user data.';
                    return;



                }

                const users = await response.json();

                const user = users.find(user => user.email === email && user.password === password);


                if (user) {
                    message.className = 'message';
                    message.textContent = `Welcome, ${user.username}! Login successful.`;
                    setTimeout(() => window.location.href = 'index.html', 2000);
                } else {







                    message.className = 'error';
                    message.textContent = 'Invalid email or password.';
                }
            } catch (error) {
                message.className = 'error';

                message.textContent = 'Error during login. Please try again.';
                
                console.error('Login error:', error);
            }
        });
    }
});