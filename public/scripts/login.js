document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = e.target.email.value;
    const senha = e.target.senha.value;

    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    if (res.ok) {
      alert("Logado com sucesso!");
      window.location.href = "/painel.html";
    } else {
      alert("Email ou senha incorretos.");
    }
  });