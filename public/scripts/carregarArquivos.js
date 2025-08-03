async function carregarArquivos() {
  const ul = document.getElementById('listaArquivos');
  ul.innerHTML = '';
  try {
    const res = await fetch('/arquivos-enviados');
    if (!res.ok) throw new Error('Erro ao buscar arquivos.');
    const lista = await res.json();

    ul.className = "max-h-96 overflow-y-auto flex flex-col gap-4";

    lista.reverse().forEach((arquivo) => {
      const li = document.createElement('li');
      li.className = "bg-white border border-blue-300 rounded-xl p-5 shadow-md text-sm text-gray-800";
      li.innerHTML = `
        <p><span class="font-semibold">Nome:</span> ${arquivo.nome}</p>
        <p><span class="font-semibold">Arquivo:</span> ${arquivo.nomeArquivo}</p>
        <p><span class="font-semibold">Para:</span> ${arquivo.numero}</p>
        <p><span class="font-semibold">Mensagem:</span> ${arquivo.mensagem || '---'}</p>
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
