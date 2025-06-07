const contatos = [];

async function carregarQRCode() {
  try {
    const res = await fetch('/qrcode');
    const data = await res.json();
    if (data.qr) {
      document.getElementById('qrcode').src = data.qr;
    } else {
      document.getElementById('qrcode').alt = 'WhatsApp conectado';
    }
  } catch (err) {
    console.error('Erro ao carregar QR Code:', err);
  }
}
setInterval(carregarQRCode, 3000);
carregarQRCode();