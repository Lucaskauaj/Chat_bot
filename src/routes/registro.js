const express = require('express');
const router = express.Router();
const RegistroController = require('../controllers/registroController');

const registroController = new RegistroController();

router.post('/registro', (req, res) => {
    const { nome, email, senha, confirmarSenha } = req.body;
    registroController.registerUser(nome, email, senha, confirmarSenha)
        .then(response => res.status(201).json(response))
        .catch(error => res.status(400).json({ error: error.message }));
});

module.exports = router;