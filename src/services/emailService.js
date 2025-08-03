class EmailService {
    constructor(transporter) {
        this.transporter = transporter;
    }

    async sendConfirmationEmail(to, code) {
        const mailOptions = {
            from: 'no-reply@example.com',
            to: to,
            subject: 'Confirmação de Registro',
            text: `Seu código de confirmação é: ${code}`
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Email de confirmação enviado para:', to);
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw new Error('Não foi possível enviar o email de confirmação.');
        }
    }
}
module.exports = EmailService;