/* =========================================================
   MÓDULO — RESERVA DO AUDITÓRIO
   HUB OPERACIONAL
   Versão Front-end / LocalStorage
========================================================= */

const usuarioAuditorio = {
  nome: "Larissa da Silva Pereira",
  email: "larissa@mercadolibre.com",
  perfil: "operacoes"
};

const CHAVE_RESERVAS_AUDITORIO = "reservasAuditorio";

/* =========================================================
   DADOS INICIAIS
========================================================= */

let reservasAuditorio =
  JSON.parse(localStorage.getItem(CHAVE_RESERVAS_AUDITORIO)) || [
    {
      id: "reserva-exemplo-1",
      protocolo: "AUD-000001",
      solicitante: "Equipe Training",
      email: "training@mercadolibre.com",
      area: "Training",
      gestor: "Training",
      data: obterDataFuturaAuditorio(1),
      hora_inicio: "09:00",
      hora_fim: "11:00",
      participantes: 30,
      tipo_evento: "Onboarding",
      motivo: "Integração de novos colaboradores",
      recursos: ["Projetor", "Notebook"],
      observacoes: "",
      status: "Aprovada",
      justificativa: "",
      aprovador: "Training",
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    },
    {
      id: "reserva-exemplo-2",
      protocolo: "AUD-000002",
      solicitante: usuarioAuditorio.nome,
      email: usuarioAuditorio.email,
      area: "Outbound",
      gestor: "Gestão Outbound",
      data: obterDataFuturaAuditorio(3),
      hora_inicio: "14:00",
      hora_fim: "16:00",
      participantes: 25,
      tipo_evento: "Treinamento",
      motivo: "Treinamento operacional de Picking",
      recursos: ["Projetor"],
      observacoes: "Necessário organizar as cadeiras em formato de auditório.",
      status: "Aguardando aprovação",
      justificativa: "",
      aprovador: "",
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    }
  ];

salvarReservasAuditorio();

/* =========================================================
   FUNÇÕES BÁSICAS
========================================================= */

function obterContentAuditorio() {
  return document.querySelector(".content");
}

function atualizarTituloAuditorio(titulo) {
  const elementoTitulo = document.querySelector(".topbar h2");

  if (elementoTitulo) {
    elementoTitulo.textContent = titulo;
  }
}

function salvarReservasAuditorio() {
  localStorage.setItem(
    CHAVE_RESERVAS_AUDITORIO,
    JSON.stringify(reservasAuditorio)
  );
}

function obterDataFuturaAuditorio(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);

  return formatarDataISOAuditorio(data);
}

function obterDataHojeAuditorio() {
  return formatarDataISOAuditorio(new Date());
}

function formatarDataISOAuditorio(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function formatarDataAuditorio(dataISO) {
  if (!dataISO) {
    return "";
  }

  const [ano, mes, dia] = dataISO.split("-");

  return `${dia}/${mes}/${ano}`;
}

function formatarDataHoraAuditorio(dataISO) {
  if (!dataISO) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(dataISO));
}

