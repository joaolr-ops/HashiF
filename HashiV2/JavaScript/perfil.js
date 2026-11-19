function mostrarPerfil() {
    const usuario = lerSessao();
    if (!usuario?.email || !Object.hasOwn(paginasDoPerfil, usuario.tipo)) return;
    const tipos = { cliente: "Cliente", loja: "Loja", entregador: "Entregador", admin: "Administrador" };
    const chave = "hashi-foto-" + usuario.tipo + "-" + usuario.email;
    const link = document.querySelector("header .conta-buttom");
    const formulario = document.querySelector("[data-form-foto]");
    let foto;
    try { foto = localStorage.getItem(chave); } catch { foto = null; }

    function avatar(elemento) {
        elemento.textContent = (usuario.nome || tipos[usuario.tipo]).trim().slice(0, 1).toUpperCase();
        if (foto) {
            const imagem = document.createElement("img");
            imagem.alt = "";
            imagem.src = foto;
            elemento.replaceChildren(imagem);
        }
    }

    function atualizar() {
        if (link) {
            const icone = document.createElement("span");
            icone.className = "perfil-avatar";
            icone.setAttribute("aria-hidden", "true");
            avatar(icone);
            const texto = document.createElement("span");
            texto.className = "perfil-identidade";
            const nome = document.createElement("strong");
            nome.className = "perfil-nome";
            nome.textContent = usuario.nome || tipos[usuario.tipo];
            const tipo = document.createElement("small");
            tipo.textContent = tipos[usuario.tipo];
            texto.append(nome, tipo);
            link.classList.add("conta-com-perfil");
            link.replaceChildren(icone, texto);
        }
        document.querySelectorAll(".conta-avatar, [data-avatar-configuracao]").forEach(avatar);
        if (formulario) formulario.querySelector("[data-remover-foto]").hidden = !foto;
    }

    atualizar();
    if (!formulario) return;
    const arquivo = formulario.querySelector("input[type=file]");
    const aviso = formulario.querySelector("[data-status-foto]");
    formulario.onsubmit = evento => {
        evento.preventDefault();
        const imagem = arquivo.files[0];
        if (!imagem || imagem.size > 1048576 || !["image/png","image/jpeg","image/webp"].includes(imagem.type)) {
            aviso.textContent = "Escolha uma imagem JPG, PNG ou WebP de até 1 MB.";
            return;
        }
        const leitor = new FileReader();
        leitor.onload = () => {
            try {
                localStorage.setItem(chave, leitor.result);
                foto = leitor.result;
                atualizar();
                formulario.reset();
                aviso.textContent = "Foto salva.";
            } catch { aviso.textContent = "Não foi possível salvar a foto neste navegador."; }
        };
        leitor.onerror = () => { aviso.textContent = "Não foi possível abrir a imagem."; };
        leitor.readAsDataURL(imagem);
    };
    formulario.querySelector("[data-remover-foto]").onclick = () => {
        try {
            localStorage.removeItem(chave);
            foto = null;
            atualizar();
            formulario.reset();
            aviso.textContent = "Foto removida.";
        } catch { aviso.textContent = "Não foi possível remover a foto."; }
    };
}

window.addEventListener("pageshow", mostrarPerfil);
