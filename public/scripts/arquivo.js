document.getElementById('formArquivo').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);


  const numero = formData.get('numero');
 
  if (!/^55\d{10,11}$/.test(numero) || /^(\d)\1+$/.test(numero)) {
    document.getElementById('status').innerText = 'Digite um número válido no formato DDI + DDD + número (ex: 5599999999999).';
    return;
  }

  try {
   
    const statusRes = await fetch('/status');
    const statusData = await statusRes.json();
    if (!statusData.conectado) {
      document.getElementById('status').innerText = 'Conecte o WhatsApp antes de enviar arquivos.';
      return;
    }

    const res = await fetch('/enviar-arquivo', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    document.getElementById('status').innerText = data.status || data.error;
    carregarArquivos(); 
  } catch (err) {
    document.getElementById('status').innerText = 'Erro ao enviar arquivo. conecte o WhatsApp antes de enviar arquivos.';
  }
});

async function carregarArquivos() {
  const ul = document.getElementById('listaArquivos');
  ul.innerHTML = '';
  try {
    const res = await fetch('/arquivos-enviados');
    if (!res.ok) throw new Error('Erro ao buscar arquivos.');
    const lista = await res.json();

  
    ul.className = "max-h-96 overflow-y-auto flex flex-col gap-4"; 

    lista.reverse().forEach((arquivo, idx) => {
      const li = document.createElement('li');
      li.className = "bg-white border border-blue-300 rounded-xl p-5 shadow-md text-sm text-gray-800";
      li.innerHTML = `
        <p><span class="font-semibold">Arquivo:</span> ${arquivo.nomeArquivo}</p>
        <p><span class="font-semibold">Para:</span> ${arquivo.numero}</p>
        <p><span class="font-semibold">Legenda:</span> ${arquivo.legenda || '---'}</p>
        <p><span class="font-semibold">Data:</span> ${new Date(arquivo.dataEnvio).toLocaleString()}</p>
      `;
      ul.appendChild(li);
    });

 
    if (lista.length === 0) {
      ul.innerHTML = `<li class="text-center text-gray-500 py-8">Nenhum arquivo enviado ainda.</li>`;
    }
  } catch (err) {
    console.error('Erro ao buscar arquivos:', err);
    ul.innerHTML = `<li class="text-center text-red-600 font-bold py-8">Erro ao buscar arquivos. Tente novamente.</li>`;
  }
}

window.onload = carregarArquivos;
