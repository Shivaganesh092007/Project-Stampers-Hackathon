// Mock Auth for Hackathon Demo
if (window.location.pathname.includes('auth.html')) {
    // DOM Elements
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginError = document.getElementById('login-error');
    const signupError = document.getElementById('signup-error');
    const signupSuccess = document.getElementById('signup-success');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    // Tab Switching
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        clearMessages();
    });

    tabSignup.addEventListener('click', () => {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        clearMessages();
    });

    function clearMessages() {
        loginError.style.display = 'none';
        signupError.style.display = 'none';
        signupSuccess.style.display = 'none';
    }

    function setLoading(btn, isLoading) {
        if (isLoading) {
            btn.dataset.originalText = btn.innerText;
            btn.innerText = 'Processing...';
            btn.disabled = true;
        } else {
            btn.innerText = btn.dataset.originalText;
            btn.disabled = false;
        }
    }

    // Login Logic
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        clearMessages();
        setLoading(loginBtn, true);

        setTimeout(() => {
            if (email === 'checkid1' && password === '1234') {
                localStorage.setItem('userSession', JSON.stringify({
                    id: 'mock-user-123',
                    name: 'Check User'
                }));
                window.location.href = 'index.html';
            } else {
                loginError.innerText = "Invalid credentials. Try checkid1 / 1234";
                loginError.style.display = 'block';
                setLoading(loginBtn, false);
            }
        }, 500);
    });

    // Signup Logic
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        clearMessages();
        setLoading(signupBtn, true);

        setTimeout(() => {
            // Allow any signup for demo purposes
            localStorage.setItem('userSession', JSON.stringify({
                id: 'mock-user-' + Math.floor(Math.random() * 1000),
                name: name || email
            }));
            signupSuccess.style.display = 'block';
            
            // Auto redirect after successful signup
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 500);
    });

    // Check if already logged in
    function checkSession() {
        const session = localStorage.getItem('userSession');
        if (session) {
            window.location.href = 'index.html';
        }
    }

    checkSession();
}
