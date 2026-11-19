
const paginasDoPerfil = {
    cliente: "index-cliente.html",
    loja: "index-loja.html",
    entregador: "index-entregador.html",
    admin: "painel-admin.html"
};

const contaAdministradora = { email: "admin@hashi.com", senha: "123456", tipo: "admin", nome: "Administrador" };

const contasDeTeste = [
    { email: "cliente@hashi.com", senha: "123456", tipo: "cliente", nome: "Cliente" },
    { email: "loja@hashi.com", senha: "123456", tipo: "loja", nome: "Loja" },
    { email: "entregador@hashi.com", senha: "123456", tipo: "entregador", nome: "Entregador" }
];

const chaveSessao = "hashi-sessao";
const perfilDaPagina = document.body.dataset.painelPerfil;
const formularioLogin = document.getElementById("form-login");
const emPaginaInicial = Boolean(formularioLogin);
const caminhoHtml = emPaginaInicial ? "Html/" : "";
const caminhoInicio = emPaginaInicial ? "index.html" : "../index.html";

function lerSessao() {
    try {
        return JSON.parse(sessionStorage.getItem(chaveSessao));
    } catch {
        return null;
    }
}

function lerContasLocais() {
    try {
        const contas = JSON.parse(localStorage.getItem("usuariosHashi"));
        return Array.isArray(contas) ? contas : [];
    } catch {
        return [];
    }
}

function listarContasHashi() {
    const contas = new Map();
    for (const conta of [...contasDeTeste, ...lerContasLocais()]) {
        if (!conta || typeof conta.email !== "string" || !["cliente", "loja", "entregador"].includes(conta.tipo)) continue;
        const email = conta.email.trim().toLowerCase();
        if (email && email !== contaAdministradora.email) contas.set(email, { ...conta, email });
    }
    contas.set(contaAdministradora.email, contaAdministradora);
    return [...contas.values()];
}

function conferirPerfil() {
    const paginaPublica = document.body.dataset.paginaPublica;
    if (!perfilDaPagina && !paginaPublica && !emPaginaInicial) return;
    const sessao = lerSessao();
    if (emPaginaInicial) {
        if (!location.hash && sessao?.email && Object.hasOwn(paginasDoPerfil, sessao.tipo)) {
            location.replace(caminhoHtml + paginasDoPerfil[sessao.tipo]);
        }
        return;
    }
    if (paginaPublica) {
        if (!sessao?.email || !Object.hasOwn(paginasDoPerfil, sessao.tipo)) return;
        if (sessao.tipo === "admin" && paginaPublica === "carrinho") {
            location.replace(paginasDoPerfil.admin);
            return;
        }
        const pagina = sessao.tipo === "admin" && paginaPublica === "cardapios" ? "cardapio" : paginaPublica;
        location.replace(pagina + "-" + sessao.tipo + ".html" + location.search + location.hash);
        return;
    }
    if (!sessao?.email || !Object.hasOwn(paginasDoPerfil, sessao.tipo)) {
        sessionStorage.removeItem(chaveSessao);
        location.replace(caminhoInicio + "#flex-login");
    } else if (sessao.tipo !== perfilDaPagina) {
        location.replace(paginasDoPerfil[sessao.tipo]);
    }
}

conferirPerfil();
window.addEventListener("pageshow", conferirPerfil);

for (const link of document.querySelectorAll("[data-encerrar-login]")) {
    link.addEventListener("click", () => sessionStorage.removeItem(chaveSessao));
}

const sessao = lerSessao();
if (sessao?.email && Object.hasOwn(paginasDoPerfil, sessao.tipo)) {
    for (const link of document.querySelectorAll(".conta-buttom")) {
        const paginaConta = sessao.tipo === "admin" ? paginasDoPerfil.admin : "conta-" + sessao.tipo + ".html";
        link.href = caminhoHtml + paginaConta;
    }
    for (const nome of document.querySelectorAll("[data-nome-conta]")) {
        nome.textContent = sessao.nome;
    }
}

if (formularioLogin) {
    formularioLogin.addEventListener("submit", evento => {
        evento.preventDefault();
        const email = formularioLogin.elements.email.value.trim().toLowerCase();
        const senha = formularioLogin.elements.senha.value;
        const aviso = document.getElementById("aviso-login");
        const conta = listarContasHashi().find(usuario => usuario.email === email && usuario.senha === senha);

        if (!conta) {
            aviso.textContent = "E-mail ou senha incorretos.";
            return;
        }

        try {
            sessionStorage.setItem(chaveSessao, JSON.stringify({ tipo: conta.tipo, nome: conta.nome, email: conta.email }));
        } catch {
            aviso.textContent = "O navegador bloqueou a sessão. Abra o site pelo servidor local.";
            return;
        }
        location.href = caminhoHtml + paginasDoPerfil[conta.tipo];
    });
}

for (const botao of document.querySelectorAll(".visualizar-senha")) {
    const campo = document.getElementById(botao.getAttribute("aria-controls"));
    botao.hidden = false;
    botao.setAttribute("aria-label", "Mostrar senha");
    botao.addEventListener("click", () => {
        const mostrar = campo.type === "password";
        campo.type = mostrar ? "text" : "password";
        if (!botao.classList.contains("visualizar-senha-icone")) {
            botao.textContent = mostrar ? "Ocultar" : "Mostrar";
        }
        botao.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
    });
}
