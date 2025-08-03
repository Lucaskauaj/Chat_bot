const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const EmailService = require('../services/EmailService');

const filePath = path.join(__dirname, '..', '..', 'contatos', 'usuarios.json');

class RegistroController {
  constructor() {
    this.garantirArquivoJson();
  }

  garantirArquivoJson() {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  }

  async registerUser(req, res) {
    try {
      const { nome, email, senha, confirmarSenha } = req.body;

      if (!nome || !email || !senha || !confirmarSenha) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      if (senha !== confirmarSenha) {
        return res.status(400).json({ message: "As senhas não coincidem." });
      }

      const usuarios = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      if (usuarios.find(u => u.email === email)) {
        return res.status(400).json({ message: "Este e-mail já está cadastrado." });
      }

      const senhaHash = await bcrypt.hash(senha, 12);
      const codigoConfirmacao = this.gerarCodigo();

      const novoUsuario = {
        id: Date.now(), 
        nome,
        email,
        senha: senhaHash,
        confirmado: false,
        codigoConfirmacao,
        criadoEm: new Date().toISOString()
      };

      const emailService = new EmailService();
      await emailService.sendConfirmationEmail(email, codigoConfirmacao);

      usuarios.push(novoUsuario);
      fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));

      return res.status(201).json({ message: "Usuário registrado com sucesso. Verifique seu email." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro interno ao registrar." });
    }
  }

  gerarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

module.exports = RegistroController;
