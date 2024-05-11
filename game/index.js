const { createApp } = Vue;
const API_URL = 'http://localhost:3000';

createApp({
    data() {
        return {
            heroi: { vida: 100, recuVida: 100, pot: 5 },
            vilao: { vida: 100, recuVida: 100 },
            logs: []
        };
    },
    methods: {
        registrarAcaoLog(acao) {
            this.logs.push(acao);
        },
        atacar(isHeroi) {
            if (isHeroi) {
                if (this.vilao.recuVida > 0) {
                    this.vilao.vida -= 10;
                    this.registrarAcaoLog("Héroi atacou!");
                    this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida);
                    setTimeout(this.acaoVilao, 500);
                } else {
                    this.vilao.vida -= 25;
                }
            } else {
                if (this.heroi.recuVida > 0) {
                    this.heroi.vida -= 15;
                    this.registrarAcaoLog("Vilão atacou");
                } else {
                    this.heroi.vida -= 35;
                    this.registrarAcaoLog("Vilão atacou!");
                }
            }
            this.verificarFimJogo();
        },
        defender(isHeroi) {
            if (isHeroi) {
                if (this.heroi.recuVida > 0) {
                    this.heroi.recuVida -= 20;
                    this.registrarAcaoLog("Héroi defendeu!");
                    setTimeout(this.acaoVilaoSemAtk, 500);
                } else {
                    this.registrarAcaoLog("Héroi defendeu!");
                    setTimeout(this.acaoVilao, 500);
                }
            } else {
                this.vilao.recuVida -= 20;
                this.registrarAcaoLog("Vilão defendeu!");
            }
        },
        usarPocao(isHeroi) {
            if (isHeroi) {
                if (this.heroi.pot > 0 && this.heroi.vida < 100 && this.heroi.recuVida < 100) {
                    this.heroi.vida += 5;
                    this.heroi.pot -= 1;
                    this.registrarAcaoLog('Poção do heroi');
                    setTimeout(this.acaoVilao, 500);
                } else if (this.heroi.pot > 0 && this.heroi.vida < 100 && this.heroi.recuVida === 100) {
                    this.heroi.vida += 5;
                    this.heroi.pot -= 1;
                    this.registrarAcaoLog('Poção do heroi');
                    setTimeout(this.acaoVilao, 500);
                } else if (this.heroi.pot > 0 && this.heroi.vida === 100 && this.heroi.recuVida < 100) {
                    this.heroi.recuVida += 5;
                    this.heroi.pot -= 1;
                    this.registrarAcaoLog('Poção do heroi');
                    setTimeout(this.acaoVilao, 500);
                } else {
                    setTimeout(this.acaoVilao, 500);
                }
            } else {
                if (this.vilao.vida < 100 && this.vilao.recuVida < 100) {
                    this.vilao.vida += 5;
                    this.vilao.recuVida += 5;
                    this.registrarAcaoLog('Poção do vilão');
                } else if (this.vilao.vida < 100 && this.vilao.recuVida === 100) {
                    this.vilao.vida += 10;
                    this.registrarAcaoLog('Poção do vilão');
                } else if (this.vilao.vida === 100 && this.vilao.recuVida < 100) {
                    this.vilao.recuVida += 5;
                    this.registrarAcaoLog('Poção do vilão');
                }
            }
            this.verificarFimJogo();
        },
        correr(isHeroi) {
            if (isHeroi) {
                this.registrarAcaoLog('Você Correu!');
                alert("Você Correu!");
            } else {
                this.registrarAcaoLog('O vilão correu');
                alert("O vilão correu");
            }
            this.acaoVilao();
        },
        acaoVilao() {
            const acoes = ['atacar', 'defender', 'usarPocao', 'correr'];
            const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)];
            this[acaoAleatoria](false);
        },
        acaoVilaoSemAtk() {
            const acoes = ['defender', 'usarPocao'];
            const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)];
            this[acaoAleatoria](false);
        },
        async atualizarVidaNoBancoDeDados(vidaHeroi, vidaVilao) {
            try {
                const response = await fetch(`${API_URL}/atualizarVida`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ vidaHeroi, vidaVilao })
                });
                if (!response.ok) {
                    throw new Error('Erro ao atualizar a vida no banco de dados.');
                }
                console.log('Vida do herói e do vilão atualizada com sucesso.');
            } catch (error) {
                console.error('Erro ao atualizar a vida no banco de dados:', error);
            }
        },
        verificarFimJogo() {
            if (this.vilao.vida <= 0 && this.heroi.vida > 0) {
                alert("PARABÉNS, VOCÊ MATOU O VILÃO!");
            } else if (this.heroi.vida <= 0 && this.vilao.vida > 0) {
                alert("GAME OVER, VOCÊ MORREU!");
            } else if (this.heroi.vida <= 0 && this.vilao.vida <= 0) {
                alert("GAME OVER, AMBOS MORRERAM!");
            }
        },
        barraVidaColor(vida) {
            if (vida >= 70) {
                return 'green';
            } else if (vida >= 30 && vida < 70) {
                return 'yellow';
            } else {
                return 'red';
            }
        }
    }
}).mount("#app");
