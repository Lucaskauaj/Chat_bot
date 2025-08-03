async function carregarQRCode() {
  const qrImage = document.getElementById('qrcode');
  const qrMessage = document.getElementById('qr-message');

  try {
    const res = await fetch('/qrcode');
    const data = await res.json();

    if (data.qr) {
     
      qrImage.src = data.qr;
      qrImage.classList.remove('hidden');
      qrMessage.classList.add('hidden');
    } else {

      qrImage.classList.add('hidden');
      qrMessage.textContent = 'WhatsApp conectado';
      qrMessage.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Erro ao carregar QR Code:', err);
   
    qrMessage.textContent = 'Erro ao carregar o QR Code';
    qrMessage.classList.remove('hidden');
    qrImage.classList.add('hidden');
  }
}

setInterval(carregarQRCode, 3000);
carregarQRCode();
