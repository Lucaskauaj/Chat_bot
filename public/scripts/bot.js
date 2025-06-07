// client.on('message', async (msg) => {
//   const texto = msg.body.toLowerCase();
//   const numero = msg.from;

//   if (numero.includes('@g.us')) return; // faz com que o bot não responda em grupos

//   console.log(`📩 Mensagem recebida de ${numero}: ${texto}`);

//   let resposta = '';

//   if (texto === 'oi') {
//     resposta = 'Oi! Tudo bem? 😊';
//   } else if (texto === 'info') {
//     resposta = 'Sou um bot feito com Node.js e whatsapp-web.js! 🤖';
//   } else {
//     resposta = "Desculpa, não entendi 😕\nTente digitar: 'oi' ou 'info'.";
//   }

//   try {
//     await client.sendMessage(numero, resposta);
//     console.log(`✅ Resposta enviada para ${numero}`);
//   } catch (err) {
//     console.error(`❌ Erro ao responder ${numero}: ${err.message}`);
//   }
// });
