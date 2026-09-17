// Requer a biblioteca ws (instalar via terminal: npm install ws)
const WebSocket = require('wss');
const wss = new WebSocket.Server({ port: 8080 });

console.log("=========================================");
console.log(" [Fly-ACWW Bridge] Rodando na porta 8080");
console.log(" Aguardando conexão do painel web...");
console.log("=========================================");

wss.on('connection', (ws) => {
    console.log(" [+] Painel Web conectado com sucesso!");

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(` [AÇÃO RECEBIDA] Comando: ${data.action} | Alvo: ${data.target}`);

            // Aqui é onde a mágica acontece:
            // A bridge traduz a decisão da rede neural em eventos de controle 
            // que o emulador (melonDS) reconhece globalmente no seu sistema operacional.
            executarComandoNoEmulador(data.action);

        } catch (e) {
            console.error(" [Erro] Mensagem inválida recebida:", message);
        }
    });

    ws.on('close', () => {
        console.log(" [-] Painel Web desconectado.");
    });
});

function executarComandoNoEmulador(acao) {
    // Exemplo conceitual de mapeamento de tecla para o emulador ativo no foco do Windows/Linux/Mac
    switch (acao) {
        pressAction(acao);
            break;
        default:
            console.log(` [Simulação] Ação desconhecida: ${acao}`);
    }
}

function pressAction(acao) {
    // Aqui você integraria bibliotecas de automação de sistema nativas do Node 
    // (como 'robotjs' ou 'nut-js') para simular o pressionamento real das teclas 
    // configuradas no seu emulador (ex: Seta pra cima, Tecla X, Tecla Z).
    console.log(` -> Simulando hardware input para o jogo: [ ${acao} ]`);
}