function gerarIdAuditorio() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `aud-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function gerarProtocoloAuditorio() {
  const maiorNumero = reservasAuditorio.reduce((maior, reserva) => {
    const numero = Number(
      String(reserva.protocolo || "").replace(/\D/g, "")
    );

    return Number.isFinite(numero) && numero > maior
      ? numero
      : maior;
  }, 0);

  return `AUD-${String(maiorNumero + 1).padStart(6, "0")}`;
}

function obterMinhasSolicitacoesAuditorio() {
  return reservasAuditorio.filter(
    reserva => reserva.email === usuarioAuditorio.email
  );
}

function normalizarTextoAuditorio(texto) {
  return String(texto || "")
    .trim()
    .toLowerCase();
}

function obterClasseStatusAuditorio(status) {
  const statusNormalizado = normalizarTextoAuditorio(status);

  if (statusNormalizado === "aprovada") {
    return "status-aprovada";
  }

  if (statusNormalizado === "recusada") {
    return "status-recusada";
  }

  if (statusNormalizado === "alteração solicitada") {
    return "status-alteracao";
  }

  if (statusNormalizado === "cancelada") {
    return "status-cancelada";
  }

  if (statusNormalizado === "concluída") {
    return "status-concluida";
  }

  return "status-pendente";
}

function obterIconeStatusAuditorio(status) {
  const statusNormalizado = normalizarTextoAuditorio(status);

  if (statusNormalizado === "aprovada") {
    return "🟢";
  }

  if (statusNormalizado === "recusada") {
    return "🔴";
  }

  if (statusNormalizado === "alteração solicitada") {
    return "🔵";
  }

  if (statusNormalizado === "cancelada") {
    return "⚫";
  }

  if (statusNormalizado === "concluída") {
    return "✅";
  }

  return "🟡";
}

function voltarAoTopoAuditorio() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* =========================================================
   PAINEL PRINCIPAL
========================================================= */

function abrirAuditorio() {
  const content = obterContentAuditorio();

  if (!content) {
    console.error("A área principal do Hub não foi encontrada.");
    return;
  }

  atualizarTituloAuditorio("Reserva do Auditório");

  const minhasSolicitacoes = obterMinhasSolicitacoesAuditorio();

  const pendentes = minhasSolicitacoes.filter(
    reserva => reserva.status === "Aguardando aprovação"
  ).length;

  const aprovadas = minhasSolicitacoes.filter(
    reserva => reserva.status === "Aprovada"
  ).length;

  const alteracoes = minhasSolicitacoes.filter(
    reserva => reserva.status === "Alteração solicitada"
  ).length;

  content.innerHTML = `
    <div class="hero hero-auditorio">
      <div>
        <span class="badge">Gestão de Espaços</span>

        <h3>🏛️ Reserva do Auditório</h3>

        <p>
          Olá, ${usuarioAuditorio.nome}. Consulte a disponibilidade,
          envie uma nova solicitação e acompanhe a análise do time de Training.
        </p>
      </div>

      <button
        type="button"
        onclick="abrirNovaReservaAuditorio()"
      >
        Nova solicitação
      </button>
    </div>

    <section class="auditorio-resumo-grid">
      <button
        type="button"
        class="auditorio-resumo-card"
        onclick="abrirMinhasSolicitacoesAuditorio()"
      >
        <span>📋 Minhas solicitações</span>
        <strong>${minhasSolicitacoes.length}</strong>
        <small>Todos os pedidos realizados</small>
      </button>

      <button
        type="button"
        class="auditorio-resumo-card"
        onclick="abrirMinhasSolicitacoesAuditorio('Aguardando aprovação')"
      >
        <span>⏳ Aguardando aprovação</span>
        <strong>${pendentes}</strong>
        <small>Solicitações em análise</small>
      </button>

      <button
        type="button"
        class="auditorio-resumo-card"
        onclick="abrirMinhasSolicitacoesAuditorio('Aprovada')"
      >
        <span>✅ Aprovadas</span>
        <strong>${aprovadas}</strong>
        <small>Reservas confirmadas</small>
      </button>

      <button
        type="button"
        class="auditorio-resumo-card"
        onclick="abrirMinhasSolicitacoesAuditorio('Alteração solicitada')"
      >
        <span>🔵 Alterações solicitadas</span>
        <strong>${alteracoes}</strong>
        <small>Pedidos que precisam de ajuste</small>
      </button>
    </section>

    <div class="auditorio-section-heading">
      <div>
        <h3>Calendário de disponibilidade</h3>

        <p>
          Clique em um dia para consultar os horários ocupados
          ou iniciar uma nova solicitação.
        </p>
      </div>

      <button
        type="button"
        class="auditorio-btn-secundario"
        onclick="abrirAgendaAuditorio()"
      >
        Ver agenda completa
      </button>
    </div>

    ${criarCalendarioAuditorio()}

    <div class="auditorio-section-heading auditorio-acessos-heading">
      <div>
        <h3>Acessos rápidos</h3>
        <p>Escolha uma opção para continuar.</p>
      </div>
    </div>

    <div class="grid grid-auditorio">
      <div
        class="card card-opcao-auditorio"
        role="button"
        tabindex="0"
        onclick="abrirNovaReservaAuditorio()"
      >
        <span>📝</span>
        <h4>Nova solicitação</h4>
        <p>
          Informe data, horário, participantes, evento
          e os recursos necessários.
        </p>
      </div>

      <div
        class="card card-opcao-auditorio"
        role="button"
        tabindex="0"
        onclick="abrirAgendaAuditorio()"
      >
        <span>📅</span>
        <h4>Agenda completa</h4>
        <p>
          Consulte as reservas aprovadas e os horários
          que estão em análise.
        </p>
      </div>

      <div
        class="card card-opcao-auditorio"
        role="button"
        tabindex="0"
        onclick="abrirMinhasSolicitacoesAuditorio()"
      >
        <span>📋</span>
        <h4>Minhas solicitações</h4>
        <p>
          Acompanhe aprovações, recusas, cancelamentos
          e solicitações de alteração.
        </p>
      </div>
    </div>
  `;

  voltarAoTopoAuditorio();
}

/* =========================================================
   CALENDÁRIO
========================================================= */

function criarCalendarioAuditorio() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  const primeiroDiaSemana = new Date(
    ano,
    mes,
    1
  ).getDay();

  const quantidadeDias = new Date(
    ano,
    mes + 1,
    0
  ).getDate();

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];

  let diasHTML = "";

  for (let i = 0; i < primeiroDiaSemana; i += 1) {
    diasHTML += `
      <div class="calendario-dia vazio"></div>
    `;
  }

  for (let dia = 1; dia <= quantidadeDias; dia += 1) {
    const dataISO =
      `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

    const reservasDoDia = reservasAuditorio.filter(
      reserva =>
        reserva.data === dataISO &&
        reserva.status !== "Recusada" &&
        reserva.status !== "Cancelada"
    );

    const quantidadeReservas = reservasDoDia.length;

    let classeStatus = "disponivel";
    let descricaoStatus = "Livre";
    let iconeStatus = "🟢";

    if (quantidadeReservas >= 3) {
      classeStatus = "indisponivel";
      descricaoStatus = "Ocupado";
      iconeStatus = "🔴";
    } else if (quantidadeReservas > 0) {
      classeStatus = "parcial";
      descricaoStatus = "Parcial";
      iconeStatus = "🟡";
    }

    const ehHoje = dataISO === obterDataHojeAuditorio();

    diasHTML += `
      <button
        type="button"
        class="calendario-dia ${classeStatus} ${ehHoje ? "hoje" : ""}"
        onclick="abrirDiaAuditorio('${dataISO}')"
        title="${formatarDataAuditorio(dataISO)} — ${descricaoStatus}"
      >
        <div class="calendario-dia-topo">
          <strong>${dia}</strong>
          <span>${iconeStatus}</span>
        </div>

        <small>${descricaoStatus}</small>
      </button>
    `;
  }

  return `
    <section class="calendario-auditorio">
      <div class="calendario-cabecalho">
        <div>
          <h3>${meses[mes]} de ${ano}</h3>
          <p>Disponibilidade atual do auditório.</p>
        </div>

        <div class="calendario-legenda">
          <span>🟢 Livre</span>
          <span>🟡 Parcial</span>
          <span>🔴 Ocupado</span>
          <span>⚫ Bloqueado</span>
        </div>
      </div>

      <div class="calendario-semana">
        <span>Dom</span>
        <span>Seg</span>
        <span>Ter</span>
        <span>Qua</span>
        <span>Qui</span>
        <span>Sex</span>
        <span>Sáb</span>
      </div>

      <div class="calendario-grid">
        ${diasHTML}
      </div>
    </section>
  `;
}

