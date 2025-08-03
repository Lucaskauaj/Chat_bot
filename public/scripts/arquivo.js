document.getElementById('formArquivo').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const numerosRaw = document.getElementById('numero').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  const arquivo = document.getElementById('arquivo').files[0];
  const statusEl = document.getElementById('status');

  if (!numerosRaw || !arquivo) {
    statusEl.innerHTML = `<span class="font-bold text-red-600">Número(s) e arquivo são obrigatórios.</span>`;
    return;
  }


  const numeros = numerosRaw.split(',').map(num => num.trim()).filter(num => num.length > 0);

  if (numeros.length === 0) {
    statusEl.innerHTML = `<span class="font-bold text-red-600">Digite pelo menos um número válido.</span>`;
    return;
  }

  statusEl.innerHTML = `<span class="font-semibold text-blue-600">Enviando para ${numeros.length} número(s)...</span>`;


  const promises = numeros.map(async (numero) => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('numero', numero);
    formData.append('mensagem', mensagem);
    formData.append('arquivo', arquivo);

    try {
      const res = await fetch('/enviar-arquivo', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error(`Erro no envio para ${numero}`);

      const data = await res.json();
      return { numero, sucesso: true, mensagem: data.status || 'Enviado com sucesso' };

    } catch (err) {
      return { numero, sucesso: false, mensagem: err.message || 'Erro desconhecido' };
    }
  });

  const resultados = await Promise.all(promises);

  const sucessoCount = resultados.filter(r => r.sucesso).length;
  const erroCount = resultados.length - sucessoCount;

  let resumo = `<span class="font-bold text-green-700">Enviado para ${sucessoCount} número(s) com sucesso.</span>`;
  if (erroCount > 0) {
    resumo += `<br><span class="font-bold text-red-600">Falha ao enviar para ${erroCount} número(s).</span>`;
  }


  resumo += '<br><ul class="list-disc list-inside">';
  resultados.forEach(r => {
    const color = r.sucesso ? 'text-green-600' : 'text-red-600';
    resumo += `<li class="${color}">${r.numero}: ${r.mensagem}</li>`;
  });
  resumo += '</ul>';

  statusEl.innerHTML = resumo;

  carregarArquivos();
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
        <p><span class="font-semibold">Nome:</span> ${arquivo.nome}</p>
        <p><span class="font-semibold">Arquivo:</span> ${arquivo.nomeArquivo}</p>
        <p><span class="font-semibold">Para:</span> ${arquivo.numero}</p>
        <p><span class="font-semibold">mensagem:</span> ${arquivo.mensagem || '---'}</p>
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
