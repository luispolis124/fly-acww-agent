let intervaloSimulacao = null;
const matrizPixels = 16; // Grade de 4x4 simulada
let socket = null;

// Inicializa a conexão com a WebSocket Bridge local
function conectarBridge() {
    try {
        socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            logMensagem("Conectado à WebSocket Bridge local com sucesso!");
        };

        socket.onclose = () => {
            logMensagem("Bridge desconectada. Rodando em modo de simulação visual pura.");
        };

        socket.onerror = (error) => {
            logMensagem("Aviso: Servidor Bridge local não encontrado (porta 8080).");
        };
    } catch (e) {
        logMensagem("Não foi possível iniciar o WebSocket.");
    }
}

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
    if (log) {
        log.innerHTML += `> ${msg}<br>`;
        log.scrollTop = log.scrollHeight;
    }
}

// Envia a decisão da rede neural para a Bridge local (se conectada)
function dispararAcaoBridge(tipoAcao) {
    const payload = {
        agent: "Drosophila-AI",
        action: tipoAcao,
        timestamp: Date.now()
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
        logMensagem(`Bridge -> Comando enviado: [ ${tipoAcao} ]`);
    }
}

function iniciarSimulacao() {
    document.getElementById('btn-iniciar').disabled = true;
    document.getElementById('btn-parar').disabled = false;
    logMensagem("Iniciando simulação do agente neural...");

    intervaloSimulacao = setInterval(() => {
        // 1. Simula entrada sensorial (ex: o personagem encontrou um obstáculo ou item)
        const pixelAleatorio = Math.floor(Math.random() * matrizPixels);
        
        // Reseta todos os pixels visuais
        for (let i = 0; i < matrizPixels; i++) {
            const pixelEl = document.getElementById(`pixel-${i}`);
            if (pixelEl) pixelEl.classList.remove('ativo');
        }
        
        // Ativa o pixel simulado
        const pixelAtivo = document.getElementById(`pixel-${pixelAleatorio}`);
        if (pixelAtivo) pixelAtivo.classList.add('ativo');

        // 2. Processamento na Rede Neural Inspirada na Mosca
        const nVisual = document.getElementById('n-visual');
        const nMotorUp = document.getElementById('n-motor-up');
        const nMotorAction = document.getElementById('n-motor-action');

        if (nVisual) nVisual.classList.add('ativo');

        setTimeout(() => {
            if (nVisual) nVisual.classList.remove('ativo');
            
            // Decisão baseada em reflexo simples (simulando circuitos biológicos)
            if (pixelAleatorio % 2 === 0) {
                if (nMotorUp) nMotorUp.classList.add('ativo');
                logMensagem("Estímulo processado: Movendo para CIMA (UP)");
                dispararAcaoBridge("UP");
                setTimeout(() => {
                    if (nMotorUp) nMotorUp.classList.remove('ativo');
                }, 300);
            } else {
                if (nMotorAction) nMotorAction.classList.add('ativo');
                logMensagem("Estímulo processado: Apertando BOTÃO A (ACTION)");
                dispararAcaoBridge("ACTION_A");
                setTimeout(() => {
                    if (nMotorAction) nMotorAction.classList.remove('ativo');
                }, 300);
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

// Executa a montagem inicial e tenta conectar na bridge ao carregar a página
window.onload = () => {
    construirSensor();
    conectarBridge();
};
