function carregarLoja() {
    const usuario = lerSessao();
    const formulario = document.getElementById("funcionamento");
    const proprietario = formulario && usuario?.tipo === "loja" ? usuario.email : "loja@hashi.com";
    const chave = "hashi-loja-" + proprietario;
    const exemplo = proprietario === "loja@hashi.com";
    let dados = { endereco: exemplo ? "Santa Mônica, Uberlândia" : "", abertura: "18:00", fechamento: "23:00" };
    try {
        Object.assign(dados, JSON.parse(localStorage.getItem(chave)));
    } catch { /* Usa os dados iniciais se o armazenamento estiver indisponível. */ }

    for (const local of document.querySelectorAll("[data-local-loja]")) local.textContent = dados.endereco;
    for (const horario of document.querySelectorAll("[data-horario-loja]")) {
        horario.textContent = dados.abertura + " às " + dados.fechamento;
    }
    if (!formulario || usuario?.tipo !== "loja") return;
    for (const campo of formulario.querySelectorAll("input[name]")) campo.value = dados[campo.name] || "";

    formulario.onsubmit = evento => {
        evento.preventDefault();
        const aviso = formulario.querySelector("[role=status]");
        try {
            localStorage.setItem(chave, JSON.stringify(Object.fromEntries(new FormData(formulario))));
            aviso.textContent = "Dados da loja salvos.";
        } catch { aviso.textContent = "Não foi possível salvar os dados neste navegador."; }
    };
}

window.addEventListener("pageshow", carregarLoja);
