let conteudos = JSON.parse(localStorage.getItem("conteudosHub")) || [];

const content = document.querySelector(".content");
const title = document.querySelector(".topbar h2");

const processosOutbound = [
  "Picking",
  "Pick to Ship",
  "Packing",
  "HU Assembly",
  "Dispatch",
  "Atrelamento",
  "Found"
];

function salvarConteudos() {
  localStorage.setItem("conteudosHub", JSON.stringify(conteudos));
}

function voltarHome() {
  location.reload();
}

function abrirOutbound() {
  title.textContent = "Outbound";

  content.innerHTML = `
    <div class="hero">
      <div>
        <span class="badge">Área Operacional</span>
        <h3>Outbound</h3>
        <p>Acesse os conteúdos, treinamentos e materiais dos processos de Outbound.</p>
      </div>
      <button onclick="voltarHome()">Voltar</button>
    </div>

    <h3 class="title">Processos de Outbound</h3>

    <div class="grid">
      ${processosOutbound.map(item => `
        <div class="card process-card" data-process="${item}">
          <span>📚</span>
          <h4>${item}</h4>
          <p>Treinamentos, Micro Learning e Interativos.</p>
        </div>
      `).join("")}
    </div>
  `;

  ativarProcessos();
}

function abrirProcesso(processo) {
  title.textContent = processo;

  content.innerHTML = `
    <div class="hero">
      <div>
        <span class="badge">Outbound</span>
        <h3>${processo}</h3>
        <p>Escolha uma categoria para visualizar os conteúdos disponíveis.</p>
      </div>
      <button onclick="abrirOutbound()">Voltar</button>
    </div>

    <h3 class="title">Conteúdos de ${processo}</h3>

    <div class="grid">
      <div class="card category-card" data-process="${processo}" data-category="Treinamentos">
        <span>🎓</span>
        <h4>Treinamentos</h4>
        <p>Apresentações completas e materiais oficiais.</p>
      </div>

      <div class="card category-card" data-process="${processo}" data-category="Micro Learning">
        <span>⚡</span>
        <h4>Micro Learning</h4>
        <p>Conteúdos rápidos e objetivos.</p>
      </div>

      <div class="card category-card" data-process="${processo}" data-category="Interativos">
        <span>🧩</span>
        <h4>Interativos</h4>
        <p>Quizzes, simulações e atividades práticas.</p>
      </div>
    </div>
  `;

  ativarCategorias();
}

function abrirCategoria(processo, categoria) {
  title.textContent = categoria;

  const itens = conteudos.filter(item =>
    item.area === "Outbound" &&
    item.processo === processo &&
    item.categoria === categoria
  );

  content.innerHTML = `
    <div class="hero">
      <div>
        <span class="badge">${processo}</span>
        <h3>${categoria}</h3>
        <p>Conteúdos cadastrados para ${categoria} do processo de ${processo}.</p>
      </div>
      <button onclick="abrirProcesso('${processo}')">Voltar</button>
    </div>

    <h3 class="title">${categoria} disponíveis</h3>

    ${
      itens.length === 0
      ? `<div class="empty">Nenhum conteúdo cadastrado ainda.</div>`
      : `<div class="list">
          ${itens.map(item => `
            <div class="list-item">
              <div>
                <h4>${item.titulo}</h4>
                <p>${item.descricao}</p>
                <p><strong>👥 Público-alvo:</strong> ${item.publico}</p>
<p><strong>👤 Responsável:</strong> ${item.responsavel}</p>
<p><strong>📅 Atualização:</strong> ${item.data}</p>
              </div>

              <a href="${item.link}" target="_blank">Abrir material →</a>
            </div>
          `).join("")}
        </div>`
    }
  `;
}

function abrirAdmin() {
  title.textContent = "Administração";

  content.innerHTML = `
    <div class="hero">
      <div>
        <span class="badge">Administração</span>
        <h3>Cadastrar conteúdo</h3>
        <p>Adicione treinamentos, Micro Learning e Interativos no Hub Operacional.</p>
      </div>
    </div>

    <form class="admin-form" id="adminForm">
      <select id="area" required>
        <option value="Outbound">Outbound</option>
      </select>

      <select id="processo" required>
        ${processosOutbound.map(p => `<option value="${p}">${p}</option>`).join("")}
      </select>

      <select id="categoria" required>
        <option value="Treinamentos">Treinamentos</option>
        <option value="Micro Learning">Micro Learning</option>
        <option value="Interativos">Interativos</option>
      </select>

      <input id="titulo" type="text" placeholder="Nome do conteúdo" required>

      <textarea id="descricao" placeholder="Descrição do conteúdo" required></textarea>

      <input id="publico" type="text" placeholder="Público-alvo" required>

      <input id="responsavel" type="text" placeholder="Responsável" required>

      <input id="data" type="date" required>

      <input id="link" type="url" placeholder="Link do material" required>

      <button type="submit">Salvar conteúdo</button>
    </form>

    <h3 class="title" style="margin-top:30px;">Conteúdos cadastrados</h3>

    <div class="list">
      ${
        conteudos.length === 0
        ? `<div class="empty">Nenhum conteúdo cadastrado ainda.</div>`
        : conteudos.map((item, index) => `
          <div class="list-item">
            <div>
              <h4>${item.titulo}</h4>
              <p>${item.area} > ${item.processo} > ${item.categoria}</p>
              <p>${item.descricao}</p>
            </div>

<div class="admin-actions">
  <button class="view-btn" onclick="visualizarConteudo(${index})">Visualizar</button>
  <button class="edit-btn" onclick="editarConteudo(${index})">Editar</button>
  <button class="delete-btn" onclick="excluirConteudo(${index})">Excluir</button>
</div>          </div>
        `).join("")
      }
    </div>
  `;

  document.getElementById("adminForm").addEventListener("submit", salvarFormulario);
}

