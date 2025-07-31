document.getElementById('formArquivo').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const res = await fetch('/enviar-arquivo', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    document.getElementById('status').innerText = data.status || data.error;
    carregarArquivos(); // Atualiza lista
  } catch (err) {
    document.getElementById('status').innerText = 'Erro ao enviar arquivo.';
  }
});

async function carregarArquivos() {
  const ul = document.getElementById('listaArquivos');
  ul.innerHTML = '';
  try {
    const res = await fetch('/arquivos-enviados');
    const lista = await res.json();

    lista.reverse().forEach(arquivo => {
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
  } catch (err) {
    console.error('Erro ao buscar arquivos:', err);
  }
}

window.onload = carregarArquivos;