function abrirDiaAuditorio(dataSelecionada) {
  const content = obterContentAuditorio();

  if (!content) {
    return;
  }

  atualizarTituloAuditorio("Disponibilidade do Auditório");

  const reservasDoDia = reservasAuditorio
    .filter(
      reserva =>
        reserva.data === dataSelecionada &&
        reserva.status !== "Recusada" &&
        reserva.status !== "Cancelada"
    )
    .sort((a, b) =>
      a.hora_inicio.localeCompare(b.hora_inicio)
    );

  content.innerHTML = `
    ${criarCabecalhoInternoAuditorio(
      "📅 Disponibilidade do dia",
      formatarDataAuditorio(dataSelecionada),
      "abrirAuditorio()"
    )}

    <div class="auditorio-dia-acoes">
      <div>
        <h3>Horários do dia</h3>
        <p>
          Consulte os períodos já utilizados ou solicite um horário disponível.
        </p>
      </div>

      <button
        type="button"
        class="auditorio-btn-principal"
        onclick="abrirNovaReservaAuditorio('${dataSelecionada}')"
      >
        Solicitar este dia
      </button>
    </div>

    ${
      reservasDoDia.length === 0
        ? `
          <div class="auditorio-empty">
            <span>🟢</span>
            <h3>Dia totalmente disponível</h3>
            <p>
              Ainda não existem reservas ou solicitações para este dia.
            </p>

            <button
              type="button"
              class="auditorio-btn-principal"
              onclick="abrirNovaReservaAuditorio('${dataSelecionada}')"
            >
              Criar solicitação
            </button>
          </div>
        `
        : `
          <div class="auditorio-agenda-lista">
            ${reservasDoDia
              .map(criarCardAgendaAuditorio)
              .join("")}
          </div>
        `
    }
  `;

  voltarAoTopoAuditorio();
}

function criarCardAgendaAuditorio(reserva) {
  return `
    <article class="auditorio-agenda-card">
      <div class="auditorio-agenda-horario">
        <strong>
          ${reserva.hora_inicio}
        </strong>

        <span>até</span>

        <strong>
          ${reserva.hora_fim}
        </strong>
      </div>

      <div class="auditorio-agenda-conteudo">
        <div class="auditorio-agenda-topo">
          <div>
            <span class="auditorio-area-tag">
              ${reserva.area}
            </span>

            <h3>${reserva.tipo_evento}</h3>
          </div>

          <span
            class="auditorio-status ${obterClasseStatusAuditorio(reserva.status)}"
          >
            ${obterIconeStatusAuditorio(reserva.status)}
            ${reserva.status}
          </span>
        </div>

        <p>${reserva.motivo}</p>

        <div class="auditorio-agenda-dados">
          <span>👥 ${reserva.participantes} participantes</span>
          <span>🏷️ ${reserva.protocolo}</span>
        </div>
      </div>
    </article>
  `;
}

/* =========================================================
   NOVA SOLICITAÇÃO
========================================================= */

