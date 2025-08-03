const contatos = [];
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
    document.getElementById('status').innerHTML = `<span class="font-bold text-red-600">${data.status || data.error}</span>`;
    await carregarContatos(); 
  } catch (err) {
    console.error('Erro ao salvar contatos:', err);
    document.getElementById('status').innerHTML = `<span class="font-bold text-red-600">Erro ao salvar contatos.</span>`;
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

 
  lista.className = "space-y-4 max-h-96 overflow-y-auto";

  const SelecionarTodos = document.createElement('div');
  SelecionarTodos.className = "mb-4 flex items-center gap-2";
  SelecionarTodos.innerHTML = `
    <input type="checkbox" id="selecionar-todos" class="accent-blue-600 w-5 h-5 rounded border-gray-300 transition" />
    <label for="selecionar-todos" class="text-sm font-semibold text-gray-700 select-none cursor-pointer">Selecionar todos</label>
  `;
  lista.appendChild(SelecionarTodos);

  contatos.forEach((c, index) => {
    const div = document.createElement('div');
    div.className = "bg-white border border-blue-300 rounded-lg p-5 shadow-md text-sm text-gray-800 contato";
    div.innerHTML = `
      <div class="flex items-start gap-4 flex-wrap">
        <input type="checkbox" id="contato-${index}" 
          class="mt-1 accent-blue-600 w-4 h-4 rounded-lg border-gray-300 transition contato-checkbox" />
        <div class="flex-1">
          <strong>${c.nome}</strong><br>
          <span>${c.numero}</span>
          <div class="mt-2 text-gray-700">${c.mensagem}</div>
        </div>
        <div class="flex flex-col gap-2 items-end ml-auto">
          <button class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-xl transition text-xs" onclick="editarContato(${index})">✏️ Editar</button>
          <button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-xl transition text-xs" onclick="removerContato(${index})">🗑️ Remover</button>
        </div>
      </div>
    `;
    lista.appendChild(div);
  });

  const selecionarTodos = document.getElementById('selecionar-todos');
  selecionarTodos.addEventListener('change', function () {
    const checkboxes = document.querySelectorAll('.contato-checkbox');
    checkboxes.forEach(cb => cb.checked = selecionarTodos.checked);
  });
}
async function enviarMensagens() {
  try {
    const selecionados = document.querySelectorAll('.contato-checkbox:checked');
    if (selecionados.length === 0){
      document.getElementById('status').innerHTML ='<span class="font-bold text-red-600">Selecione pelo menos um contato para enviar mensagens.</span>';
      return;
    }
  
    const statusRes = await fetch('/status');
    if (!statusRes.ok) throw new Error('Erro ao verificar conexão com WhatsApp.');
    const statusData = await statusRes.json();

    if (!statusData.conectado) {
      document.getElementById('status').innerHTML = `<span class="font-bold text-red-600">Conecte o WhatsApp antes de enviar mensagens.</span>`;
      return;
    }

    
    const contatosSelecionados = Array.from(selecionados).map(cb => {
    const index = parseInt(cb.id.split('-')[1]);
    return contatos[index];
    });

    const res = await fetch('/enviar-selecionados', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(contatosSelecionados),
    });


    const data = await res.json();
    document.getElementById('status').innerHTML = `<span class="font-bold text-green-700">${data.status || data.error}</span>`;
  } catch (err) {
    console.error('Erro ao enviar mensagens:', err);
    document.getElementById('status').innerHTML = `<span class="font-bold text-red-600">Erro ao enviar mensagens. Conecte o WhatsApp antes de enviar mensagens.</span>`;
  }
}

carregarContatos();