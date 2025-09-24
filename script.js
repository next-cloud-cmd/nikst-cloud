// تأثيرات إضافية للصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تبديل إظهار/إخفاء كلمة المرور
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.querySelector('#password');
    
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // تأثيرات عند التمرير
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

    // مراقبة العناصر لإضافة تأثيرات الظهور
    document.querySelectorAll('.feature-card, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // نموذج التسجيل
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // حالة التحميل
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
        
        if (!messageDiv) {
            const newMessageDiv = document.createElement('div');
            newMessageDiv.id = 'message';
            this.appendChild(newMessageDiv);
        }
        
        messageDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        messageDiv.className = 'message';
        
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> Login successful! Redirecting to dashboard...';
                messageDiv.className = 'message success';
                
                // تأثير النجاح
                this.style.opacity = '0.7';
                this.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 2000);
            } else {
                messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${data.message}`;
                messageDiv.className = 'message error';
                
                // تأثير الخطأ
                this.classList.add('shake');
                setTimeout(() => this.classList.remove('shake'), 500);
            }
        } catch (error) {
            messageDiv.innerHTML = '<i class="fas fa-wifi"></i> Connection error. Please check your network.';
            messageDiv.className = 'message error';
            console.error('Login error:', error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // إضافة تأثير الاهتزاز للخطأ
    const style = document.createElement('style');
    style.textContent = `
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});