function abrirNovaReservaAuditorio(dataSelecionada = "") {
  const content = obterContentAuditorio();

  if (!content) {
    return;
  }

  atualizarTituloAuditorio("Nova solicitação");

  const dataMinima = obterDataHojeAuditorio();

  content.innerHTML = `
    ${criarCabecalhoInternoAuditorio(
      "📝 Nova solicitação",
      "Preencha os dados para enviar a reserva ao time de Training.",
      "abrirAuditorio()"
    )}

    <form
      class="auditorio-form"
      id="formReservaAuditorio"
    >
      <section class="auditorio-form-section">
        <div class="auditorio-form-section-title">
          <span>01</span>

          <div>
            <h3>Solicitante</h3>
            <p>Informações de quem está realizando a solicitação.</p>
          </div>
        </div>

        <div class="auditorio-form-grid duas-colunas">
          <label class="auditorio-field">
            <span>Nome do solicitante</span>

            <input
              type="text"
              id="solicitanteAuditorio"
              value="${usuarioAuditorio.nome}"
              readonly
            >
          </label>

          <label class="auditorio-field">
            <span>E-mail corporativo</span>

            <input
              type="email"
              id="emailAuditorio"
              value="${usuarioAuditorio.email}"
              readonly
            >
          </label>

          <label class="auditorio-field">
            <span>Área</span>

            <select id="areaAuditorio" required>
              <option value="">Selecione a área</option>
              <option value="Outbound">Outbound</option>
              <option value="Inbound">Inbound</option>
              <option value="MWH">MWH</option>
              <option value="Retiros">Retiros</option>
              <option value="CIE">CIE</option>
              <option value="ICQA">ICQA</option>
              <option value="Manutenção">Manutenção</option>
              <option value="RC em FC">RC em FC</option>
              <option value="Training">Training</option>
              <option value="Administração">Administração</option>
              <option value="Outra">Outra</option>
            </select>
          </label>

          <label class="auditorio-field">
            <span>Gestor responsável</span>

            <input
              type="text"
              id="gestorAuditorio"
              placeholder="Nome do gestor ou liderança"
              required
            >
          </label>
        </div>
      </section>

      <section class="auditorio-form-section">
        <div class="auditorio-form-section-title">
          <span>02</span>

          <div>
            <h3>Data e horário</h3>
            <p>Informe quando o auditório será utilizado.</p>
          </div>
        </div>

        <div class="auditorio-form-grid tres-colunas">
          <label class="auditorio-field">
            <span>Data da reserva</span>

            <input
              type="date"
              id="dataAuditorio"
              value="${dataSelecionada}"
              min="${dataMinima}"
              required
            >
          </label>

          <label class="auditorio-field">
            <span>Horário inicial</span>

            <input
              type="time"
              id="inicioAuditorio"
              required
            >
          </label>

          <label class="auditorio-field">
            <span>Horário final</span>

            <input
              type="time"
              id="fimAuditorio"
              required
            >
          </label>
        </div>
      </section>

      <section class="auditorio-form-section">
        <div class="auditorio-form-section-title">
          <span>03</span>

          <div>
            <h3>Detalhes do evento</h3>
            <p>Explique o motivo e o formato da utilização.</p>
          </div>
        </div>

        <div class="auditorio-form-grid duas-colunas">
          <label class="auditorio-field">
            <span>Tipo de evento</span>

            <select id="tipoEventoAuditorio" required>
              <option value="">Selecione o tipo</option>
              <option value="Treinamento">Treinamento</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Reunião">Reunião</option>
              <option value="Workshop">Workshop</option>
              <option value="Evento">Evento</option>
              <option value="Apresentação">Apresentação</option>
              <option value="Alinhamento">Alinhamento</option>
              <option value="Outro">Outro</option>
            </select>
          </label>

          <label class="auditorio-field">
            <span>Quantidade de participantes</span>

            <input
              type="number"
              id="participantesAuditorio"
              min="1"
              max="200"
              placeholder="Ex.: 30"
              required
            >
          </label>
        </div>

        <label class="auditorio-field">
          <span>Motivo da reserva</span>

          <textarea
            id="motivoAuditorio"
            placeholder="Explique o objetivo do evento ou treinamento."
            required
          ></textarea>
        </label>
      </section>

      <section class="auditorio-form-section">
        <div class="auditorio-form-section-title">
          <span>04</span>

          <div>
            <h3>Recursos necessários</h3>
            <p>Selecione os itens necessários para o evento.</p>
          </div>
        </div>

        <div class="auditorio-recursos-grid">
          ${criarOpcaoRecursoAuditorio("Projetor", "📽️")}
          ${criarOpcaoRecursoAuditorio("Notebook", "💻")}
          ${criarOpcaoRecursoAuditorio("Microfone", "🎤")}
          ${criarOpcaoRecursoAuditorio("Caixa de som", "🔊")}
          ${criarOpcaoRecursoAuditorio("Flip chart", "📋")}
          ${criarOpcaoRecursoAuditorio("Coffee break", "☕")}
          ${criarOpcaoRecursoAuditorio("HDMI", "🔌")}
          ${criarOpcaoRecursoAuditorio("Internet", "📶")}
        </div>

        <label class="auditorio-field auditorio-observacoes">
          <span>Observações adicionais</span>

          <textarea
            id="observacoesAuditorio"
            placeholder="Informe necessidades de organização, montagem ou outras observações."
          ></textarea>
        </label>
      </section>

      <div class="auditorio-form-actions">
        <button
          type="button"
          class="auditorio-btn-cancelar"
          onclick="abrirAuditorio()"
        >
          Cancelar
        </button>

        <button
          type="submit"
          class="auditorio-btn-principal"
        >
          Enviar solicitação
        </button>
      </div>
    </form>
  `;

  const formulario = document.getElementById(
    "formReservaAuditorio"
  );

  formulario.addEventListener(
    "submit",
    salvarNovaReservaAuditorio
  );

  voltarAoTopoAuditorio();
}

function criarOpcaoRecursoAuditorio(nome, icone) {
  return `
    <label class="auditorio-recurso-option">
      <input
        type="checkbox"
        name="recursosAuditorio"
        value="${nome}"
      >

      <span class="auditorio-recurso-check"></span>

      <div>
        <strong>${icone}</strong>
        <span>${nome}</span>
      </div>
    </label>
  `;
}

function salvarNovaReservaAuditorio(evento) {
  evento.preventDefault();

  const area = document
    .getElementById("areaAuditorio")
    .value;

  const gestor = document
    .getElementById("gestorAuditorio")
    .value
    .trim();

  const data = document
    .getElementById("dataAuditorio")
    .value;

  const horaInicio = document
    .getElementById("inicioAuditorio")
    .value;

  const horaFim = document
    .getElementById("fimAuditorio")
    .value;

  const tipoEvento = document
    .getElementById("tipoEventoAuditorio")
    .value;

  const participantes = Number(
    document.getElementById("participantesAuditorio").value
  );

  const motivo = document
    .getElementById("motivoAuditorio")
    .value
    .trim();

  const observacoes = document
    .getElementById("observacoesAuditorio")
    .value
    .trim();

  const recursos = Array.from(
    document.querySelectorAll(
      'input[name="recursosAuditorio"]:checked'
    )
  ).map(input => input.value);

  if (!area || !gestor || !data || !horaInicio || !horaFim) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  if (horaFim <= horaInicio) {
    alert(
      "O horário final deve ser maior que o horário inicial."
    );
    return;
  }

  if (!participantes || participantes < 1) {
    alert(
      "Informe uma quantidade válida de participantes."
    );
    return;
  }

  const existeConflito = reservasAuditorio.some(reserva => {
    const statusIgnorado =
      reserva.status === "Recusada" ||
      reserva.status === "Cancelada";

    return (
      reserva.data === data &&
      !statusIgnorado &&
      horaInicio < reserva.hora_fim &&
      horaFim > reserva.hora_inicio
    );
  });

  if (existeConflito) {
    alert(
      "Já existe uma reserva ou solicitação nesse intervalo. Consulte a agenda e escolha outro horário."
    );
    return;
  }

  const agora = new Date().toISOString();

  const novaReserva = {
    id: gerarIdAuditorio(),
    protocolo: gerarProtocoloAuditorio(),
    solicitante: usuarioAuditorio.nome,
    email: usuarioAuditorio.email,
    area,
    gestor,
    data,
    hora_inicio: horaInicio,
    hora_fim: horaFim,
    participantes,
    tipo_evento: tipoEvento,
    motivo,
    recursos,
    observacoes,
    status: "Aguardando aprovação",
    justificativa: "",
    aprovador: "",
    criado_em: agora,
    atualizado_em: agora
  };

  reservasAuditorio.push(novaReserva);
  salvarReservasAuditorio();

  abrirConfirmacaoReservaAuditorio(novaReserva);
}

