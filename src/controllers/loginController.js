const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const filePath = path.join(__dirname,'..','..','contatos', 'usuarios.json');

class LoginController {
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const usuarios = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const user = usuarios.find(u => u.email === email);

      if (!user) {
        return res.status(401).json({ message: "Email ou senha inválidos." });
      }

      if (!user.confirmado) {
        return res.status(403).json({ message: "Confirme seu email antes de fazer login." });
      }

      const senhaValida = await bcrypt.compare(password, user.senha);
      if (!senhaValida) {
        return res.status(401).json({ message: "Email ou senha inválidos." });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'chave_muito_secreta',
        { expiresIn: '8h' }
      );

      return res.status(200).json({
        message: "Login bem-sucedido!",
        token,
        expiresIn: '8h',
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro interno ao fazer login." });
    }
  }
}

module.exports = LoginController;
