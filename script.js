let intervaloSimulacao = null;
const matrizPixels = 16; // Grade de 4x4 simulada

// Inicializa a grade de pixels sensoriais na tela
function construirSensor() {
    const sensorContainer = document.getElementById('canvas-sensor');
    sensorContainer.innerHTML = '';
    for (let i = 0; i < matrizPixels; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.id = `pixel-${i}`;
        sensorContainer.appendChild(pixel);
    }
}

function logMensagem(msg) {
    const log = document.getElementById('output-log');
    log.innerHTML += `> ${msg}<br>`;
    log.scrollTop = log.scrollHeight;
}

function iniciarSimulacao() {
    document.getElementById('btn-iniciar').disabled = true;
    document.getElementById('btn-parar').disabled = false;
    logMensagem("Iniciando simulação do agente neural...");

    intervaloSimulacao = setInterval(() => {
        // 1. Simula entrada sensorial (ex: o personagem encontrou uma árvore ou objeto na tela do jogo)
        // Escolhe um pixel aleatório para "ativar" simulando estímulo visual
        const pixelAleatorio = Math.floor(Math.random() * matrizPixels);
        
        // Reseta todos os pixels visuais
        for (let i = 0; i < matrizPixels; i++) {
            document.getElementById(`pixel-${i}`).classList.remove('ativo');
        }
        
        // Ativa o pixel simulado
        document.getElementById(`pixel-${pixelAleatorio}`).classList.add('ativo');

        // 2. Processamento na Rede Neural Inspirada na Mosca
        const nVisual = document.getElementById('n-visual');
        const nMotorUp = document.getElementById('n-motor-up');
        const nMotorAction = document.getElementById('n-motor-action');

        // Dispara neurônio visual
        nVisual.classList.add('ativo');

        setTimeout(() => {
            nVisual.classList.remove('ativo');
            
            // Decisão baseada em reflexo simples (simulando circuitos de escape/aproximação)
            if (pixelAleatorio % 2 === 0) {
                nMotorUp.classList.add('ativo');
                logMensagem("Estímulo processado: Movendo para CIMA (Desviar/Andar)");
                setTimeout(() => nMotorUp.classList.remove('ativo'), 300);
            } else {
                nMotorAction.classList.add('ativo');
                logMensagem("Estímulo processado: Apertando BOTÃO A (Interagir)");
                setTimeout(() => nMotorAction.classList.remove('ativo'), 300);
            }
        }, 200);

    }, 1000);
}

function pararSimulacao() {
    clearInterval(intervaloSimulacao);
    document.getElementById('btn-iniciar').disabled = false;
    document.getElementById('btn-parar').disabled = true;
    logMensagem("Simulação pausada pelo usuário.");
}

// Executa a montagem inicial ao carregar a página
window.onload = () => {
    construirSensor();
};
