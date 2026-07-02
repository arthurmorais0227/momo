// ===== Partículas douradas de fundo =====
function criarParticulas() {
    const fundo = document.getElementById('fundoAnimado');
    const quantidade = 26;

    for (let i = 0; i < quantidade; i++) {
        const particula = document.createElement('div');
        particula.className = 'particula';

        const tamanho = 3 + Math.random() * 5;
        particula.style.width = `${tamanho}px`;
        particula.style.height = `${tamanho}px`;
        particula.style.left = `${Math.random() * 100}%`;
        particula.style.top = `${Math.random() * 100}%`;
        particula.style.animationDuration = `${6 + Math.random() * 6}s`;
        particula.style.animationDelay = `${Math.random() * 6}s`;

        fundo.appendChild(particula);
    }
}

// ===== Caça-níquel =====
const SIMBOLOS = ['🍀', '💰', '⭐', '🎲', '💎'];
const SIMBOLO_VENCEDOR = '🍀';
const VOLTAS_BASE = 18;

function montarTira(tiraEl) {
    tiraEl.innerHTML = '';
    tiraEl.style.transition = 'none';
    tiraEl.style.transform = 'translateY(0)';

    for (let i = 0; i < VOLTAS_BASE; i++) {
        const simbolo = document.createElement('div');
        simbolo.className = 'simbolo';
        simbolo.textContent = SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)];
        tiraEl.appendChild(simbolo);
    }

    // último símbolo é sempre o vencedor, é nele que o rolo vai parar
    const vencedor = document.createElement('div');
    vencedor.className = 'simbolo';
    vencedor.textContent = SIMBOLO_VENCEDOR;
    tiraEl.appendChild(vencedor);

    return VOLTAS_BASE; // índice do símbolo vencedor
}

function girarRolo(tiraEl, indiceFinal, duracaoSegundos) {
    // força o navegador a registrar a posição inicial antes de animar
    void tiraEl.offsetHeight;

    const alturaItem = tiraEl.firstElementChild.getBoundingClientRect().height;

    tiraEl.style.transition = `transform ${duracaoSegundos}s cubic-bezier(0.12, 0.85, 0.2, 1)`;
    tiraEl.style.transform = `translateY(-${indiceFinal * alturaItem}px)`;
}

function iniciarSorteio() {
    const botao = document.getElementById('btnSortear');
    const bilhete = document.getElementById('bilhete');

    if (botao.disabled) return;

    botao.disabled = true;
    botao.classList.add('girando');
    botao.querySelector('.textoBotao').textContent = 'Girando...';

    const rolos = [
        { tira: document.getElementById('tira1'), duracao: 1.6 },
        { tira: document.getElementById('tira2'), duracao: 2.1 },
        { tira: document.getElementById('tira3'), duracao: 2.6 },
    ];

    let indiceFinal = 0;
    rolos.forEach(({ tira }) => {
        indiceFinal = montarTira(tira);
    });

    rolos.forEach(({ tira, duracao }) => {
        girarRolo(tira, indiceFinal, duracao);
    });

    const duracaoTotal = Math.max(...rolos.map(r => r.duracao));

    setTimeout(() => {
        bilhete.classList.add('virado');
        dispararConfete();
    }, duracaoTotal * 1000 + 250);
}

// ===== Confete =====
const canvas = document.getElementById('canvasConfete');
const ctx = canvas.getContext('2d');
const CORES_CONFETE = ['#d9b24c', '#ff6b57', '#1f6b48', '#f2dd9a', '#fdf8ec'];

function ajustarTamanhoCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', ajustarTamanhoCanvas);
ajustarTamanhoCanvas();

function dispararConfete() {
    const quantidade = 140;
    const particulas = [];

    for (let i = 0; i < quantidade; i++) {
        particulas.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: -20 - Math.random() * 200,
            vx: (Math.random() - 0.5) * 6,
            vy: 2 + Math.random() * 4,
            tamanho: 5 + Math.random() * 6,
            cor: CORES_CONFETE[Math.floor(Math.random() * CORES_CONFETE.length)],
            rotacao: Math.random() * 360,
            velocidadeRotacao: (Math.random() - 0.5) * 12,
        });
    }

    const gravidade = 0.12;
    const inicio = performance.now();
    const duracaoMs = 3200;

    function passo(agora) {
        const decorrido = agora - inicio;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particulas.forEach(p => {
            p.vy += gravidade;
            p.x += p.vx;
            p.y += p.vy;
            p.rotacao += p.velocidadeRotacao;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotacao * Math.PI) / 180);
            ctx.fillStyle = p.cor;
            ctx.fillRect(-p.tamanho / 2, -p.tamanho / 4, p.tamanho, p.tamanho / 2);
            ctx.restore();
        });

        if (decorrido < duracaoMs) {
            requestAnimationFrame(passo);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    requestAnimationFrame(passo);
}

// ===== Inicialização =====
document.getElementById('btnSortear').addEventListener('click', iniciarSorteio);
criarParticulas();
