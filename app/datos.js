// Datos de EJEMPLO para la propuesta. No son las cifras reales del estudio.
window.KD = {
  hoy: { dia: 20, semana: 'Martes', mes: 'octubre' },

  marcas: {
    kaiva:  { nombre: 'Kaiva Studio',     color: '#4E1E86', claro: '#7A3FC9', ini: 'K' },
    cs:     { nombre: 'CS Travel Group',  color: '#0B1C3D', claro: '#2F5FC4', ini: 'CS' },
    thallo: { nombre: 'Thallo Digital',   color: '#34441B', claro: '#7FA33A', ini: 'T' },
    angopi: { nombre: 'Angopi',           color: '#0B5EA8', claro: '#0B5EA8', ini: 'A' },
    jacks:  { nombre: "Jack's Fast Food", color: '#8C8C93', claro: '#8C8C93', ini: 'JF' }
  },

  // Lo que hay que hacer: el corazón de Inicio
  tareas: [
    { id: 1, grupo: 'atrasado', titulo: 'Pedir reseñas en Google a todos los clientes', marca: 'kaiva', que: 'Tarea', quien: 'Sara', fecha: '14 oct', nota: 'Meta: 8 reseñas. El mensaje ya está listo en Plan.', ir: 'plan' },
    { id: 2, grupo: 'atrasado', titulo: 'Definir nombres de los fundadores y año de fundación', marca: 'kaiva', que: 'Tarea', quien: 'Nicolás', fecha: '15 oct', nota: 'Los piden los directorios: tiene que ser igual en todos.', ir: 'proyectos' },
    { id: 3, grupo: 'hoy', titulo: 'Enviar avance del portal de pagos', marca: 'cs', que: 'Entrega', quien: 'Nicolás', fecha: 'Hoy', nota: 'Cotización 2 · falta el flujo de reembolsos.', ir: 'proyectos/cs' },
    { id: 4, grupo: 'hoy', titulo: 'Recordar el pago de la Serie AI Shortlist', marca: 'thallo', que: 'Cobro', quien: 'Sara', fecha: 'Hoy', nota: '$1,2 M · lleva 20 días esperando.', ir: 'ventas' },
    { id: 5, grupo: 'hoy', titulo: 'Aprobar el carrusel «5 errores de una web»', marca: 'kaiva', que: 'Pieza', quien: 'Sara', fecha: 'Hoy', nota: 'Sale el jueves 23 en Instagram.', ir: 'redes' },
    { id: 6, grupo: 'hoy', titulo: 'Llamar a Angopi para la propuesta', marca: 'angopi', que: 'Seguimiento', quien: 'Nicolás', fecha: 'Hoy', nota: 'Pidió la propuesta de la web nueva.', ir: 'ventas/tablero' },
    { id: 7, grupo: 'semana', titulo: 'Grabar el Reel «Así trabajamos»', marca: 'kaiva', que: 'Pieza', quien: 'Sara', fecha: 'Jue 22', nota: 'Guion listo en Plan.', ir: 'redes' },
    { id: 8, grupo: 'semana', titulo: 'Enviar la cotización a Jack\'s Fast Food', marca: 'jacks', que: 'Seguimiento', quien: 'Nicolás', fecha: 'Vie 23', nota: 'Menú digital y web.', ir: 'ventas/tablero' }
  ],

  decisiones: [
    { id: 1, pregunta: '¿Cuándo salen las piezas del 19 al 23 de octubre?', porque: 'Si salen antes del 11 de noviembre, el lanzamiento deja de ser lo primero que la gente ve.', opciones: [ { t: 'Después del 11', d: 'Se guardan y salen después del lanzamiento.', rec: true }, { t: 'En su fecha', d: 'Salen esta semana, cada una en su día.' } ], pieza: { t: 'Caso CS Travel', f: 'Post · LinkedIn', marca: 'cs' } },
    { id: 2, pregunta: '¿Qué bio usamos en Instagram?', porque: 'Es lo primero que lee quien llega desde un Reel.', opciones: [ { t: 'Webs que venden', d: 'Diseño y webs para marcas que quieren crecer.', rec: true }, { t: 'Estudio creativo', d: 'Estudio de diseño y desarrollo en Barranquilla.' } ], pieza: { t: 'Bio de Instagram', f: 'Perfil', marca: 'kaiva' } },
    { id: 3, pregunta: '¿Qué 3 posts quedan fijados en el perfil?', porque: 'Son los que mira alguien antes de escribirnos.', opciones: [ { t: 'Casos', d: 'CS Travel, Thallo y el lanzamiento.', rec: true }, { t: 'Consejos', d: 'Los tres carruseles que más se guardaron.' } ], pieza: { t: 'Fijados', f: 'Perfil', marca: 'kaiva' } },
    { id: 4, pregunta: '¿Qué banner usamos en LinkedIn?', porque: 'Aparece en cada comentario que dejamos.', opciones: [ { t: 'Con el lema', d: 'Fondo negro, lema en blanco.', rec: true }, { t: 'Con trabajos', d: 'Tres portadas de proyectos.' } ], pieza: { t: 'Banner LinkedIn', f: 'Banner', marca: 'kaiva' } }
  ],

  dinero: {
    porCobrar: 5600000, porCobrarFacturas: 2,
    cobradoMes: 4400000, metaMes: 8000000,
    ganancia: 3100000,
    meses: [ { m: 'may', v: 3.0 }, { m: 'jun', v: 2.0 }, { m: 'jul', v: 6.8 }, { m: 'ago', v: 0 }, { m: 'sep', v: 6.4 }, { m: 'oct', v: 4.4 } ],
    cobros: [
      { marca: 'thallo', concepto: 'Serie AI Shortlist', valor: 1200000, desde: '30 sep', dias: 20 },
      { marca: 'cs', concepto: 'Cotización 2 · saldo 50 %', valor: 4400000, desde: '27 sep', dias: 23 }
    ],
    movimientos: [
      { f: '18 oct', concepto: 'CS Travel · anticipo cotización 2', marca: 'cs', valor: 4400000, tipo: 'entra' },
      { f: '15 oct', concepto: 'Hosting y dominios', marca: 'kaiva', valor: -380000, tipo: 'sale' },
      { f: '6 oct', concepto: 'Thallo · branding + web, pago 2', marca: 'thallo', valor: 2000000, tipo: 'entra' },
      { f: '3 oct', concepto: 'Licencias de diseño', marca: 'kaiva', valor: -520000, tipo: 'sale' },
      { f: '31 sep', concepto: 'CS Travel · pago 3 de 3', marca: 'cs', valor: 2950000, tipo: 'entra' },
      { f: '17 sep', concepto: 'CS Travel · pago 2 de 3', marca: 'cs', valor: 1850000, tipo: 'entra' }
    ],
    fijos: [ { t: 'Mantenimiento web', marca: 'jacks', v: '$900.000', dia: 'día 5' }, { t: 'SEO mensual', marca: 'kaiva', v: 'US$400', dia: 'día 15' } ]
  },

  tratos: {
    'Por empezar': [ { marca: 'jacks', t: 'Menú digital + web', v: '$6 M' } ],
    'En proceso':  [ { marca: 'angopi', t: 'Web nueva', v: '$9,5 M' }, { marca: 'cs', t: 'Cotización 3 · app', v: '$14 M' } ],
    'Ganados':     [ { marca: 'cs', t: 'Cotización 2 · portal', v: '$8,8 M' }, { marca: 'thallo', t: 'Serie AI Shortlist', v: '$2,4 M' } ],
    'Perdidos':    [ { marca: 'kaiva', t: 'Clínica dental · web', v: '$5 M' } ]
  },

  personas: [
    { marca: 'cs', nombre: 'Andrés', empresa: 'CS Travel Group', estado: 'Cliente', vale: '$16,6 M', tratos: 3, paso: 'Enviar avance del portal hoy', llego: 'Referido', hist: [['18 oct', 'Pagó el anticipo de la cotización 2'], ['9 oct', 'Aprobó el diseño del portal'], ['27 sep', 'Firmó la cotización 2']] },
    { marca: 'thallo', nombre: 'Camila', empresa: 'Thallo Digital', estado: 'Cliente', vale: '$5,2 M', tratos: 2, paso: 'Cobrar la Serie AI Shortlist', llego: 'Referido', hist: [['6 oct', 'Pagó la web, pago 2 de 2'], ['30 sep', 'Recibió la Serie AI Shortlist'], ['11 jul', 'Empezó branding + web']] },
    { marca: 'angopi', nombre: 'Angopi', empresa: 'Angopi Seguros', estado: 'Conversando', vale: '$9,5 M', tratos: 1, paso: 'Llamar hoy por la propuesta', llego: 'Potencial cliente', hist: [['16 oct', 'Pidió la propuesta de la web nueva'], ['10 oct', 'Primera reunión'], ['2 oct', 'Llegó por Google']] },
    { marca: 'jacks', nombre: 'Jack\'s Fast Food', empresa: 'Jack\'s Fast Food', estado: 'Por hablarle', vale: '$6 M', tratos: 1, paso: 'Enviar cotización el viernes', llego: 'Referido', hist: [['14 oct', 'Escribió por WhatsApp'], ['14 oct', 'Lo recomendó Camila, de Thallo']] }
  ],

  proyectos: [
    { id: 'cs', marca: 'cs', t: 'Portal, pagos y automatización', estado: 'En curso', entrega: '31 oct', avance: '4 de 7 tareas hechas', cobrar: '$4,4 M', archivos: 6 },
    { id: 'thallo', marca: 'thallo', t: 'Serie AI Shortlist', estado: 'Esperando el pago', entrega: 'Entregado', avance: '9 de 9 tareas hechas', cobrar: '$1,2 M', archivos: 4 },
    { id: 'kaiva', marca: 'kaiva', t: 'Nuestra marca y el lanzamiento', estado: 'En curso', entrega: '11 nov', avance: '12 de 20 tareas hechas', cobrar: '—', archivos: 14 }
  ],
  entregados: [ { marca: 'thallo', t: 'Branding + web', f: 'ago' }, { marca: 'cs', t: 'Primera web', f: 'abr' }, { marca: 'cs', t: 'Cotización 1', f: 'jul' } ],

  redes: {
    seguidores: 7989, segDelta: '+42 esta semana',
    alcance: [2.1, 2.4, 2.2, 3.1, 2.8, 3.4, 3.47],
    visitas: [520, 560, 540, 610, 590, 640, 647],
    semanas: [ { s: '1 sep', v: 1400 }, { s: '8 sep', v: 1650 }, { s: '15 sep', v: 1500 }, { s: '22 sep', v: 2100, reel: true }, { s: '29 sep', v: 1900 }, { s: '6 oct', v: 2200 }, { s: '13 oct', v: 3470, reel: true }, { s: '20 oct', v: 2600 } ],
    mejores: [
      { t: 'Antes y después Thallo', f: 'Reel', dia: '14 oct', alcance: '3.470', porque: 'Se guardó 212 veces: el antes y después engancha.' },
      { t: '6 señales', f: 'Carrusel', dia: '2 oct', alcance: '1.980', porque: 'Lo compartieron 41 veces por WhatsApp.' },
      { t: 'Llegamos', f: 'Post', dia: '24 sep', alcance: '1.540', porque: 'Muchos comentarios de clientes.' }
    ],
    piezas: [
      { t: '5 errores de una web', f: 'Carrusel', red: 'Instagram', dia: 'Jue 23', estado: 'programado' },
      { t: 'Así trabajamos', f: 'Reel', red: 'Instagram', dia: 'Sáb 25', estado: 'por aprobar' },
      { t: 'Caso CS Travel', f: 'Post', red: 'LinkedIn', dia: 'Lun 27', estado: 'idea' }
    ],
    feed: ['Antes y después Thallo', '6 señales', 'Llegamos', 'Qué recibes', 'Brand book', 'Caso CS Travel', '5 errores', 'Así trabajamos', 'Lanzamiento', 'Webs que venden', 'El equipo', 'Proceso', 'Thallo · web', 'CS Travel · app', 'Hola, Barranquilla', 'Antes y después CS', 'Paleta Thallo', 'Q&A']
  },

  web: {
    nota: 86, puesto: 1, de: 8,
    visitas: [480, 510, 530, 505, 560, 590, 600, 615, 640, 647],
    google: [3.9, 4.1, 4.0, 4.3, 4.5, 4.6, 4.93],
    sitios: [
      { marca: 'kaiva', dominio: 'kaivastudio.com', nota: 86, delta: '+5', estado: 'Bien',
        visitas: [480, 510, 530, 505, 560, 590, 600, 615, 640, 647],
        google: { visitas: '2.950', dv: '+54 %', clics: '512', dc: '+65 %', apariciones: '16.900', da: '+53 %', posicion: '8,4', dp: 'subió 2' },
        mejoras: ['Responder las 3 reseñas sin respuesta', 'Volver a conectar Google', 'Igualar los datos de la empresa en los directorios'] },
      { marca: 'cs', dominio: 'cstravelgroup.com', nota: 65, delta: '+2', estado: 'Regular',
        visitas: [210, 230, 220, 260, 250, 270, 300, 290, 310, 320],
        mejoras: ['Fotos más livianas: tarda 4 s en abrir en celular', 'Título y descripción para Google en cada página', 'Conectar Google para ver las búsquedas'] },
      { marca: 'thallo', dominio: 'thallodigital.com', nota: 61, delta: '0', estado: 'Regular',
        visitas: [120, 118, 130, 125, 140, 138, 150, 149, 160, 158],
        mejoras: ['Ficha de Google con dirección y horario', 'Botón de WhatsApp visible en celular', 'Conectar Google para ver las búsquedas'] }
    ],
    busquedas: [ { q: 'diseño web barranquilla', c: 142 }, { q: 'kaiva studio', c: 118 }, { q: 'agencia de branding colombia', c: 64 }, { q: 'páginas web para empresas', c: 41 }, { q: 'diseño de logos barranquilla', c: 33 } ],
    competencia: [ { n: 'Orbix Studio', nota: 86 }, { n: 'Contra Studio', nota: 81 }, { n: 'Monks', nota: 79 } ]
  },

  ideas: [
    { t: 'Los carruseles «antes y después» se guardan el doble', d: 'En el nicho de estudios de diseño, octubre.', tipo: 'Tendencia' },
    { t: 'Responder reseñas en Google sube la posición', d: 'Tenemos 3 sin responder.', tipo: 'Sugerencia' },
    { t: 'Reels de menos de 15 s con texto grande', d: 'Lo que más alcance tuvo en 3 competidores.', tipo: 'Tendencia' }
  ]
};
