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
          li.innerHTML = `
            <strong>Arquivo:</strong> ${arquivo.nomeArquivo}<br />
            <strong>Para:</strong> ${arquivo.numero}<br />
            <strong>Legenda:</strong> ${arquivo.legenda || '---'}<br />
            <strong>Data:</strong> ${new Date(arquivo.dataEnvio).toLocaleString()}
          `;
          ul.appendChild(li);
        });
      } catch (err) {
        console.error('Erro ao buscar arquivos:', err);
      }
    }

    window.onload = carregarArquivos;
