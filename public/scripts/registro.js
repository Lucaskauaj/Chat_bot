document.getElementById("registroForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const nome = e.target.nome.value;
    const email = e.target.email.value;
    const senha = e.target.senha.value;
    const confirmarSenha = e.target.confirmarSenha.value;

    if (senha != confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    const res = await fetch("/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    });

    if (res.ok) {
      alert("Registro realizado com sucesso!");
      window.location.href = "/templates/login.html";
    } else {
      alert("Erro ao registrar.");
    }
  });