function salvarFormulario(e) {
  e.preventDefault();

  const novoConteudo = {
    area: document.getElementById("area").value,
    processo: document.getElementById("processo").value,
    categoria: document.getElementById("categoria").value,
    titulo: document.getElementById("titulo").value,
    descricao: document.getElementById("descricao").value,
publico: document.getElementById("publico").value,
responsavel: document.getElementById("responsavel").value,
    data: document.getElementById("data").value,
    link: document.getElementById("link").value
  };

  conteudos.push(novoConteudo);
  salvarConteudos();
  abrirAdmin();
}

function excluirConteudo(index) {
  conteudos.splice(index, 1);
  salvarConteudos();
  abrirAdmin();
}

function ativarProcessos() {
  document.querySelectorAll(".process-card").forEach(card => {
    card.addEventListener("click", () => {
      abrirProcesso(card.dataset.process);
    });
  });
}

function ativarCategorias() {
  document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      abrirCategoria(card.dataset.process, card.dataset.category);
    });
  });
}

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const area = card.querySelector("h4").textContent.trim();

    if (area === "Outbound") {
      abrirOutbound();
    }
  });
});

document.querySelectorAll(".menu-item").forEach(item => {
  item.addEventListener("click", () => {
    const area = item.textContent.trim();

    document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    if (area === "Outbound") abrirOutbound();
    if (area === "Administração") abrirAdmin();
    if (area === "Página Inicial") voltarHome();
  });
});
function visualizarConteudo(index) {
  const item = conteudos[index];

  alert(
    `Título: ${item.titulo}\n\n` +
    `Área: ${item.area}\n` +
    `Processo: ${item.processo}\n` +
    `Categoria: ${item.categoria}\n\n` +
    `Descrição: ${item.descricao}\n\n` +
    `Público-alvo: ${item.publico}\n` +
    `Responsável: ${item.responsavel}\n` +
    `Atualização: ${item.data}\n\n` +
    `Link: ${item.link}`
  );
}

function editarConteudo(index) {
  const item = conteudos[index];

  abrirAdmin();

  document.getElementById("area").value = item.area;
  document.getElementById("processo").value = item.processo;
  document.getElementById("categoria").value = item.categoria;
  document.getElementById("titulo").value = item.titulo;
  document.getElementById("descricao").value = item.descricao;
  document.getElementById("publico").value = item.publico;
  document.getElementById("responsavel").value = item.responsavel;
  document.getElementById("data").value = item.data;
  document.getElementById("link").value = item.link;

  conteudos.splice(index, 1);
  salvarConteudos();

  window.scrollTo({ top: 0, behavior: "smooth" });
}
const pesquisa = document.getElementById("pesquisaGlobal");

if (pesquisa) {
  pesquisa.addEventListener("input", pesquisarConteudos);
}

function pesquisarConteudos() {
  const termo = pesquisa.value.toLowerCase().trim();

  if (termo === "") {
    return;
  }

  const resultados = conteudos.filter(item =>
    item.titulo.toLowerCase().includes(termo) ||
    item.descricao.toLowerCase().includes(termo) ||
    item.processo.toLowerCase().includes(termo)
  );

  content.innerHTML = `
    <div class="hero">
      <div>
        <span class="badge">Pesquisa</span>
        <h3>Resultados encontrados</h3>
        <p>${resultados.length} conteúdo(s) encontrados.</p>
      </div>
      <button onclick="voltarHome()">Voltar</button>
    </div>

    <div class="search-results">
      ${
        resultados.length === 0
        ? `<div class="empty">Nenhum conteúdo encontrado.</div>`
        : resultados.map(item => `
            <div class="search-item">
              <div class="search-path">
                ${item.area} > ${item.processo} > ${item.categoria}
              </div>

              <h4>${item.titulo}</h4>

              <p>${item.descricao}</p>

              <br>

              <a href="${item.link}" target="_blank">
                Abrir material →
              </a>
            </div>
          `).join("")
      }
    </div>
  `;
}