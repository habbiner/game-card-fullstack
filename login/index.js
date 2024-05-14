const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoginVisible: true
        };
    },
    methods: {
        toggleComponents() {
            this.isLoginVisible = !this.isLoginVisible;
        },
        async cadastrarUsuario() {
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                });
                if (response.ok) {
                    alert('Usuário cadastrado com sucesso!');
                    // Redirecionar para a página de login ou fazer outra ação desejada
                } else {
                    alert('Erro ao cadastrar usuário.');
                }
            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                alert('Erro ao cadastrar usuário.');
            }
        },
        async realizarLogin() {
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                });
                if (response.ok) {
                    alert('Login bem-sucedido!');
                    // Redirecionar para a página do jogo ou fazer outra ação desejada
                } else {
                    alert('Credenciais inválidas.');
                }
            } catch (error) {
                console.error('Erro ao realizar login:', error);
                alert('Erro ao realizar login.');
            }
        }
    }
}).mount("#app");
