const express = require('express'); 
const bodyParser = require('body-parser');
const path = require('path');
const loginRoutes = require('./src/routes/login');
const registroRoutes = require('./src/routes/registro');
const whatsRoutes = require('./src/services/whats');
const fs = require('fs').promises;
const app = express();
const PORT = process.env.PORT || 3000;

async function criarPastas() {
  const pastas = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'contatos'),
    path.join(__dirname, 'sessions')
  ];
// sucesso
  for (const pasta of pastas) {
    try {
      await fs.access(pasta);
    } catch {
      await fs.mkdir(pasta, { recursive: true });
      console.log(`Pasta criada: ${pasta}`);
    }
  }
}

criarPastas().catch(console.error);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/templates', express.static(path.join(__dirname, 'templates')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/login', loginRoutes);
app.use('/registro', registroRoutes);
app.use('/', whatsRoutes);
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});