function textoDaBusca(texto) {
    return texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

for (const grupo of document.querySelectorAll(".admin-grupo")) {
    const campo = grupo.querySelector('input[type="search"]');
    const fichas = grupo.querySelectorAll(".admin-ficha");
    const aviso = grupo.querySelector("[data-resultado-busca]");

    function filtrar() {
        const termo = textoDaBusca(campo.value);
        let quantidade = 0;
        for (const ficha of fichas) {
            const nome = ficha.querySelector("summary strong").textContent;
            const email = ficha.querySelector("[data-email]")?.textContent || "";
            ficha.hidden = !textoDaBusca(nome + " " + email).includes(termo);
            if (!ficha.hidden) quantidade++;
        }
        const vazio = grupo.querySelector("[data-grupo-vazio]");
        if (vazio) vazio.hidden = Boolean(termo);
        aviso.textContent = termo && quantidade === 0 ? "Nenhum resultado neste grupo." : "";
    }

    campo.addEventListener("input", filtrar);
    filtrar();
}
