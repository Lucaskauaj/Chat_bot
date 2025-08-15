###  Sistema de Automação de Mensagens via WhatsApp

Este projeto é um **site/sistema de automação de mensagens** que permite o envio de **mensagens de texto, imagens e arquivos PDF** para contatos cadastrados. Também possui um **bot de WhatsApp** que responde automaticamente mensagens recebidas com base em comandos definidos.



###  Funcionalidades principais:

* Cadastro e gerenciamento de contatos (armazenado em arquivos JSON)
* Envio de mensagens individuais ou em massa
* Suporte a mensagens de texto, imagens e arquivos PDF
* Histórico de mensagens enviadas
* Bot de WhatsApp com respostas automáticas configuráveis
* Upload de arquivos com validação de tipo
* Autenticação com JWT e rotas protegidas



###  Simulação de banco de dados:

* Os dados são armazenados em **arquivos `.json`** locais, que simulam o funcionamento de um banco.
* Ex: `contatos.json`, `arquivos_enviados.json`, `usuarios.json`, etc.



###  Tecnologias e dependências principais:

* **Back-end:** Node.js + Express
* **Bot:** `whatsapp-web.js` com `puppeteer`
* **Armazenamento de dados:** Arquivos `.json`
* **Envio de e-mails:** `nodemailer`
* **Upload de arquivos:** `multer`
* **Segurança:** `bcrypt`, `jsonwebtoken`
* **Outros utilitários:** `dotenv`, `qrcode`, `cors`, `body-parser`, `path`, `mime-types`, `ws`



###  Exemplos de comandos automáticos:

* `"oi"` → responde `"Oi, tudo bem? Posso te ajudar?"`
* `"info"` → lista os comandos disponíveis