/* =========================================================
   CONFIRMAÇÃO
========================================================= */

function abrirConfirmacaoReservaAuditorio(reserva) {
  const content = obterContentAuditorio();

  atualizarTituloAuditorio("Solicitação enviada");

  content.innerHTML = `
    <section class="auditorio-confirmacao">
      <div class="auditorio-confirmacao-icon">
        ✓
      </div>

      <span class="auditorio-confirmacao-tag">
        Solicitação registrada
      </span>

      <h2>Solicitação enviada com sucesso!</h2>

      <p>
        A reserva foi enviada ao time de Training
        e está aguardando análise.
      </p>

      <div class="auditorio-confirmacao-protocolo">
        <span>Protocolo</span>
        <strong>${reserva.protocolo}</strong>
      </div>

      <div class="auditorio-confirmacao-dados">
        <div>
          <span>📅 Data</span>
          <strong>${formatarDataAuditorio(reserva.data)}</strong>
        </div>

        <div>
          <span>🕘 Horário</span>
          <strong>
            ${reserva.hora_inicio} às ${reserva.hora_fim}
          </strong>
        </div>

        <div>
          <span>🏢 Área</span>
          <strong>${reserva.area}</strong>
        </div>

        <div>
          <span>📌 Status</span>
          <strong>🟡 Aguardando aprovação</strong>
        </div>
      </div>

      <div class="auditorio-confirmacao-actions">
        <button
          type="button"
          class="auditorio-btn-secundario"
          onclick="abrirAuditorio()"
        >
          Voltar ao painel
        </button>

        <button
          type="button"
          class="auditorio-btn-principal"
          onclick="abrirMinhasSolicitacoesAuditorio()"
        >
          Ver minhas solicitações
        </button>
      </div>
    </section>
  `;

  voltarAoTopoAuditorio();
}

/* =========================================================
   MINHAS SOLICITAÇÕES
========================================================= */

function abrirMinhasSolicitacoesAuditorio(
  filtroStatus = ""
) {
  const content = obterContentAuditorio();

  atualizarTituloAuditorio("Minhas solicitações");

  let minhasSolicitacoes =
    obterMinhasSolicitacoesAuditorio()
      .sort((a, b) =>
        new Date(b.criado_em) - new Date(a.criado_em)
      );

  if (filtroStatus) {
    minhasSolicitacoes = minhasSolicitacoes.filter(
      reserva => reserva.status === filtroStatus
    );
  }

  content.innerHTML = `
    ${criarCabecalhoInternoAuditorio(
      "📋 Minhas solicitações",
      "Acompanhe todos os pedidos enviados ao time de Training.",
      "abrirAuditorio()"
    )}

    <div class="auditorio-filtros">
      ${criarBotaoFiltroAuditorio(
        "",
        "Todas",
        filtroStatus
      )}

      ${criarBotaoFiltroAuditorio(
        "Aguardando aprovação",
        "Pendentes",
        filtroStatus
      )}

      ${criarBotaoFiltroAuditorio(
        "Aprovada",
        "Aprovadas",
        filtroStatus
      )}

      ${criarBotaoFiltroAuditorio(
        "Alteração solicitada",
        "Alterações",
        filtroStatus
      )}

      ${criarBotaoFiltroAuditorio(
        "Recusada",
        "Recusadas",
        filtroStatus
      )}

      ${criarBotaoFiltroAuditorio(
        "Cancelada",
        "Canceladas",
        filtroStatus
      )}
    </div>

    ${
      minhasSolicitacoes.length === 0
        ? `
          <div class="auditorio-empty">
            <span>📭</span>
            <h3>Nenhuma solicitação encontrada</h3>
            <p>
              Não existem solicitações para o filtro selecionado.
            </p>

            <button
              type="button"
              class="auditorio-btn-principal"
              onclick="abrirNovaReservaAuditorio()"
            >
              Criar nova solicitação
            </button>
          </div>
        `
        : `
          <div class="auditorio-solicitacoes-lista">
            ${minhasSolicitacoes
              .map(criarCardMinhaSolicitacaoAuditorio)
              .join("")}
          </div>
        `
    }
  `;

  voltarAoTopoAuditorio();
}

function criarBotaoFiltroAuditorio(
  status,
  texto,
  filtroAtual
) {
  const ativo = status === filtroAtual;

  return `
    <button
      type="button"
      class="${ativo ? "active" : ""}"
      onclick="abrirMinhasSolicitacoesAuditorio('${status}')"
    >
      ${texto}
    </button>
  `;
}

