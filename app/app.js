/* Kaiva OS · prototipo de la propuesta.
   Una sola página con rutas (#/inicio, #/ventas/tablero…), para que:
     · cada cosa tenga su enlace exacto (se puede compartir y volver),
     · «Volver» lleve a donde estabas, y las migas digan dónde estás,
     · el cambio de sección sea un fundido corto y la tarjeta tocada se
       convierta en la cabecera de su detalle (View Transitions). */
(() => {
  const D = window.KD;
  const $ = (s, el = document) => el.querySelector(s);
  const M = (k) => D.marcas[k];
  const plata = (n) => '$' + (Math.abs(n) >= 1e6 ? (Math.abs(n) / 1e6).toFixed(1).replace('.', ',').replace(',0', '') + ' M' : Math.abs(n).toLocaleString('es-CO'));

  const I = {
    inicio: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    ventas: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><path d="M15.5 14.5h2"/>',
    proyectos: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    redes: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>',
    plan: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
    visibilidad: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    ideas: '<path d="M9 18h6M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.6V16h6v-.1c0-.6.3-1.2.8-1.6A6.5 6.5 0 0 0 12 2.5z"/>',
    buscar: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    reglas: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M9 9h6M9 13h4"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    atras: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    mas: '<path d="M12 5v14M5 12h14"/>',
    izq: '<path d="m15 6-6 6 6 6"/>', der: '<path d="m9 6 6 6-6 6"/>'
  };
  const ico = (n, s = 20, w = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;

  // ---------- Estado (en memoria; un prototipo no guarda nada) ----------
  const E = { hechas: [], decididas: {}, pagina: 0, cobrosRecordados: {}, filtroMov: 'todos' };
  const tareasHoy = () => D.tareas.filter(t => t.grupo !== 'semana');
  const pendientes = () => tareasHoy().filter(t => !E.hechas.includes(t.id));

  // ---------- Mapa de rutas: nombre, padre (para las migas) ----------
  const NOMBRES = {
    inicio: 'Inicio', ventas: 'Ventas', 'ventas/tablero': 'Tablero', 'ventas/personas': 'Personas',
    proyectos: 'Proyectos', redes: 'Redes', plan: 'Plan', visibilidad: 'Visibilidad', ideas: 'Ideas', reglas: 'Reglas'
  };
  const nombreDe = (r) => NOMBRES[r] || NOMBRES[r.split('/')[0]] || r;
  const migasDe = (r) => {
    const partes = r.split('/');
    if (r === 'inicio') return [];
    const out = [['inicio', 'Inicio'], [partes[0], NOMBRES[partes[0]]]];
    if (partes[1] && NOMBRES[r]) out.push([r, nombreDe(r)]);
    return out;
  };

  // ---------- Historial propio, para que «Volver» diga a dónde ----------
  let pila = JSON.parse(sessionStorage.getItem('kv-pila') || '[]');
  const guardarPila = () => sessionStorage.setItem('kv-pila', JSON.stringify(pila.slice(-20)));

  // ---------- Menú ----------
  const MENU = [
    { grupo: 'Diario' },
    { r: 'inicio', n: 'Inicio', badge: () => pendientes().length },
    { r: 'ventas', n: 'Ventas', badge: () => D.dinero.cobros.length, negro: true },
    { r: 'proyectos', n: 'Proyectos' },
    { r: 'redes', n: 'Redes' },
    { r: 'plan', n: 'Plan', badge: () => D.decisiones.length - Object.keys(E.decididas).length },
    { sep: true }, { grupo: 'Consulta' },
    { r: 'visibilidad', n: 'Visibilidad', ocasional: true },
    { r: 'ideas', n: 'Ideas', ocasional: true }
  ];
  function pintarMenu(ruta) {
    const raiz = ruta.split('/')[0];
    $('#menu').innerHTML = `
      <a class="logo" href="#/inicio" title="Inicio (G luego I)">K</a>
      ${MENU.map(m => m.grupo ? `<div class="grupo">${m.grupo}</div>` : m.sep ? '<div class="sep"></div>' : (() => {
        const b = m.badge ? m.badge() : 0;
        return `<a class="item ${raiz === m.r ? 'activo' : ''} ${m.ocasional ? 'ocasional' : ''}" href="#/${m.r}" ${raiz === m.r ? 'aria-current="page"' : ''}>
          <span class="ico">${ico(m.r, 20, raiz === m.r ? 2.2 : 2)}</span>${m.n}
          ${b ? `<span class="badge ${m.negro ? 'negro' : ''}">${b}</span>` : ''}</a>`;
      })()).join('')}
      <div class="abajo">
        <a class="item" href="#" data-accion="buscar"><span class="ico">${ico('buscar')}</span>Buscar</a>
        <a class="item ${raiz === 'reglas' ? 'activo' : ''}" href="#/reglas"><span class="ico">${ico('reglas')}</span>Reglas</a>
        <div class="yo" title="Kaiva Studio">K</div>
      </div>`;
  }

  // ---------- Cabecera de cada sección ----------
  function cabeza(ruta, titulo, { pestanas = '', acciones = '' } = {}) {
    const ant = pila.length > 1 ? pila[pila.length - 2] : null;
    const migas = migasDe(ruta);
    return `<header class="cabeza">
      <div class="izq">
        <div class="migas">
          ${ant ? `<a class="volver" href="#/${ant}" data-volver>${ico('atras', 15, 2.4)} ${nombreDe(ant)}</a>` : ''}
          ${migas.map(([r, n], i) => i === migas.length - 1 ? `<span class="yo-aqui">${n}</span>` : `<a href="#/${r}">${n}</a><span>/</span>`).join('')}
        </div>
        <h1 class="dos-tonos">${titulo}</h1>
      </div>
      ${pestanas}
      <div class="acciones">${acciones}<button class="buscar-btn" data-accion="buscar">${ico('buscar', 17)} Buscar o ir a…<kbd>Ctrl K</kbd></button></div>
    </header>`;
  }
  const pestanas = (items, actual) => `<nav class="pestanas">${items.map(([r, n, c], i) => `<a href="#/${r}" class="${(typeof actual === 'number' ? i === actual : r === actual) ? 'activo' : ''}">${n}${c ? `<span class="n">${c}</span>` : ''}</a>`).join('')}</nav>`;

  // ---------- Gráficas chiquitas ----------
  function spark(v, w = 120, h = 40) {
    const min = Math.min(...v), max = Math.max(...v), dx = w / (v.length - 1);
    const y = (x) => h - 4 - ((x - min) / (max - min || 1)) * (h - 8);
    const d = v.map((x, i) => `${i ? 'L' : 'M'}${(i * dx).toFixed(1)} ${y(x).toFixed(1)}`).join(' ');
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><path class="l" d="${d}"/><circle class="pt" cx="${w}" cy="${y(v[v.length - 1])}" r="5"/></svg>`;
  }
  const portada = (p, i, reel) => {
    const colores = ['#080808', '#36115F', '#0B1C3D', '#34441B', '#4E1E86'];
    const c = colores[i % colores.length];
    return `<div class="portada ${reel ? 'reel' : ''}" style="background:${c}"><span class="f">${p.f}</span><span>${p.t}</span></div>`;
  };
  const cifra = (txt, cls = 'l', clave = '') => `<span class="cifra ${cls}" data-cuenta="${clave}">${txt}</span>`;

  // =====================================================================
  //  VISTAS
  // =====================================================================
  const V = {};

  // ---------------- INICIO: «¿qué tengo que hacer o decidir hoy?» -------
  V.inicio = () => {
    const total = tareasHoy().length, hechas = total - pendientes().length;
    const C = 2 * Math.PI * 12, d = D.dinero, dec = D.decisiones.filter(x => !E.decididas[x.id]);
    const etapas = D.tratos; const abiertos = [...etapas['Por empezar'], ...etapas['En proceso']];
    return `
    <header class="cabeza">
      <div class="saludo">
        <div class="fecha"><div><b>${D.hoy.dia}</b><small>oct</small></div></div>
        <div class="izq"><div class="migas"><span class="yo-aqui">Inicio</span><span>·</span><span>${D.hoy.semana} ${D.hoy.dia} de ${D.hoy.mes}</span></div>
        <h1 class="dos-tonos"><span class="gris">Hola, Kaiva.</span> Hoy toca esto.</h1></div>
      </div>
      <div class="acciones">
        <div class="progreso-dia" title="Lo que llevas hecho hoy">
          <svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" fill="none" stroke="#F0F0F2" stroke-width="5"/><circle class="aro-f" cx="15" cy="15" r="12" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - hechas / total)}"/></svg>
          <span id="prog-txt">${hechas} de ${total} hechas</span>
        </div>
        <button class="buscar-btn" data-accion="buscar">${ico('buscar', 17)} Buscar o ir a…<kbd>Ctrl K</kbd></button>
        <a class="pildora" href="#/inicio" data-accion="nuevo">Nuevo<span class="circulo">${ico('mas', 16, 2.4)}</span></a>
      </div>
    </header>
    <section class="inicio">
      <article class="tarjeta accion" style="grid-column: span 7">
        <div class="tope"><h2 class="t-tarjeta dos-tonos"><span class="gris">Hoy</span> requiere acción</h2>
          <div class="der" id="pager"></div></div>
        <div class="lista" id="lista-hoy"></div>
      </article>

      <div class="columna" style="grid-column: span 5">
        <a class="tarjeta negra decidir tocable" href="#/plan" data-foco>
          <div class="tope" style="margin-bottom:6px"><span class="etiqueta">Por decidir · lanzamiento del 11 nov</span><span class="der ver">Decidir ${ico('flecha', 15)}</span></div>
          ${dec.length ? `<div class="pregunta">${dec[0].pregunta}</div>
          <div class="suave" style="font-size:13px">Te faltan <b style="color:#fff">${dec.length}</b> · un clic y queda guardada</div>
          <div class="barra-av"><i style="width:${(Object.keys(E.decididas).length / D.decisiones.length) * 100}%"></i></div>` : `<div class="pregunta">Todo decidido. Buen trabajo.</div>`}
        </a>
        <article class="tarjeta cobrar-blanca estira" style="display:flex;flex-direction:column">
          <div class="tope" style="margin-bottom:4px"><span class="etiqueta">Por cobrar · ${d.porCobrarFacturas} vencidos</span><a class="der ver" href="#/ventas" data-foco>Ventas ${ico('flecha', 15)}</a></div>
          ${cifra(plata(d.porCobrar), 'l', 'porcobrar')}
          <div style="margin-top:auto">${d.cobros.map((c, i) => `<div class="cobro"><span class="punto" style="background:${M(c.marca).claro}"></span>
            <div><div style="font-weight:600;font-size:13.5px">${c.concepto}</div><div class="d">${M(c.marca).nombre} · hace ${c.dias} días</div></div>
            <span class="v">${plata(c.valor)}</span>
            <button data-recordar="${i}" class="${E.cobrosRecordados[i] ? 'listo' : ''}">${E.cobrosRecordados[i] ? 'Recordado' : 'Recordar'}</button></div>`).join('')}</div>
        </article>
      </div>

      <a class="tarjeta kpi tocable" href="#/ventas" style="grid-column: span 3">
        <span class="etiqueta">Cobrado en octubre</span>
        <div class="fila-n">${cifra(plata(d.cobradoMes), 'm', 'cobrado')}<span class="ctx">de <b>${plata(d.metaMes)}</b></span></div>
        <div class="meta-barra"><i style="width:${(d.cobradoMes / d.metaMes) * 100}%"></i></div>
        <span class="ctx">Va en el <b>${Math.round(d.cobradoMes / d.metaMes * 100)} %</b> de la meta del mes</span>
      </a>
      <a class="tarjeta kpi tocable" href="#/ventas/tablero" style="grid-column: span 3">
        <span class="etiqueta">Tratos abiertos</span>
        <div class="fila-n">${cifra('$29,5 M', 'm')}<span class="ctx"><b>${abiertos.length}</b> tratos</span></div>
        <div class="etapas"><i style="flex:1;background:#DCDCE1"></i><i style="flex:2;background:var(--violet)"></i></div>
        <span class="ctx"><b>2</b> conversando · <b>1</b> por empezar</span>
      </a>
      <a class="tarjeta kpi tocable" href="#/visibilidad/kaivastudio.com" data-foco style="grid-column: span 3">
        <span class="etiqueta">Personas en la web</span>
        <div class="fila-n">${cifra('647', 'm', 'visitas')}${spark(D.web.visitas)}</div>
        <span class="ctx"><b>+11 %</b> frente a la semana pasada</span>
      </a>
      <a class="tarjeta kpi tocable" href="#/redes" data-foco style="grid-column: span 3">
        <span class="etiqueta">Alcance en Instagram</span>
        <div class="fila-n">${cifra('3.470', 'm', 'alcance')}${spark(D.redes.alcance)}</div>
        <span class="ctx"><b>+24 %</b> · el Reel de Thallo empujó</span>
      </a>

      <article class="tarjeta" style="grid-column: span 7">
        <div class="tope"><h2 class="t-tarjeta dos-tonos"><span class="gris">Cómo va</span> cada cliente</h2><a class="der ver" href="#/proyectos">Proyectos ${ico('flecha', 15)}</a></div>
        ${[
          ['cs', 'Portal de pagos', 'Entrega el 31 oct', 'Debe $4,4 M', 'Al día', '#080808'],
          ['thallo', 'Serie AI Shortlist', 'Entregado', 'Debe $1,2 M · 20 días', 'Cobrar', '#4E1E86'],
          ['angopi', 'Web nueva', 'Propuesta por enviar', '$9,5 M en juego', 'Llamar hoy', '#4E1E86']
        ].map(([k, t, e, p, s, c]) => `<a class="cliente-fila" href="${k === 'angopi' ? '#/ventas/personas' : '#/proyectos/' + k}">
          <span class="circulo-marca" style="background:${M(k).color}">${M(k).ini}</span>
          <div><div class="n">${M(k).nombre}</div><div class="s">${t}</div></div>
          <div class="s">${e}</div><div class="s">${p}</div>
          <span class="estado" style="color:${c}">${s} ${ico('flecha', 14)}</span></a>`).join('')}
      </article>
      <article class="tarjeta" style="grid-column: span 5">
        <div class="tope"><h2 class="t-tarjeta dos-tonos"><span class="gris">Sale</span> esta semana</h2><a class="der ver" href="#/redes">Redes ${ico('flecha', 15)}</a></div>
        <div class="piezas">${D.redes.piezas.map((p, i) => `<a class="pieza" href="#/redes">${portada(p, i)}<span class="d">${p.dia}<span class="suave">· ${p.estado}</span></span></a>`).join('')}</div>
      </article>
    </section>
    <div class="deshacer" id="deshacer"><span id="deshacer-txt">Hecha</span><button id="deshacer-btn">Deshacer</button></div>`;
  };

  function pintarListaHoy() {
    const caja = $('#lista-hoy'); if (!caja) return;
    const p = pendientes();
    if (!p.length) {
      caja.innerHTML = `<div class="todo-al-dia"><div><b>Todo al día.</b>Nada atrasado ni pendiente para hoy.<br>Llevas <b style="display:inline;font-size:inherit">3 días seguidos</b> así.</div></div>`;
      $('#pager').innerHTML = ''; return;
    }
    const POR = 3, paginas = Math.ceil(p.length / POR);
    E.pagina = Math.min(E.pagina, paginas - 1);
    const trozo = p.slice(E.pagina * POR, E.pagina * POR + POR);
    let html = '', grupo = '';
    trozo.forEach(t => {
      if (t.grupo !== grupo) {
        grupo = t.grupo; const n = p.filter(x => x.grupo === grupo).length;
        html += `<div class="grupo-barra ${grupo === 'atrasado' ? 'negro' : 'morado'}">${grupo === 'atrasado' ? 'Atrasado' : 'Hoy'}<span class="n">${n} ${n === 1 ? 'cosa' : 'cosas'}</span></div>`;
      }
      const m = M(t.marca);
      html += `<div class="fila" data-id="${t.id}">
        <button class="marcar" aria-label="Marcar como hecha" data-hecha="${t.id}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${I.check}</svg></button>
        <div><div class="tt">${t.titulo}</div>
          <div class="meta"><span class="punto" style="background:${m.claro}"></span>${m.nombre} · ${t.que} · ${t.quien}<span class="nota">· ${t.nota}</span></div></div>
        <span class="chip ${t.grupo === 'atrasado' ? 'negro' : 'morado'}">${t.fecha}</span>
        <a class="ir" href="#/${t.ir}" title="Ir a donde se hace">${ico('flecha', 16)}</a>
      </div>`;
    });
    caja.innerHTML = html;
    $('#pager').innerHTML = paginas > 1 ? `<span class="suave" style="font-size:12.5px;font-weight:600">${E.pagina + 1} de ${paginas}</span>
      <button class="ir-p" data-pag="-1" ${E.pagina === 0 ? 'disabled style="opacity:.35"' : ''} aria-label="Anteriores" style="width:32px;height:32px;border-radius:50%;background:var(--mist);display:grid;place-items:center">${ico('izq', 16)}</button>
      <button class="ir-p" data-pag="1" ${E.pagina === paginas - 1 ? 'disabled style="opacity:.35"' : ''} aria-label="Siguientes" style="width:32px;height:32px;border-radius:50%;background:var(--mist);display:grid;place-items:center">${ico('der', 16)}</button>` : '';
  }

  // ---------------- VENTAS ----------------
  const tabsVentas = (a) => pestanas([['ventas', 'Dinero'], ['ventas/tablero', 'Tablero', 6], ['ventas/personas', 'Personas', 4]], a);
  V.ventas = () => {
    const d = D.dinero, max = Math.max(...d.meses.map(x => x.v));
    const movs = d.movimientos.filter(m => E.filtroMov === 'todos' || m.tipo === E.filtroMov);
    return cabeza('ventas', 'Ventas', { pestanas: tabsVentas('ventas'), acciones: `<a class="pildora" href="#/ventas">Movimiento<span class="circulo">${ico('mas', 16, 2.4)}</span></a>` }) + `
    <section class="rejilla" style="grid-template-rows:auto minmax(0,1fr);flex:1">
      <article class="tarjeta morada hero-num c4" data-foco-destino>
        <span class="etiqueta">Por cobrar · lo primero</span>
        ${cifra(plata(d.porCobrar), 'xl', 'porcobrar')}
        <span class="suave" style="font-size:13px">${d.porCobrarFacturas} cobros esperando hace más de 20 días</span>
      </article>
      <article class="tarjeta c4 hero-num">
        <span class="etiqueta">Cobrado en octubre</span>
        <div style="display:flex;align-items:flex-end;gap:10px">${cifra(plata(d.cobradoMes), 'l', 'cobrado')}<span class="suave">de ${plata(d.metaMes)}</span></div>
        <div class="meta-barra"><i style="width:${d.cobradoMes / d.metaMes * 100}%"></i></div>
      </article>
      <article class="tarjeta c4 hero-num">
        <span class="etiqueta">Ganancia del mes</span>
        ${cifra(plata(d.ganancia), 'l', 'ganancia')}
        <span class="suave">Lo que queda después de los gastos · <b style="color:var(--ink)">+$0,9 M</b> frente a septiembre</span>
      </article>

      <article class="tarjeta c8" style="display:flex;flex-direction:column;min-height:0">
        <div class="tope"><h2 class="t-tarjeta">Movimientos</h2>
          <div class="der">${pestanas([['ventas?f=todos', 'Todos'], ['ventas?f=entra', 'Entra'], ['ventas?f=sale', 'Sale']], 'ventas?f=' + E.filtroMov).replace(/href="#\/ventas\?f=(\w+)"/g, 'href="#" data-filtro="$1"')}</div></div>
        <div class="desliza" style="flex:1">${movs.map(m => `<div class="mov"><span class="f">${m.f}</span>
          <div class="c">${m.concepto}<small><span class="punto" style="background:${M(m.marca).claro}"></span>${M(m.marca).nombre}</small></div>
          <span class="v ${m.tipo}">${m.tipo === 'entra' ? '+' : '−'} ${plata(m.valor)}</span></div>`).join('')}</div>
      </article>
      <div class="columna c4">
        <article class="tarjeta estira" style="display:flex;flex-direction:column">
          <div class="tope" style="margin-bottom:0"><h2 class="t-tarjeta">Cobrado por mes</h2><span class="der suave" style="font-size:12.5px">millones</span></div>
          <div class="barras estira">${d.meses.map((x, i) => `<div class="b ${i === d.meses.length - 1 ? 'ahora' : ''}" title="${x.m}: $${x.v} M"><span class="v">${x.v ? x.v.toString().replace('.', ',') : '0'}</span><i style="height:${Math.max(4, x.v / max * 100)}%"></i><span class="m">${x.m}</span></div>`).join('')}</div>
        </article>
        <article class="tarjeta">
          <h2 class="t-tarjeta" style="margin-bottom:8px">Entra cada mes</h2>
          ${d.fijos.map(f => `<div class="mov" style="grid-template-columns:1fr auto"><div class="c">${f.t}<small><span class="punto" style="background:${M(f.marca).claro}"></span>${M(f.marca).nombre} · ${f.dia}</small></div><span class="v">${f.v}</span></div>`).join('')}
        </article>
      </div>
    </section>`;
  };
  V['ventas/tablero'] = () => {
    const cols = { 'Por empezar': 'gris', 'En proceso': 'morado', 'Ganados': 'negro', 'Perdidos': 'apagado' };
    return cabeza('ventas/tablero', 'Ventas', { pestanas: tabsVentas('ventas/tablero'), acciones: `<a class="pildora" href="#/ventas/tablero">Trato<span class="circulo">${ico('mas', 16, 2.4)}</span></a>` }) + `
    <section class="tablero">${Object.entries(D.tratos).map(([n, ts]) => `<div class="col-trato ${cols[n]}"><h3>${n}<span style="margin-left:auto;font-weight:500;opacity:.7">${ts.length}</span></h3>
      ${ts.map(t => `<div class="trato" draggable="true"><span class="m"><span class="punto" style="background:${M(t.marca).claro}"></span>${M(t.marca).nombre}</span><span class="t">${t.t}</span><span class="v">${t.v}</span></div>`).join('')}</div>`).join('')}</section>`;
  };
  V['ventas/personas'] = () => cabeza('ventas/personas', 'Ventas', { pestanas: tabsVentas('ventas/personas'), acciones: `<a class="pildora" href="#/ventas/personas">Persona<span class="circulo">${ico('mas', 16, 2.4)}</span></a>` }) + `
    <section class="personas">${D.personas.map(p => `<article class="tarjeta persona">
      <div style="display:flex;gap:12px;align-items:center"><span class="circulo-marca" style="background:${M(p.marca).color}">${M(p.marca).ini}</span>
      <div><div style="font-weight:600;font-size:16px">${p.nombre}</div><div class="suave" style="font-size:13px">${p.empresa}</div></div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><span class="chip ${p.estado === 'Cliente' ? 'negro' : p.estado === 'Conversando' ? 'morado' : ''}">${p.estado}</span><span class="chip gris">${p.llego}</span></div>
      <div style="display:flex;align-items:baseline;gap:8px">${cifra(p.vale, 'm')}<span class="suave" style="font-size:13px">en ${p.tratos} ${p.tratos === 1 ? 'trato' : 'tratos'}</span></div>
      <div class="paso"><b>Lo siguiente</b>${p.paso}</div>
      <div class="historia"><span class="etiqueta">Sus tratos</span>${Object.entries(D.tratos).flatMap(([col, ts]) => ts.filter(t => t.marca === p.marca).map(t => `<div class="h"><span class="punto" style="margin-top:7px;background:${{ 'Por empezar': '#C9C9CF', 'En proceso': '#4E1E86', 'Ganados': '#080808', 'Perdidos': '#E0E0E4' }[col]}"></span><span style="flex:1">${t.t}</span><b>${t.v}</b></div>`)).join('')}</div>
      <div class="historia"><span class="etiqueta">Lo último</span>${p.hist.map(h => `<div class="h"><span class="f">${h[0]}</span>${h[1]}</div>`).join('')}</div>
      <div style="display:flex;gap:8px;margin-top:auto"><a class="pildora chica" href="#/inicio">Seguimiento</a><a class="pildora chica blanca" style="outline:1px solid var(--line)" href="#/ventas/tablero">Ver tratos</a></div>
    </article>`).join('')}</section>`;

  // ---------------- PROYECTOS (tipo Drive): la carpeta se abre ahí mismo ----------------
  const carpeta = (m) => `<div class="cp"><span class="tapa" style="background:${m.color}"></span><span class="hoja"></span><span class="cuerpo" style="background:${m.color}"></span></div>`;
  V.proyectos = (id) => {
    const p = D.proyectos.find(x => x.id === id) || D.proyectos[0], m = M(p.marca);
    const archivos = ['Brand book', 'Logo final', 'Propuesta', 'Wireframes', 'Fotos', 'Contrato'];
    const tipos = ['PDF', 'SVG', 'PDF', 'Figma', 'ZIP', 'PDF'];
    return cabeza('proyectos', 'Proyectos', { acciones: `<a class="pildora" href="#/proyectos">Proyecto<span class="circulo">${ico('mas', 16, 2.4)}</span></a>` }) + `
    <section class="rejilla" style="flex:1;grid-template-rows:auto auto minmax(0,1fr)">
      ${D.proyectos.map(q => { const mq = M(q.marca), sel = q.id === p.id; return `<a class="tarjeta carpeta-fila c4 ${sel ? 'elegida' : ''}" href="#/proyectos/${q.id}" data-quieto>
        <div class="carpeta-mini">${carpeta(mq)}</div>
        <div style="min-width:0;flex:1"><div style="font-weight:600;font-size:16px">${mq.nombre}</div><div class="suave" style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${q.t}</div>
          <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap"><span class="chip ${q.estado === 'En curso' ? 'negro' : 'morado'}">${q.estado}</span><span class="chip gris">${q.entrega === 'Entregado' ? 'Entregado' : 'Entrega ' + q.entrega}</span></div></div>
      </a>`; }).join('')}

      <article class="tarjeta c4" data-panel style="background:${m.color};color:#fff;display:flex;flex-direction:column;gap:12px">
        <span class="etiqueta" style="color:rgba(255,255,255,.7)">${m.nombre} · cómo va</span>
        <div style="font-size:24px;font-weight:600;letter-spacing:-.02em">${p.avance}</div>
        <div class="datos-p"><div class="bloque" style="background:rgba(255,255,255,.12)"><span style="color:rgba(255,255,255,.7)">Entrega</span><b>${p.entrega}</b></div><div class="bloque" style="background:rgba(255,255,255,.12)"><span style="color:rgba(255,255,255,.7)">Falta cobrar</span><b>${p.cobrar === '—' ? 'Nada' : p.cobrar}</b></div></div>
      </article>
      <article class="tarjeta c4" data-panel><span class="etiqueta">Paleta y letra</span><div class="paleta" style="margin:12px 0 14px"><i style="background:${m.color}"></i><i style="background:${m.claro}"></i><i style="background:#F0F0F2"></i><i style="background:#080808"></i></div>
        <div style="font-size:28px;font-weight:600;letter-spacing:-.02em">Aa Geist</div></article>
      <article class="tarjeta c4" data-panel><span class="etiqueta">Lo siguiente</span>
        ${D.tareas.filter(t => t.marca === p.marca).slice(0, 3).map(t => `<div class="pend"><span class="k">${ico('flecha', 12)}</span>${t.titulo}</div>`).join('') || '<p class="suave">Nada pendiente.</p>'}</article>

      <article class="tarjeta c8" data-panel style="min-height:0;display:flex;flex-direction:column">
        <div class="tope"><h2 class="t-tarjeta dos-tonos"><span class="gris">Archivos de</span> ${m.nombre}</h2><a class="der ver" href="#/proyectos/${p.id}">Subir ${ico('mas', 15)}</a></div>
        <div class="archivos">${archivos.slice(0, Math.min(p.archivos, 6)).map((a, i) => `<div class="archivo"><div class="vista-a"><span class="hoja-a" style="--c:${i % 2 ? m.claro : m.color}">${tipos[i]}</span></div><b>${a}</b><span>${tipos[i]} · oct</span></div>`).join('')}</div>
      </article>
      <article class="tarjeta c4" style="min-height:0;display:flex;flex-direction:column">
        <div class="tope"><h2 class="t-tarjeta dos-tonos"><span class="gris">Ya</span> entregados</h2></div>
        <div class="desliza">${D.entregados.map(e => `<div class="entregado"><span class="punto" style="background:${M(e.marca).claro}"></span><span><b style="color:var(--ink)">${e.t}</b><br><span style="font-size:12.5px">${M(e.marca).nombre}</span></span><span style="margin-left:auto" class="chip gris">${e.f}</span></div>`).join('')}</div>
      </article>
    </section>`;
  };

  // ---------------- REDES: todo el análisis de Instagram en la misma pantalla ----------------
  V.redes = () => {
    const r = D.redes, maxA = Math.max(...r.semanas.map(x => x.v));
    return cabeza('redes', 'Redes', { pestanas: pestanas([['redes', 'Instagram'], ['redes', 'LinkedIn'], ['redes', 'Behance']], 0), acciones: `<a class="pildora" href="#/redes">Programar<span class="circulo">${ico('mas', 16, 2.4)}</span></a>` }) + `
    <section style="display:flex;gap:16px;flex:1;min-height:0">
      <div class="celular" data-foco-destino><div class="pantalla">
        <div class="perfil"><span class="av">K</span><div><b>kaivastudio</b><span>${r.seguidores.toLocaleString('es-CO')} seguidores</span></div></div>
        <div class="grid-ig">${r.feed.map((t, i) => `<i style="background:${['#4E1E86', '#080808', '#36115F', '#34441B', '#0B1C3D', '#7A3FC9'][i % 6]}">${t}</i>`).join('')}</div>
      </div></div>
      <div class="rejilla" style="flex:1;grid-template-rows:auto minmax(0,1fr) auto">
        <article class="tarjeta kpi c3"><span class="etiqueta">Seguidores</span><div class="fila-n">${cifra('7.989', 'm')}${spark([7800, 7830, 7870, 7900, 7930, 7960, 7989], 90, 34)}</div><span class="ctx"><b>+42</b> esta semana</span></article>
        <article class="tarjeta kpi c3"><span class="etiqueta">Alcance</span><div class="fila-n">${cifra('3.470', 'm')}${spark(r.alcance, 90, 34)}</div><span class="ctx"><b>+24 %</b> frente a la anterior</span></article>
        <article class="tarjeta kpi c3"><span class="etiqueta">Guardados</span><div class="fila-n">${cifra('318', 'm')}${spark([120, 160, 150, 210, 240, 280, 318], 90, 34)}</div><span class="ctx"><b>+38</b> · lo que más pesa</span></article>
        <article class="tarjeta kpi c3"><span class="etiqueta">Visitas a la web</span><div class="fila-n">${cifra('94', 'm')}${spark([60, 72, 70, 81, 77, 90, 94], 90, 34)}</div><span class="ctx"><b>+12</b> desde Instagram</span></article>

        <article class="tarjeta c7" style="display:flex;flex-direction:column;min-height:0">
          <div class="tope" style="margin-bottom:0"><h2 class="t-tarjeta dos-tonos"><span class="gris">Alcance</span> por semana</h2><span class="der suave" style="font-size:12.5px">morado = semana con Reel</span></div>
          <div class="barras estira">${r.semanas.map((x, i) => `<div class="b ${x.reel ? 'ahora' : ''}" title="${x.s}: ${x.v.toLocaleString('es-CO')} cuentas"><span class="v">${(x.v / 1000).toFixed(1).replace('.', ',')} mil</span><i style="height:${Math.max(4, x.v / maxA * 100)}%"></i><span class="m">${x.s}</span></div>`).join('')}</div>
        </article>
        <article class="tarjeta c5" style="display:flex;flex-direction:column;min-height:0">
          <div class="tope"><h2 class="t-tarjeta dos-tonos"><span class="gris">Lo que mejor</span> funcionó</h2><span class="der suave" style="font-size:12.5px">28 días</span></div>
          <div class="desliza">${r.mejores.map((p, i) => `<div class="mejor"><div class="portada mini" style="background:${['#080808', '#36115F', '#0B1C3D'][i]}"><span>${p.t}</span></div>
            <div style="min-width:0"><b>${p.t}</b><div class="suave" style="font-size:12.5px">${p.f} · ${p.dia}</div><div class="por-que">${p.porque}</div></div>
            <div style="text-align:right"><b style="font-size:17px">${p.alcance}</b><div class="suave" style="font-size:12px">cuentas</div></div></div>`).join('')}</div>
        </article>

        <article class="tarjeta c12" style="display:flex;gap:16px;align-items:center">
          <h2 class="t-tarjeta dos-tonos" style="white-space:nowrap"><span class="gris">Lo que</span> viene</h2>
          <div class="viene">${r.piezas.map((p, i) => `<div class="viene-p"><div class="portada mini" style="background:${['#080808', '#36115F', '#0B1C3D'][i]}"><span class="f">${p.f}</span></div><div><b>${p.t}</b><div class="suave" style="font-size:12.5px">${p.dia} · ${p.red}</div></div><span class="chip ${p.estado === 'programado' ? 'morado' : p.estado === 'idea' ? 'gris' : ''}">${p.estado}</span></div>`).join('')}</div>
        </article>
      </div>
    </section>`;
  };

  // ---------------- PLAN: decidir, una a la vez ----------------
  V.plan = () => {
    const pend = D.decisiones.filter(d => !E.decididas[d.id]), act = pend[0], hechas = D.decisiones.length - pend.length;
    return cabeza('plan', '<span class="gris">Plan</span> Decisiones', { acciones: `<span class="chip">${hechas} de ${D.decisiones.length} decididas</span>` }) + `
    <section class="decision-grande">
      <article class="tarjeta" data-foco-destino style="display:flex;flex-direction:column;gap:16px;min-height:0">
        ${act ? `<span class="etiqueta">Decisión ${hechas + 1} de ${D.decisiones.length} · te faltan ${pend.length}</span>
        <h2 style="font-size:28px;letter-spacing:-.02em;line-height:1.2">${act.pregunta}</h2>
        <p class="suave" style="margin:0;font-size:15px">${act.porque}</p>
        <div style="flex:1;min-height:0;display:grid;place-items:center;background:var(--mist);border-radius:18px;padding:18px">
          <div style="width:min(240px,100%)">${portada(act.pieza, 0)}<div class="suave" style="font-size:12.5px;margin-top:6px">${act.pieza.f}</div></div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${act.opciones.map((o, i) => `<button class="opcion" data-decidir="${act.id}" data-op="${i}"><span class="num">${i + 1}</span><span><b>${o.t}${o.rec ? ' <span class="chip morado" style="height:20px;font-size:11px;margin-left:4px">Recomendada</span>' : ''}</b><span>${o.d}</span></span></button>`).join('')}</div>`
        : `<div class="festejo"><div><div class="cifra xl">${D.decisiones.length} de ${D.decisiones.length}</div><p style="font-size:18px;font-weight:600">Todo decidido para el lanzamiento.</p><a class="pildora" href="#/inicio">Volver a Inicio<span class="circulo">${ico('flecha', 16)}</span></a></div></div>`}
      </article>
      <article class="tarjeta" style="min-height:0;display:flex;flex-direction:column">
        <h2 class="t-tarjeta" style="margin-bottom:10px">Pendientes</h2>
        <div class="desliza">${D.decisiones.map((d, i) => `<div class="pend ${E.decididas[d.id] !== undefined ? 'lista' : act && d.id === act.id ? 'actual' : ''}"><span class="k">${E.decididas[d.id] !== undefined ? ico('check', 12, 3) : i + 1}</span>${d.pregunta}
          ${E.decididas[d.id] !== undefined ? `<button data-cambiar="${d.id}" style="margin-left:auto;font-size:12px;color:var(--violet-text);font-weight:600">Cambiar</button>` : ''}</div>`).join('')}</div>
      </article>
    </section>`;
  };

  // ---------------- VISIBILIDAD: Google, tráfico y competencia en la misma pantalla ----------------
  const aro = (n, c = '#fff', fondo = 'rgba(255,255,255,.15)', tam = 120) => { const C = 2 * Math.PI * 50; return `<div class="aro" style="width:${tam}px;height:${tam}px"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="${fondo}" stroke-width="12"/><circle cx="60" cy="60" r="50" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - n / 100)}"/></svg><span class="n" style="font-size:${tam / 3.6}px">${n}</span></div>`; };
  V.visibilidad = (dom) => {
    const s = D.web.sitios.find(x => x.dominio === dom) || D.web.sitios[0], m = M(s.marca), g = s.google;
    const maxB = Math.max(...D.web.busquedas.map(b => b.c));
    return cabeza('visibilidad', 'Visibilidad', { acciones: `<a class="pildora blanca" href="#/visibilidad">Analizar todo<span class="circulo">${ico('flecha', 16)}</span></a>` }) + `
    <section class="rejilla" style="flex:1;grid-template-rows:auto auto minmax(0,1fr)">
      <div class="columna c4" style="grid-row: span 3">
        <article class="tarjeta" style="padding:16px">
          <div class="tope" style="margin-bottom:6px"><h2 class="t-tarjeta dos-tonos"><span class="gris">Las</span> webs</h2><span class="der suave" style="font-size:12.5px">toca una</span></div>
          ${D.web.sitios.map(x => `<a class="sitio-fila ${x.dominio === s.dominio ? 'elegida' : ''}" href="#/visibilidad/${x.dominio}" data-quieto>${aro(x.nota, x.nota > 80 ? '#080808' : '#4E1E86', '#F0F0F2', 44)}
            <div style="min-width:0"><div style="font-weight:600">${M(x.marca).nombre}</div><div class="suave" style="font-size:12.5px">${x.dominio}</div></div>
            <span class="estado">${x.estado}</span></a>`).join('')}
        </article>
        <article class="tarjeta estira" style="display:flex;flex-direction:column;min-height:0">
          <div class="tope"><h2 class="t-tarjeta dos-tonos"><span class="gris">Frente a la</span> competencia</h2></div>
          <div class="desliza">${[...D.web.competencia, { n: 'Kaiva Studio', nota: 86, yo: true }].sort((a, b) => b.nota - a.nota || (a.yo ? -1 : 1)).map((c, i) => `<div class="comp ${c.yo ? 'yo' : ''}"><span>${i + 1}</span><b>${c.n}</b><div class="meta-barra"><i style="width:${c.nota}%;background:${c.yo ? 'var(--violet)' : '#C9C9CF'}"></i></div><b>${c.nota}</b></div>`).join('')}</div>
          <p class="suave" style="font-size:13px;margin:10px 0 0">Orbix empata con nosotros: le ganamos en velocidad y nos gana en reseñas.</p>
        </article>
      </div>

      <article class="tarjeta negra c8" data-panel data-foco-destino style="display:flex;gap:22px;align-items:center">
        ${aro(s.nota, '#fff', 'rgba(255,255,255,.15)', 104)}
        <div style="flex:1;min-width:0"><span class="etiqueta">${m.nombre} · ${s.dominio}</span><div style="font-size:24px;font-weight:600;margin:2px 0">${s.estado} · ${s.delta} desde el último análisis</div>
          ${g ? `<div class="google">${[['Personas', g.visitas, g.dv], ['Clics desde Google', g.clics, g.dc], ['Veces en Google', g.apariciones, g.da], ['Posición', g.posicion, g.dp]].map(([n, v, d]) => `<div><span>${n}</span><b>${v}</b><em>${d}</em></div>`).join('')}</div>` : `<div class="sin-google">Google no está conectado para esta web.<a class="pildora chica blanca" href="#/visibilidad/${s.dominio}">Conectar Google</a></div>`}
        </div>
      </article>
      ${s.dominio === 'kaivastudio.com' ? `<div class="aviso c8" data-panel><span class="punto" style="background:var(--violet)"></span><span><b>Google retiró el permiso.</b> Las cifras de Google están quietas desde el 18 oct.</span><a class="pildora chica" href="#/visibilidad">Volver a conectar</a></div>` : `<div class="aviso c8" data-panel><span class="punto" style="background:#C9C9CF"></span><span>Última medición: 18 oct · 1 análisis.</span></div>`}
      <div class="rejilla c8" style="grid-template-columns:repeat(8,minmax(0,1fr));min-height:0">
        <article class="tarjeta" data-panel style="grid-column: span 5;display:flex;flex-direction:column;min-height:0">
          <div class="tope" style="margin-bottom:0"><h2 class="t-tarjeta dos-tonos"><span class="gris">Personas</span> por semana</h2><span class="der suave" style="font-size:12.5px">pasa el mouse</span></div>
          ${linea(s.visitas)}
        </article>
        <article class="tarjeta" data-panel style="grid-column: span 3;display:flex;flex-direction:column;min-height:0">
          <div class="tope"><h2 class="t-tarjeta dos-tonos"><span class="gris">Lo que</span> buscan</h2></div>
          <div class="desliza" style="flex:1">${(g ? D.web.busquedas : []).map(b => `<div class="busq"><div><b>${b.q}</b><span>${b.c} clics</span></div><div class="meta-barra"><i style="width:${b.c / maxB * 100}%"></i></div></div>`).join('') || '<p class="suave" style="margin:0">Aparece al conectar Google.</p>'}</div>
          <div class="tope" style="margin:12px 0 6px"><h3 class="t-tarjeta dos-tonos" style="font-size:15px"><span class="gris">Lo que más</span> subiría la nota</h3></div>
          ${s.mejoras.map(t => `<div class="pend" style="font-weight:500"><span class="k">${ico('flecha', 12)}</span>${t}</div>`).join('')}
        </article>
      </div>
    </section>`;
  };

  // Línea grande: el trazo no se deforma y las letras quedan en HTML
  function linea(v) {
    const min = Math.min(...v) * .9, max = Math.max(...v) * 1.04, W = 1000, H = 300;
    const x = (i) => i / (v.length - 1) * W, y = (n) => H - (n - min) / (max - min) * H;
    const d = v.map((n, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(n).toFixed(1)}`).join(' ');
    return `<div class="linea-g">
      <div class="lienzo">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${[0, .5, 1].map(f => `<line x1="0" x2="${W}" y1="${H * f}" y2="${H * f}" stroke="#E6E6EA" vector-effect="non-scaling-stroke"/>`).join('')}
          <path d="${d}" fill="none" stroke="#080808" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>
        ${v.map((n, i) => `<span class="pt-g ${i === v.length - 1 ? 'ultimo' : ''}" style="left:${i / (v.length - 1) * 100}%;top:${y(n) / H * 100}%"><i></i><em>Semana ${i + 1} · <b>${n}</b> personas</em></span>`).join('')}
        <span class="valor-fin" style="top:${y(v[v.length - 1]) / H * 100}%">${v[v.length - 1]}</span>
      </div>
      <div class="ejes">${v.map((n, i) => `<span>${i % 3 === 0 || i === v.length - 1 ? 'sem ' + (i + 1) : ''}</span>`).join('')}</div>
    </div>`;
  }

  // ---------------- IDEAS (tendencias + sugerencias juntas) ----------------
  V.ideas = () => cabeza('ideas', '<span class="gris">Ideas</span> para esta semana') + `
    <section class="rejilla">${D.ideas.map(x => `<article class="tarjeta c4 tocable" style="display:flex;flex-direction:column;gap:12px">
      <span class="chip ${x.tipo === 'Tendencia' ? 'negro' : 'morado'}" style="align-self:flex-start">${x.tipo}</span>
      <h3 style="font-size:19px;letter-spacing:-.01em">${x.t}</h3><p class="suave" style="margin:0">${x.d}</p>
      <a class="ver" href="#/plan" style="margin-top:auto">Llevar al Plan ${ico('flecha', 15)}</a></article>`).join('')}</section>`;

  // ---------------- REGLAS de esta propuesta ----------------
  V.reglas = () => cabeza('reglas', '<span class="gris">Reglas</span> del panel') + `
    <section class="tarjeta desliza" style="flex:1"><ol style="margin:0;padding-left:22px;display:grid;gap:10px;font-size:15px;max-width:900px">
      ${['Inicio responde una sola pregunta: ¿qué tengo que hacer o decidir hoy?', 'Lo urgente arriba a la izquierda y en grande; lo que se consulta, abajo y en gris.', 'Máximo 4 números en Inicio, cada uno con contexto (meta o semana pasada) y su gráfica chiquita.', 'Nada de tablas de días (l m m j v s d): tendencia = línea; comparar = barras gorditas; decidir = texto.', 'El menú siempre con el nombre debajo del ícono; arriba lo diario, abajo lo de consulta.', 'Cada sección dice dónde estás (migas) y «Volver» lleva a donde venías, con su nombre.', 'Ctrl K abre el buscador: ir a cualquier sección, cliente o acción sin buscar en el menú.', 'Movimiento: nada pasa de 300 ms, solo se anima transform y opacity, y la entrada solo la primera vez del día.', 'Las tarjetas no flotan ni se mueven solas. Al tocar una, se convierte en la cabecera de su detalle.', 'Lo que es igual todos los días no ocupa Inicio. Si no hay nada pendiente, se dice «Todo al día» en una línea.', 'Una alerta solo existe si alguien puede hacer algo, y trae su botón.', '60 % blanco y grises, 30 % negro, 10 % morado: el morado es «hazlo ahora».', 'Nada de páginas dentro de páginas: cada sección muestra todo en su pantalla. Lo que se toca (una carpeta, una web) se abre ahí mismo.'].map(r => `<li>${r}</li>`).join('')}
    </ol></section>`;

  // =====================================================================
  //  ROUTER + transiciones
  // =====================================================================
  let focoOrigen = null, quieto = false;
  document.addEventListener('pointerdown', (e) => { focoOrigen = e.target.closest('[data-foco]'); quieto = !!e.target.closest('[data-quieto]'); }, true);

  function rutaActual() { return (location.hash.replace(/^#\/?/, '') || 'inicio').split('?')[0]; }
  function vistaDe(r) {
    if (V[r]) return V[r]();
    if (r.startsWith('proyectos/')) return V.proyectos(r.split('/')[1]);
    if (r.startsWith('visibilidad/')) return V.visibilidad(r.split('/')[1]);
    return V.inicio();
  }
  let primeraVez = !sessionStorage.getItem('kv-vio');
  let rutaPintada = null;
  function render(animar = true) {
    const r = rutaActual();
    const misma = (a, b) => a && b && a.split('/')[0] === b.split('/')[0] && !NOMBRES[a] === !NOMBRES[b] && (a.startsWith('proyectos') || a.startsWith('visibilidad'));
    if (misma(pila[pila.length - 1], r)) pila[pila.length - 1] = r;
    else if (pila[pila.length - 1] !== r) {
      if (pila[pila.length - 2] === r) pila.pop(); else pila.push(r);
      guardarPila();
    }
    const pintar = () => {
      rutaPintada = r;
      if (focoOrigen) focoOrigen.style.viewTransitionName = '';
      pintarMenu(r);
      $('#vista').innerHTML = vistaDe(r);
      document.title = nombreDe(r) + ' · Kaiva OS';
      if (r === 'inicio') pintarListaHoy();
      const dest = $('[data-foco-destino]');
      if (dest && focoOrigen) dest.style.viewTransitionName = 'foco';
      contar();
    };
    if (animar && document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (focoOrigen && document.body.contains(focoOrigen)) focoOrigen.style.viewTransitionName = 'foco';
      const t = document.startViewTransition(pintar);
      // Si el navegador no está pintando (pestaña al fondo), no esperar: cambiar sin transición
      setTimeout(() => { if (rutaPintada !== r) t.skipTransition(); }, 350);
      [t.ready, t.updateCallbackDone].forEach(p => p.catch(() => {}));
      t.finished.catch(() => {}).finally(() => { const d = $('[data-foco-destino]'); if (d) d.style.viewTransitionName = ''; focoOrigen = null; });
    } else { pintar(); focoOrigen = null; }
    $('#contenido').scrollTop = 0;
  }

  // Cifras: cuentan solo la primera vez de la sesión; al tocarlas, vuelven a contar
  const yaContadas = new Set(JSON.parse(sessionStorage.getItem('kv-contadas') || '[]'));
  function contarEl(el) {
    const txt = el.dataset.txt || el.textContent; el.dataset.txt = txt;
    const m = txt.match(/[\d.,]+/); if (!m) return;
    const num = parseFloat(m[0].replace(/\./g, '').replace(',', '.')), dec = (m[0].split(',')[1] || '').length;
    const t0 = performance.now(), dur = 1600;
    const paso = (t) => {
      const k = Math.max(0, Math.min(1, (t - t0) / dur)), e = 1 - Math.pow(1 - k, 3), v = num * e;
      el.textContent = txt.replace(m[0], dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('es-CO'));
      if (k < 1) requestAnimationFrame(paso); else el.textContent = txt;
    };
    requestAnimationFrame(paso);
  }
  function contar() {
    document.querySelectorAll('[data-cuenta]').forEach((el, i) => {
      const c = el.dataset.cuenta;
      if (c && !yaContadas.has(c)) { yaContadas.add(c); setTimeout(() => contarEl(el), i * 80); }
    });
    sessionStorage.setItem('kv-contadas', JSON.stringify([...yaContadas]));
  }

  // ---------- Clics ----------
  let temporizador;
  document.addEventListener('click', (e) => {
    const t = e.target;
    const c = t.closest('[data-cuenta]'); if (c) { contarEl(c); }
    const h = t.closest('[data-hecha]');
    if (h) {
      e.preventDefault();
      const id = +h.dataset.hecha, fila = h.closest('.fila');
      fila.classList.add('hecha');
      setTimeout(() => {
        E.hechas.push(id); pintarListaHoy(); actualizarProgreso(); pintarMenu(rutaActual());
        const tarea = D.tareas.find(x => x.id === id);
        $('#deshacer-txt').textContent = pendientes().length ? `Hecha: ${tarea.titulo.slice(0, 38)}${tarea.titulo.length > 38 ? '…' : ''}` : '¡Día limpio!';
        $('#deshacer').classList.add('ver-si'); $('#deshacer').dataset.id = id;
        clearTimeout(temporizador); temporizador = setTimeout(() => $('#deshacer')?.classList.remove('ver-si'), 4000);
      }, 210);
      return;
    }
    if (t.closest('#deshacer-btn')) {
      const id = +$('#deshacer').dataset.id; E.hechas = E.hechas.filter(x => x !== id);
      $('#deshacer').classList.remove('ver-si'); pintarListaHoy(); actualizarProgreso(); pintarMenu(rutaActual()); return;
    }
    const pg = t.closest('[data-pag]'); if (pg) { E.pagina += +pg.dataset.pag; pintarListaHoy(); return; }
    const rc = t.closest('[data-recordar]'); if (rc) { e.preventDefault(); e.stopPropagation(); E.cobrosRecordados[rc.dataset.recordar] = true; rc.textContent = 'Recordado'; rc.classList.add('listo'); return; }
    const dc = t.closest('[data-decidir]'); if (dc) { E.decididas[dc.dataset.decidir] = +dc.dataset.op; render(); return; }
    const cb = t.closest('[data-cambiar]'); if (cb) { delete E.decididas[cb.dataset.cambiar]; render(); return; }
    const fl = t.closest('[data-filtro]'); if (fl) { e.preventDefault(); E.filtroMov = fl.dataset.filtro; render(false); return; }
    const vb = t.closest('[data-volver]'); if (vb) { e.preventDefault(); focoOrigen = null; location.hash = vb.getAttribute('href'); return; }
    const bs = t.closest('[data-accion="buscar"]'); if (bs) { e.preventDefault(); abrirPaleta(); return; }
    if (t.closest('[data-accion="nuevo"]')) { e.preventDefault(); abrirPaleta('nuevo'); }
  });
  function actualizarProgreso() {
    const total = tareasHoy().length, hechas = total - pendientes().length, C = 2 * Math.PI * 12;
    const a = $('.aro-f'); if (a) a.style.strokeDashoffset = C * (1 - hechas / total);
    const tx = $('#prog-txt'); if (tx) tx.textContent = `${hechas} de ${total} hechas`;
  }

  // ---------- Buscador Ctrl K ----------
  const COMANDOS = [
    ...MENU.filter(m => m.r).map(m => ({ t: m.n, tipo: 'Ir a', r: m.r })),
    { t: 'Tablero de ventas', tipo: 'Ir a', r: 'ventas/tablero' }, { t: 'Personas', tipo: 'Ir a', r: 'ventas/personas' },
    ...Object.entries(D.marcas).filter(([k]) => D.proyectos.some(p => p.marca === k)).map(([k, m]) => ({ t: m.nombre, tipo: 'Cliente', r: 'proyectos/' + k, marca: k })),
    { t: 'Nuevo movimiento de dinero', tipo: 'Crear', r: 'ventas' }, { t: 'Nuevo seguimiento', tipo: 'Crear', r: 'inicio' },
    { t: 'Nuevo trato', tipo: 'Crear', r: 'ventas/tablero' }, { t: 'Programar publicación', tipo: 'Crear', r: 'redes' },
    { t: 'Decidir lo pendiente del lanzamiento', tipo: 'Hacer', r: 'plan' }, { t: 'kaivastudio.com · tráfico', tipo: 'Web', r: 'visibilidad/kaivastudio.com' }
  ];
  let sel = 0, lista = [];
  function abrirPaleta(q = '') {
    $('#paleta').classList.add('abierta'); const inp = $('#paleta input'); inp.value = q === 'nuevo' ? 'nuevo' : ''; filtrar(); inp.focus();
  }
  function cerrarPaleta() { $('#paleta').classList.remove('abierta'); }
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function filtrar() {
    const q = norm($('#paleta input').value.trim());
    lista = COMANDOS.filter(c => !q || q.split(' ').every(p => norm(c.t + ' ' + c.tipo).includes(p)));
    sel = 0; pintarPaleta();
  }
  function pintarPaleta() {
    $('#paleta ul').innerHTML = lista.map((c, i) => `<li class="${i === sel ? 'sel' : ''}" data-i="${i}">${c.marca ? `<span class="punto" style="background:${M(c.marca).claro}"></span>` : ico(c.tipo === 'Crear' ? 'mas' : 'flecha', 16)}${c.t}<span class="tipo">${c.tipo}</span></li>`).join('') || '<li class="suave">Nada con ese nombre.</li>';
  }
  $('#paleta input').addEventListener('input', filtrar);
  $('#paleta').addEventListener('click', (e) => { if (e.target.classList.contains('velo')) cerrarPaleta(); const li = e.target.closest('li[data-i]'); if (li) { location.hash = '#/' + lista[+li.dataset.i].r; cerrarPaleta(); } });
  let g = false;
  document.addEventListener('keydown', (e) => {
    const abierta = $('#paleta').classList.contains('abierta');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); abierta ? cerrarPaleta() : abrirPaleta(); return; }
    if (abierta) {
      if (e.key === 'Escape') cerrarPaleta();
      if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, lista.length - 1); pintarPaleta(); e.preventDefault(); }
      if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); pintarPaleta(); e.preventDefault(); }
      if (e.key === 'Enter' && lista[sel]) { focoOrigen = null; location.hash = '#/' + lista[sel].r; cerrarPaleta(); }
      return;
    }
    if (e.target.matches('input, textarea')) return;
    // G luego una letra: ir a una sección (como Linear)
    if (e.key.toLowerCase() === 'g') { g = true; setTimeout(() => g = false, 900); return; }
    if (g) { const mapa = { i: 'inicio', v: 'ventas', p: 'proyectos', r: 'redes', d: 'plan', w: 'visibilidad' }; const r = mapa[e.key.toLowerCase()]; if (r) location.hash = '#/' + r; g = false; }
  });

  window.addEventListener('hashchange', () => {
    if (quieto) { quieto = false; const y = $('#contenido').scrollTop; render(false); $('#contenido').scrollTop = y; document.querySelectorAll('[data-panel]').forEach(p => { p.classList.remove('cambia'); void p.offsetWidth; p.classList.add('cambia'); }); return; }
    render(true);
  });
  if (primeraVez) { document.body.classList.add('primera'); sessionStorage.setItem('kv-vio', '1'); setTimeout(() => document.body.classList.remove('primera'), 700); }
  render(false);
})();
