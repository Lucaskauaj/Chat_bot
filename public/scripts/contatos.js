async function carregarContatos() {
  try {
    const res = await fetch('/contatos');
    const data = await res.json();
    contatos.length = 0;
    contatos.push(...data);
    atualizarContatos();
  } catch (err) {
    console.error('Erro ao carregar contatos:', err);
  }
}

async function salvarContatos() {
  try {
    const res = await fetch('/salvar-contatos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contatos)
    });
    const data = await res.json();
    document.getElementById('status').innerText = data.status || data.error;
    await carregarContatos(); // Recarrega a lista após salvar
  } catch (err) {
    console.error('Erro ao salvar contatos:', err);
    document.getElementById('status').innerText = 'Erro ao salvar contatos.';
  }
}

function adicionarContato() {
  const nome = document.getElementById('nome').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome || !numero || !mensagem) {
    alert('Preencha todos os campos.');
    return;
  }

  contatos.push({ nome, numero, mensagem });
  salvarContatos();

  document.getElementById('nome').value = '';
  document.getElementById('numero').value = '';
  document.getElementById('mensagem').value = '';
}
function removerContato(index) {
  if (confirm('Tem certeza que deseja remover este contato?')) {
    const numero = contatos[index].numero;
    fetch(`/contato/${numero}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        alert(data.status || data.error);
        carregarContatos();
      })
      .catch(err => {
        console.error('Erro ao remover:', err);
      });
  }
}

function editarContato(index) {
  const contato = contatos[index];

  const novoNome = prompt('Editar nome:', contato.nome);
  if (novoNome === null) return;

  const novoNumero = prompt('Editar número:', contato.numero);
  if (novoNumero === null) return;

  const novaMensagem = prompt('Editar mensagem:', contato.mensagem);
  if (novaMensagem === null) return;

  contatos[index] = {
    nome: novoNome.trim(),
    numero: novoNumero.trim(),
    mensagem: novaMensagem.trim()
  };

  salvarContatos();
}

function atualizarContatos() {
  const lista = document.getElementById('lista-contatos');
  lista.innerHTML = '';

  contatos.forEach((c, index) => {
    const div = document.createElement('div');
    div.className = 'contato';
    div.innerHTML = `
      <input type="checkbox" id="contato-${index}" />
      <strong>${c.nome}</strong><br>
      ${c.numero}<br>
      ${c.mensagem}<br>
      <button onclick="editarContato(${index})">✏️ Editar</button>
      <button onclick="removerContato(${index})">🗑️ Remover</button>
    `;
    lista.appendChild(div);
  });
}
async function enviarMensagens() {
  try {
    const res = await fetch('/enviar-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    document.getElementById('status').innerText = data.status || data.error;
  } catch (err) {
    console.error('Erro ao enviar mensagens:', err);
    document.getElementById('status').innerText = 'Erro ao enviar mensagens.';
  }
}

carregarContatos();