function criarCardMinhaSolicitacaoAuditorio(reserva) {
  const podeCancelar =
    reserva.status === "Aguardando aprovação";

  return `
    <article class="auditorio-solicitacao-card">
      <div class="auditorio-solicitacao-header">
        <div>
          <span class="auditorio-protocolo">
            ${reserva.protocolo}
          </span>

          <h3>${reserva.tipo_evento}</h3>

          <p>${reserva.motivo}</p>
        </div>

        <span
          class="auditorio-status ${obterClasseStatusAuditorio(reserva.status)}"
        >
          ${obterIconeStatusAuditorio(reserva.status)}
          ${reserva.status}
        </span>
      </div>

      <div class="auditorio-solicitacao-dados">
        <div>
          <span>📅 Data</span>
          <strong>${formatarDataAuditorio(reserva.data)}</strong>
        </div>

        <div>
          <span>🕘 Horário</span>
          <strong>
            ${reserva.hora_inicio} às ${reserva.hora_fim}
          </strong>
        </div>

        <div>
          <span>🏢 Área</span>
          <strong>${reserva.area}</strong>
        </div>

        <div>
          <span>👥 Participantes</span>
          <strong>${reserva.participantes}</strong>
        </div>
      </div>

      ${
        reserva.recursos?.length
          ? `
            <div class="auditorio-solicitacao-recursos">
              <strong>Recursos:</strong>
              ${reserva.recursos
                .map(
                  recurso =>
                    `<span>${recurso}</span>`
                )
                .join("")}
            </div>
          `
          : ""
      }

      ${
        reserva.justificativa
          ? `
            <div class="auditorio-solicitacao-alerta">
              <strong>Retorno do Training:</strong>
              <p>${reserva.justificativa}</p>
            </div>
          `
          : ""
      }

      <div class="auditorio-solicitacao-footer">
        <small>
          Solicitado em:
          ${formatarDataHoraAuditorio(reserva.criado_em)}
        </small>

        ${
          podeCancelar
            ? `
              <button
                type="button"
                class="auditorio-btn-cancelar"
                onclick="cancelarSolicitacaoAuditorio('${reserva.id}')"
              >
                Cancelar solicitação
              </button>
            `
            : ""
        }
      </div>
    </article>
  `;
}

function cancelarSolicitacaoAuditorio(id) {
  const reserva = reservasAuditorio.find(
    item => item.id === id
  );

  if (!reserva) {
    alert("Solicitação não encontrada.");
    return;
  }

  if (reserva.status !== "Aguardando aprovação") {
    alert(
      "Somente solicitações aguardando aprovação podem ser canceladas."
    );
    return;
  }

  const confirmar = confirm(
    `Deseja cancelar a solicitação ${reserva.protocolo}?`
  );

  if (!confirmar) {
    return;
  }

  reserva.status = "Cancelada";
  reserva.atualizado_em = new Date().toISOString();

  salvarReservasAuditorio();
  abrirMinhasSolicitacoesAuditorio();
}

/* =========================================================
   AGENDA COMPLETA
========================================================= */

function abrirAgendaAuditorio() {
  const content = obterContentAuditorio();

  atualizarTituloAuditorio("Agenda do Auditório");

  const reservasAtivas = reservasAuditorio
    .filter(
      reserva =>
        reserva.status !== "Recusada" &&
        reserva.status !== "Cancelada"
    )
    .sort((a, b) => {
      const dataA =
        `${a.data} ${a.hora_inicio}`;

      const dataB =
        `${b.data} ${b.hora_inicio}`;

      return dataA.localeCompare(dataB);
    });

  content.innerHTML = `
    ${criarCabecalhoInternoAuditorio(
      "📅 Agenda do Auditório",
      "Consulte as reservas aprovadas e as solicitações em análise.",
      "abrirAuditorio()"
    )}

    <div class="auditorio-agenda-toolbar">
      <div>
        <h3>Próximas utilizações</h3>
        <p>${reservasAtivas.length} registro(s) encontrado(s).</p>
      </div>

      <button
        type="button"
        class="auditorio-btn-principal"
        onclick="abrirNovaReservaAuditorio()"
      >
        Nova solicitação
      </button>
    </div>

    ${
      reservasAtivas.length === 0
        ? `
          <div class="auditorio-empty">
            <span>📅</span>
            <h3>A agenda está livre</h3>
            <p>Não existem reservas ativas no momento.</p>
          </div>
        `
        : `
          <div class="auditorio-agenda-lista">
            ${reservasAtivas
              .map(criarCardAgendaCompletaAuditorio)
              .join("")}
          </div>
        `
    }
  `;

  voltarAoTopoAuditorio();
}

function criarCardAgendaCompletaAuditorio(reserva) {
  return `
    <article class="auditorio-agenda-card">
      <div class="auditorio-agenda-data">
        <strong>
          ${formatarDataAuditorio(reserva.data)}
        </strong>

        <span>
          ${reserva.hora_inicio} às ${reserva.hora_fim}
        </span>
      </div>

      <div class="auditorio-agenda-conteudo">
        <div class="auditorio-agenda-topo">
          <div>
            <span class="auditorio-area-tag">
              ${reserva.area}
            </span>

            <h3>${reserva.tipo_evento}</h3>
          </div>

          <span
            class="auditorio-status ${obterClasseStatusAuditorio(reserva.status)}"
          >
            ${obterIconeStatusAuditorio(reserva.status)}
            ${reserva.status}
          </span>
        </div>

        <p>${reserva.motivo}</p>

        <div class="auditorio-agenda-dados">
          <span>👥 ${reserva.participantes} participantes</span>
          <span>🏷️ ${reserva.protocolo}</span>
        </div>
      </div>
    </article>
  `;
}

/* =========================================================
   CABEÇALHO INTERNO
========================================================= */

function criarCabecalhoInternoAuditorio(
  titulo,
  descricao,
  acaoVoltar
) {
  return `
    <div class="auditorio-internal-header">
      <div>
        <h2>${titulo}</h2>
        <p>${descricao}</p>
      </div>

      <button
        type="button"
        class="auditorio-btn-secundario"
        onclick="${acaoVoltar}"
      >
        ← Voltar
      </button>
    </div>
  `;
}
/* =========================================================
   SISTEMA DE RESERVA DO AUDITÓRIO
========================================================= */

.auditorio-resumo-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 35px;
}

.auditorio-resumo-card {
  min-height: 145px;
  padding: 22px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  text-align: left;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  transition: 0.2s;
}

.auditorio-resumo-card:hover {
  transform: translateY(-4px);
  border-color: #ffe600;
}

.auditorio-resumo-card span {
  display: block;
  color: #666;
  font-size: 14px;
  font-weight: bold;
}

