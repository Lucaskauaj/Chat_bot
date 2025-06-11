const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const qrcode = require('qrcode');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const cors = require('cors');
const mime = require('mime-types');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });
const caminhoContatos = path.join(__dirname, 'contatos', 'contatos.json');

let qrData = null;
// const verificaresp = new Set();

app.use(cors());
app.use(express.json());
app.use('/templates', express.static(path.join(__dirname, 'templates')));
app.use('/public', express.static(path.join(__dirname, 'public')));


const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
});


client.on('qr', async (qr) => {
    try {
        qrData = await qrcode.toDataURL(qr);
        console.log('QR Code gerado');
    } catch (error) {
        console.error('Erro ao gerar QR Code:', error.message);
    }
});

client.on('ready', () => {
    console.log('WhatsApp pronto!');
    qrData = null;
});

client.on('auth_failure', (msg) => {
    console.error('Falha na autenticação:', msg);
});

client.initialize().catch((error) => {
    console.error('Erro ao inicializar o cliente do WhatsApp:', error.message);
});


client.on('message', async (msg) => {
    const texto = msg.body.toLowerCase();
    const numero = msg.from;

    if (numero.includes('@g.us')) return;

    // if (msg.fromMe) {
    //     verificaresp.delete(numero);
    //     return;
    // }

    // if (verificaresp.has(numero)) return;

    console.log(`📩 Mensagem recebida de ${numero}: ${texto}`);

    let resposta = '';

    if (texto === 'oi') {
        resposta = "Oi! Tudo bem? 😊\n\nSou o zezinho! Veja alguns comandos que você pode usar:\n- oi\n- eu te amo\n- harry lindo\n- info";
    } else if (texto === 'info') {
        resposta =
            "Olá! Eu sou o zezinho fui criado para conversar com você pelo WhatsApp e ajudar a automatizar o envio de mensagens e arquivos de forma prática.\n\n" +
            "Comigo, você pode cadastrar contatos, mandar mensagens em massa, compartilhar arquivos e gerenciar sua lista de destinatários com facilidade. A conexão é feita pelo WhatsApp Web, usando autenticação via QR Code — simples e segura!\n\n" +
            "Sou ideal para empresas, equipes de vendas, suporte ou qualquer pessoa que precise manter contato com várias pessoas ao mesmo tempo de forma automática e eficiente.";
        const caminhoImagem = path.join(__dirname, 'public', 'img/panda.webp'); 
        try {
            await client.sendMessage(numero, 'Aqui está uma imagem informativa sobre o zezinho! 📸');
            const buffer = await fs.readFile(caminhoImagem);
            const media = new MessageMedia('image/webp', buffer.toString('base64'), 'info.webp');
            await client.sendMessage(numero, media);
        } catch (e) {
            console.error('Erro ao enviar imagem:', e.message);
        }
    } else if (texto === 'eu te amo') {
        resposta = 'Eu também te amo! ❤️';
    } else if (texto === 'harry lindo') {
        resposta = 'É verdade, Harry é lindo! 😍';
    } else {
        resposta = "Desculpa, não entendi 😕\nTente digitar: oi, eu te amo, harry lindo ou info.";
    }

    try {
        await client.sendMessage(numero, resposta);
        // verificaresp.add(numero); 
        console.log(`✅ Resposta enviada para ${numero}`);
    } catch (err) {
        console.error(`❌ Erro ao responder ${numero}: ${err.message}`);
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/qrcode', (req, res) => {
    res.json({ qr: qrData || null });
});


app.post('/salvar-contatos', async (req, res) => {
    try {
        await fs.writeFile(caminhoContatos, JSON.stringify(req.body, null, 2));
        res.send({ status: 'Contatos salvos com sucesso.' });
    } catch (err) {
        console.error('Erro ao salvar contatos:', err.message);
        res.status(500).send({ error: 'Falha ao salvar contatos.' });
    }
});

app.get('/contatos', async (req, res) => {
    try {
        const data = await fs.readFile(caminhoContatos, 'utf8');
        const contatos = JSON.parse(data || '[]');
        res.json(contatos);
    } catch (err) {
        console.error('Erro ao ler contatos:', err.message);
        res.status(500).send({ error: 'Falha ao ler contatos.' });
    }
});

app.delete('/contato/:numero', async (req, res) => {
    const numeroParam = req.params.numero;
    try {
        const data = await fs.readFile(caminhoContatos, 'utf8');
        let contatos = [];
        if (data && data.trim().length > 0) {
            contatos = JSON.parse(data);
        }
        const contatosFiltrados = contatos.filter(c => c.numero !== numeroParam);
        if (contatos.length === contatosFiltrados.length) {
            return res.status(404).send({ error: 'Contato não encontrado.' });
        }
        await fs.writeFile(caminhoContatos, JSON.stringify(contatosFiltrados, null, 2));
        console.log('Arquivo JSON atualizado com sucesso.');
        res.send({ status: 'Contato removido com sucesso.' });
    } catch (err) {
        console.error('Erro ao remover contato:', err);
        res.status(500).send({ error: 'Erro ao remover contato.' });
    }
});


app.post('/enviar-json', async (req, res) => {
    try {
        const data = await fs.readFile(caminhoContatos, 'utf8');
        const contatos = JSON.parse(data || '[]');
        for (const contato of contatos) {
            const numero = `${contato.numero}@c.us`;
            try {
                await client.sendMessage(numero, contato.mensagem);
                console.log(`Mensagem enviada para ${contato.nome}`);
            } catch (error) {
                console.error(`Erro ao enviar para ${contato.nome}: ${error.message}`);
            }
        }
        res.send({ status: 'Mensagens processadas.' });
    } catch (error) {
        console.error('Erro ao processar mensagens:', error.message);
        res.status(500).send({ error: 'Erro ao processar mensagens.' });
    }
});

app.post('/enviar-selecionados', async (req, res) => {
    const contatosSelecionados = req.body;
    try {
        for (const contato of contatosSelecionados) {
            const numero = `${contato.numero}@c.us`;
            try {
                await client.sendMessage(numero, contato.mensagem);
                console.log(`Mensagem enviada para ${contato.nome}`);
            } catch (error) {
                console.error(`Erro ao enviar para ${contato.nome}: ${error.message}`);
            }
        }
        res.send({ status: 'Mensagens enviadas para os contatos selecionados.' });
    } catch (error) {
        console.error('Erro ao enviar mensagens selecionadas:', error.message);
        res.status(500).send({ error: 'Erro ao enviar mensagens.' });
    }
});


app.post('/enviar-arquivo', upload.single('arquivo'), async (req, res) => {
    const { numero, legenda } = req.body;
    const file = req.file;
    if (!file) return res.status(400).send({ error: 'Nenhum arquivo enviado.' });

    const mimetype = mime.lookup(file.originalname);
    const base64 = await fs.readFile(file.path, { encoding: 'base64' });
    const media = new MessageMedia(mimetype, base64, file.originalname);

    try {
        await client.sendMessage(`${numero}@c.us`, media, { caption: legenda || '' });
        res.send({ status: 'Arquivo enviado com legenda.' });
    } catch (err) {
        console.error('Erro ao enviar arquivo:', err);
        res.status(500).send({ error: 'Falha ao enviar o arquivo.' });
    }
    const caminhoHistorico = path.join(__dirname, 'contatos', 'arquivos_enviados.json');


const historico = {
  nomeArquivo: file.originalname,
  numero,
  legenda: legenda || '',
  dataEnvio: new Date().toISOString()
};

try {
  let historicoExistente = [];

  try {
    const data = await fs.readFile(caminhoHistorico, 'utf8');
    historicoExistente = JSON.parse(data || '[]');
  } catch {}

  historicoExistente.push(historico);
  await fs.writeFile(caminhoHistorico, JSON.stringify(historicoExistente, null, 2));
} catch (e) {
  console.error('Erro ao salvar histórico de envio:', e.message);
}

});

app.get('/arquivos-enviados', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'contatos', 'arquivos_enviados.json'), 'utf8');
    const arquivos = JSON.parse(data || '[]');
    res.json(arquivos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico de arquivos.' });
  }
});

// Rotas para os fetch de templates
app.get('/adicionar_cont', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'adicionar_cont.html'));
});

app.get('/arquivos', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'arquivos.html'));
});

app.get('/List', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'List.html'));
});

// Inicialização do servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});