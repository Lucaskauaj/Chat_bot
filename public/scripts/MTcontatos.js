app.post('/enviar-para-varios', async (req, res) => {
  const { numeros, mensagem } = req.body;

  if (!Array.isArray(numeros) || !mensagem) {
    return res.status(400).send({ error: 'Números ou mensagem ausentes.' });
  }

  try {
    for (const numero of numeros) {
      const chatId = `${numero}@c.us`;
      try {
        await client.sendMessage(chatId, mensagem);
        console.log(`Mensagem enviada para ${numero}`);
      } catch (error) {
        console.error(`Erro ao enviar para ${numero}: ${error.message}`);
      }
    }

    res.send({ status: 'Mensagens enviadas com sucesso.' });
  } catch (err) {
    console.error('Erro geral no envio:', err.message);
    res.status(500).send({ error: 'Erro ao enviar mensagens.' });
  }
});