.auditorio-resumo-card strong {
  display: block;
  margin-top: 12px;
  font-size: 34px;
}

.auditorio-resumo-card small {
  display: block;
  margin-top: 8px;
  color: #888;
}

.auditorio-section-heading,
.auditorio-dia-acoes,
.auditorio-agenda-toolbar,
.auditorio-internal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
  margin-bottom: 22px;
}

.auditorio-section-heading p,
.auditorio-dia-acoes p,
.auditorio-agenda-toolbar p,
.auditorio-internal-header p {
  margin-top: 6px;
  color: #666;
  line-height: 1.5;
}

.auditorio-acessos-heading {
  margin-top: 38px;
}

.auditorio-btn-principal,
.auditorio-btn-secundario,
.auditorio-btn-cancelar {
  border: none;
  border-radius: 13px;
  padding: 14px 21px;
  font-weight: bold;
  transition: 0.2s;
}

.auditorio-btn-principal {
  background: #3483fa;
  color: #fff;
}

.auditorio-btn-principal:hover {
  background: #2968c8;
}

.auditorio-btn-secundario {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
}

.auditorio-btn-secundario:hover {
  background: #f7f7f7;
}

.auditorio-btn-cancelar {
  background: #fff0f0;
  color: #c52a2a;
  border: 1px solid #ffd1d1;
}

.auditorio-btn-cancelar:hover {
  background: #ffe2e2;
}

/* CALENDÁRIO */

.calendario-auditorio {
  background: #fff;
  padding: 28px;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.calendario-cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 25px;
}

.calendario-cabecalho p {
  margin-top: 6px;
  color: #777;
}

.calendario-legenda {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  color: #666;
  font-size: 13px;
}

.calendario-semana,
.calendario-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
}

.calendario-semana {
  margin-bottom: 10px;
}

.calendario-semana span {
  text-align: center;
  color: #777;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.calendario-dia {
  min-height: 105px;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 15px;
  background: #f8fafc;
  text-align: left;
  transition: 0.2s;
}

.calendario-dia:hover {
  transform: translateY(-3px);
}

.calendario-dia-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendario-dia strong {
  font-size: 20px;
}

.calendario-dia small {
  display: block;
  margin-top: 28px;
  font-size: 11px;
  font-weight: bold;
}

.calendario-dia.disponivel {
  background: #edfdf3;
  border-color: #45b968;
}

.calendario-dia.parcial {
  background: #fff9df;
  border-color: #e7c84e;
}

.calendario-dia.indisponivel {
  background: #fff0f0;
  border-color: #ed6969;
}

.calendario-dia.hoje {
  box-shadow: 0 0 0 3px rgba(52, 131, 250, 0.16);
}

.calendario-dia.vazio {
  visibility: hidden;
}

/* FORMULÁRIO */

.auditorio-form {
  display: grid;
  gap: 22px;
}

.auditorio-form-section {
  background: #fff;
  padding: 28px;
  border-radius: 22px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.auditorio-form-section-title {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 25px;
}

.auditorio-form-section-title > span {
  width: 42px;
  height: 42px;
  min-width: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffe600;
  border-radius: 13px;
  font-weight: bold;
}

.auditorio-form-section-title p {
  margin-top: 5px;
  color: #777;
}

.auditorio-form-grid {
  display: grid;
  gap: 18px;
}

.auditorio-form-grid.duas-colunas {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.auditorio-form-grid.tres-colunas {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.auditorio-field {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}

.auditorio-field > span {
  color: #555;
  font-size: 13px;
  font-weight: bold;
}

.auditorio-field input,
.auditorio-field select,
.auditorio-field textarea {
  width: 100%;
  border: 1px solid #dcdcdc;
  border-radius: 13px;
  padding: 14px;
  background: #fff;
  color: #222;
  outline: none;
}

.auditorio-field input:focus,
.auditorio-field select:focus,
.auditorio-field textarea:focus {
  border-color: #3483fa;
  box-shadow: 0 0 0 3px rgba(52, 131, 250, 0.12);
}

.auditorio-field input[readonly] {
  background: #f4f5f6;
  color: #777;
}

.auditorio-field textarea {
  min-height: 125px;
  resize: vertical;
}

.auditorio-recursos-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.auditorio-recurso-option {
  position: relative;
  display: block;
  cursor: pointer;
}

.auditorio-recurso-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.auditorio-recurso-option > div {
  min-height: 105px;
  padding: 16px;
  border: 2px solid #ececec;
  border-radius: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 9px;
  transition: 0.2s;
}

.auditorio-recurso-option > div strong {
  font-size: 25px;
}

.auditorio-recurso-option > div span {
  font-size: 13px;
  font-weight: bold;
}

.auditorio-recurso-option input:checked + .auditorio-recurso-check + div {
  border-color: #3483fa;
  background: #f0f6ff;
}

.auditorio-observacoes {
  margin-top: 22px;
}

.auditorio-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  padding: 5px 0 20px;
}

/* STATUS */

.auditorio-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
}

.status-pendente {
  background: #fff5cf;
  color: #7f6700;
}

.status-aprovada {
  background: #ddf7e4;
  color: #177333;
}

.status-recusada {
  background: #ffe0e0;
  color: #a22626;
}

.status-alteracao {
  background: #e5efff;
  color: #245da4;
}

.status-cancelada {
  background: #ececec;
  color: #555;
}

.status-concluida {
  background: #e6f7f5;
  color: #14756c;
}

/* CONFIRMAÇÃO */

.auditorio-confirmacao {
  max-width: 850px;
  margin: 20px auto;
  padding: 48px;
  background: #fff;
  border-radius: 28px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.07);
}

.auditorio-confirmacao-icon {
  width: 75px;
  height: 75px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #28ae60;
  color: #fff;
  font-size: 38px;
  font-weight: bold;
}

.auditorio-confirmacao-tag {
  display: inline-block;
  padding: 7px 13px;
  border-radius: 999px;
  background: #fff6b7;
  font-size: 12px;
  font-weight: bold;
}

.auditorio-confirmacao h2 {
  margin-top: 18px;
  font-size: 30px;
}

.auditorio-confirmacao > p {
  margin-top: 10px;
  color: #777;
}

.auditorio-confirmacao-protocolo {
  max-width: 350px;
  margin: 28px auto;
  padding: 18px;
  border-radius: 16px;
  background: #f7f8fa;
}

.auditorio-confirmacao-protocolo span {
  display: block;
  color: #777;
  font-size: 12px;
}

.auditorio-confirmacao-protocolo strong {
  display: block;
  margin-top: 7px;
  font-size: 25px;
}

.auditorio-confirmacao-dados {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.auditorio-confirmacao-dados div {
  padding: 16px;
  border-radius: 15px;
  background: #f8f9fa;
  text-align: left;
}

.auditorio-confirmacao-dados span {
  display: block;
  color: #777;
  font-size: 12px;
}

.auditorio-confirmacao-dados strong {
  display: block;
  margin-top: 7px;
  font-size: 14px;
}

.auditorio-confirmacao-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 30px;
}

/* MINHAS SOLICITAÇÕES */

.auditorio-filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.auditorio-filtros button {
  border: 1px solid #ddd;
  border-radius: 999px;
  padding: 10px 16px;
  background: #fff;
  color: #555;
  font-weight: bold;
}

.auditorio-filtros button.active,
.auditorio-filtros button:hover {
  border-color: #ffe600;
  background: #fff9c9;
  color: #222;
}

.auditorio-solicitacoes-lista,
.auditorio-agenda-lista {
  display: grid;
  gap: 20px;
}

.auditorio-solicitacao-card {
  padding: 25px;
  border: 1px solid #e8e8e8;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.auditorio-solicitacao-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.auditorio-protocolo,
.auditorio-area-tag {
  display: inline-block;
  color: #3483fa;
  font-size: 12px;
  font-weight: bold;
}

.auditorio-solicitacao-header h3 {
  margin-top: 8px;
  font-size: 22px;
}

.auditorio-solicitacao-header p {
  margin-top: 7px;
  color: #666;
}

.auditorio-solicitacao-dados {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.auditorio-solicitacao-dados div {
  padding: 15px;
  border-radius: 14px;
  background: #f8f9fa;
}

.auditorio-solicitacao-dados span {
  display: block;
  color: #777;
  font-size: 12px;
}

.auditorio-solicitacao-dados strong {
  display: block;
  margin-top: 7px;
  font-size: 14px;
}

.auditorio-solicitacao-recursos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}

.auditorio-solicitacao-recursos span {
  padding: 7px 11px;
  border-radius: 999px;
  background: #f1f3f5;
  font-size: 12px;
}

.auditorio-solicitacao-alerta {
  margin-top: 20px;
  padding: 16px;
  border-radius: 14px;
  background: #fff5e5;
  color: #75511a;
}

.auditorio-solicitacao-alerta p {
  margin-top: 6px;
}

.auditorio-solicitacao-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #eee;
}

.auditorio-solicitacao-footer small {
  color: #888;
}

/* AGENDA */

.auditorio-agenda-card {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 22px;
  padding: 22px;
  border-radius: 20px;
  border: 1px solid #e8e8e8;
  background: #fff;
}

.auditorio-agenda-horario,
.auditorio-agenda-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 16px;
  border-radius: 15px;
  background: #f7f8fa;
}

.auditorio-agenda-horario strong {
  font-size: 22px;
}

.auditorio-agenda-horario span,
.auditorio-agenda-data span {
  color: #777;
  font-size: 12px;
}

.auditorio-agenda-topo {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
}

.auditorio-agenda-topo h3 {
  margin-top: 7px;
}

.auditorio-agenda-conteudo > p {
  margin-top: 12px;
  color: #666;
}

.auditorio-agenda-dados {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 17px;
  color: #666;
  font-size: 13px;
}

.auditorio-empty {
  padding: 45px;
  border: 1px dashed #ccc;
  border-radius: 22px;
  background: #fff;
  text-align: center;
}

.auditorio-empty > span {
  font-size: 42px;
}

.auditorio-empty h3 {
  margin-top: 14px;
}

.auditorio-empty p {
  margin: 8px 0 22px;
  color: #777;
}

/* RESPONSIVIDADE */

@media (max-width: 1100px) {
  .auditorio-resumo-grid,
  .auditorio-confirmacao-dados,
  .auditorio-solicitacao-dados {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .auditorio-recursos-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .auditorio-section-heading,
  .auditorio-dia-acoes,
  .auditorio-agenda-toolbar,
  .auditorio-internal-header,
  .auditorio-solicitacao-header,
  .auditorio-solicitacao-footer,
  .calendario-cabecalho {
    align-items: flex-start;
    flex-direction: column;
  }

  .auditorio-form-grid.duas-colunas,
  .auditorio-form-grid.tres-colunas {
    grid-template-columns: 1fr;
  }

  .auditorio-agenda-card {
    grid-template-columns: 1fr;
  }

  .auditorio-confirmacao {
    padding: 30px 22px;
  }

  .auditorio-confirmacao-actions {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .auditorio-resumo-grid,
  .auditorio-confirmacao-dados,
  .auditorio-solicitacao-dados,
  .auditorio-recursos-grid {
    grid-template-columns: 1fr;
  }

  .calendario-auditorio {
    padding: 17px;
    overflow-x: auto;
  }

  .calendario-semana,
  .calendario-grid {
    min-width: 650px;
  }

  .auditorio-form-section {
    padding: 20px;
  }
}