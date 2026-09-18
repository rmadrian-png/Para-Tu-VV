const canvas = document.getElementById('lienzoArbol');
const ctx = canvas.getContext('2d');

const colores = ['#FFD700', '#FFC107', '#FFB300', '#FFA000', '#FFE082', '#E65100', '#FFF59D', '#FF9800'];

function dibujarPetalo(x, y, tamano, color, angulo = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angulo);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-tamano / 2, -tamano / 2, -tamano, tamano / 3, 0, tamano);
  ctx.bezierCurveTo(tamano, tamano / 3, tamano / 2, -tamano / 2, 0, 0);
  ctx.fill();
  ctx.restore();
}

function dibujarCorazon(x, y, tamano, color, angulo = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angulo);
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = tamano * 0.3;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(0, 0, -tamano / 2, 0, -tamano / 2, topCurveHeight);
  ctx.bezierCurveTo(-tamano / 2, (tamano + topCurveHeight) / 2, 0, tamano, 0, tamano);
  ctx.bezierCurveTo(0, tamano, tamano / 2, (tamano + topCurveHeight) / 2, tamano / 2, topCurveHeight);
  ctx.bezierCurveTo(tamano / 2, 0, 0, 0, 0, topCurveHeight);
  ctx.fill();
  ctx.restore();
}

function dibujarGirasol(girasol, progresoGeneral, viento) {
  const altoTalloMax = girasol.altura;
  const baseY = window.innerHeight - 5;

  const pTallo = Math.min(Math.max((progresoGeneral - 0.1) / 0.65, 0), 1);
  if (pTallo <= 0) return;

  const curvaViento = girasol.curva + Math.sin(viento + girasol.faseViento) * 12;
  const altoTalloActual = altoTalloMax * pTallo;
  const yFlor = baseY - altoTalloActual;

  ctx.save();
  ctx.strokeStyle = '#2d5a27';
  ctx.fillStyle = '#2d5a27';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(girasol.x, baseY);
  ctx.quadraticCurveTo(girasol.x + curvaViento * pTallo, baseY - (altoTalloActual * 0.5), girasol.x + (curvaViento * 0.8 * pTallo), yFlor);
  ctx.stroke();

  if (pTallo > 0.4) {
    const pHoja = (pTallo - 0.4) / 0.6;
    ctx.beginPath();
    ctx.ellipse(girasol.x - 5 * pHoja, baseY - (altoTalloActual * 0.3), 6 * pHoja, 3 * pHoja, -Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(girasol.x + 5 * pHoja, baseY - (altoTalloActual * 0.5), 6 * pHoja, 3 * pHoja, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  }

  if (pTallo >= 0.8) {
    const pFlor = Math.min(Math.max((progresoGeneral - 0.6) / 0.35, 0), 1);
    const xCentroFlor = girasol.x + (curvaViento * 0.8 * pTallo);
    const tamanoFlor = girasol.tamano * pFlor;

    const numPetalos = 12;
    for (let i = 0; i < numPetalos; i++) {
      const anguloPetalo = (i * Math.PI * 2) / numPetalos;
      ctx.save();
      ctx.translate(xCentroFlor, yFlor);
      ctx.rotate(anguloPetalo);
      ctx.fillStyle = '#FFC107';
      ctx.beginPath();
      ctx.ellipse(0, -tamanoFlor * 0.8, tamanoFlor * 0.3, tamanoFlor * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(xCentroFlor, yFlor, tamanoFlor * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#3E2723';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1B0000';
    ctx.stroke();
  }

  ctx.restore();
}

let centroX, centroY, escalaCorazon;
const copasPetalos = [];
const sueloPetalos = [];
const listaRamitas = [];
const listaGirasoles = [];

let progresoTronco = 0;
let indiceProgresoCopa = 0;

function inicializarEscena() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (window.innerWidth < window.innerHeight) {
    centroX = window.innerWidth * 0.5;
    centroY = window.innerHeight * 0.55;
  } else {
    centroX = window.innerWidth * 0.72;
    centroY = window.innerHeight * 0.32;
  }

  escalaCorazon = Math.min(window.innerWidth, window.innerHeight) * 0.025;

  progresoTronco = 0;
  indiceProgresoCopa = 0;

  copasPetalos.length = 0;
  const cantidadCopas = 4000;

  for (let i = 0; i < cantidadCopas; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.random(); 
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

    copasPetalos.push({
      x: centroX + (hx * escalaCorazon * r) + (Math.random() * 16 - 8),
      y: centroY + (hy * escalaCorazon * r) + (Math.random() * 16 - 8),
      tamano: Math.random() * 10 + 6,
      color: colores[Math.floor(Math.random() * colores.length)],
      anguloBase: Math.random() * Math.PI,
      faseViento: Math.random() * Math.PI * 2
    });
  }

  sueloPetalos.length = 0;
  const cantidadSuelo = 1800;
  const altoAlfombra = 25;

  for (let i = 0; i < cantidadSuelo; i++) {
    sueloPetalos.push({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight - (Math.random() * altoAlfombra),
      tamano: Math.random() * 8 + 4,
      color: colores[Math.floor(Math.random() * colores.length)],
      angulo: Math.random() * Math.PI
    });
  }

  listaRamitas.length = 0;
  const numRamitas = 14;
  for (let i = 0; i < numRamitas; i++) {
    const alturaRel = 0.2 + (i / numRamitas) * 0.65;
    const esIzq = i % 2 === 0;
    
    listaRamitas.push({
      alturaRel: alturaRel,
      esIzq: esIzq,
      longitud: Math.random() * 25 + 22,
      angulo: (esIzq ? -1 : 1) * (0.5 + Math.random() * 0.4),
      grosor: 4
    });
  }

  listaGirasoles.length = 0;
  const numGirasoles = 35;
  const pasoX = window.innerWidth / numGirasoles;

  for (let i = 0; i < numGirasoles; i++) {
    const posX = (i * pasoX) + (Math.random() * pasoX * 0.8);
    
    if (Math.abs(posX - centroX) > 40) {
      listaGirasoles.push({
        x: posX,
        altura: Math.random() * 45 + 45,
        tamano: Math.random() * 8 + 12,
        curva: (Math.random() * 16 - 8),
        faseViento: Math.random() * Math.PI * 2
      });
    }
  }
}

class CorazonCayendo {
  constructor() { this.reset(true); }

  reset(primerInicio = false) {
    this.x = Math.random() * window.innerWidth;
    this.y = primerInicio ? Math.random() * window.innerHeight : -20;
    this.tamano = Math.random() * 10 + 6;
    this.color = colores[Math.floor(Math.random() * colores.length)];
    this.velocidadY = Math.random() * 1.5 + 0.8;
    this.oscilacion = Math.random() * 0.03 + 0.01;
    this.angulo = (Math.random() - 0.5) * 0.8;
    this.paso = Math.random() * 100;
  }

  actualizar() {
    this.paso += this.oscilacion;
    this.y += this.velocidadY;
    this.x += Math.sin(this.paso) * 1.2;
    this.angulo += 0.01;

    if (this.y > window.innerHeight + 20) {
      this.reset(false);
    }
  }

  dibujar() {
    dibujarCorazon(this.x, this.y, this.tamano, this.color, this.angulo);
  }
}

const corazonesFlotantes = [];
for (let i = 0; i < 150; i++) {
  corazonesFlotantes.push(new CorazonCayendo());
}

function dibujarTroncoAnimado(progreso) {
  const baseY = window.innerHeight;
  const alturaTotal = baseY - centroY;
  const alturaActual = baseY - (alturaTotal * progreso);

  ctx.save();
  ctx.fillStyle = '#3a200a';
  ctx.strokeStyle = '#3a200a';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(centroX - 35, baseY);
  ctx.bezierCurveTo(centroX - 15, baseY - (alturaTotal * 0.3 * progreso), centroX - 18, baseY - (alturaTotal * 0.6 * progreso), centroX - 7, alturaActual);
  ctx.lineTo(centroX + 7, alturaActual);
  ctx.bezierCurveTo(centroX + 18, baseY - (alturaTotal * 0.6 * progreso), centroX + 15, baseY - (alturaTotal * 0.3 * progreso), centroX + 35, baseY);
  ctx.closePath();
  ctx.fill();

  listaRamitas.forEach(ramita => {
    if (progreso >= ramita.alturaRel) {
      const pRamita = Math.min((progreso - ramita.alturaRel) / 0.12, 1);
      const yOrigen = baseY - (alturaTotal * ramita.alturaRel);
      const factorAncho = 1 - (ramita.alturaRel * 0.7);
      const offsetCorteza = (ramita.esIzq ? -1 : 1) * 18 * factorAncho;
      const xOrigen = centroX + offsetCorteza;

      const xDestino = xOrigen + Math.sin(ramita.angulo) * (ramita.longitud * pRamita);
      const yDestino = yOrigen - Math.cos(ramita.angulo) * (ramita.longitud * pRamita);

      ctx.lineWidth = ramita.grosor * pRamita;
      ctx.beginPath();
      ctx.moveTo(xOrigen, yOrigen);
      ctx.quadraticCurveTo(xOrigen + (ramita.esIzq ? -8 : 8) * pRamita, yOrigen - (ramita.longitud * 0.4 * pRamita), xDestino, yDestino);
      ctx.stroke();
    }
  });

  ctx.restore();
}

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const viento = Date.now() * 0.002;

  if (progresoTronco < 1) {
    progresoTronco += 0.006;
    if (progresoTronco > 1) progresoTronco = 1;
  }

  dibujarTroncoAnimado(progresoTronco);

  listaGirasoles.forEach(girasol => {
    dibujarGirasol(girasol, progresoTronco, viento);
  });

  const limiteSuelo = Math.floor(sueloPetalos.length * Math.min(progresoTronco * 1.2, 1));
  for (let i = 0; i < limiteSuelo; i++) {
    const p = sueloPetalos[i];
    dibujarPetalo(p.x, p.y, p.tamano, p.color, p.angulo);
  }

  if (progresoTronco >= 0.78) {
    if (indiceProgresoCopa < copasPetalos.length) {
      indiceProgresoCopa += 45;
    }

    for (let i = 0; i < Math.min(indiceProgresoCopa, copasPetalos.length); i++) {
      const p = copasPetalos[i];
      const anguloViento = p.anguloBase + Math.sin(viento + p.faseViento) * 0.18;
      const offsetX = Math.sin(viento + p.faseViento) * 2;
      const offsetY = Math.cos(viento + p.faseViento) * 1.5;
      
      dibujarPetalo(p.x + offsetX, p.y + offsetY, p.tamano, p.color, anguloViento);
    }
  }

  for (let i = 0; i < corazonesFlotantes.length; i++) {
    corazonesFlotantes[i].actualizar();
    corazonesFlotantes[i].dibujar();
  }

  requestAnimationFrame(animar);
}

// Configuración inicial de dimensiones y coordenadas
inicializarEscena();

window.addEventListener('resize', () => { inicializarEscena(); });

// --- CONTROL DE AUDIO E INTERACCIÓN ---
const musica = document.getElementById('musicaFondo');
const btnAudio = document.getElementById('btnAudio');
const btnActivarMúsica = document.getElementById('btnActivarMúsica');
const avisoGirar = document.getElementById('aviso-girar');

function reproducirMusica() {
  if (musica) {
    musica.volume = 0.6;
    
    // Si la música está desde el inicio, salta al segundo 47
    if (musica.currentTime < 1) {
      musica.currentTime = 47;
    }

    const promesaPlay = musica.play();
    
    if (promesaPlay !== undefined) {
      promesaPlay.then(() => {
        if (btnAudio) btnAudio.textContent = '🎵';
      }).catch(error => {
        console.log("El navegador bloqueó el auto-play:", error);
        if (btnAudio) btnAudio.textContent = '🔇';
      });
    }
  }
}

// Al presionar el botón dentro del aviso inicial
if (btnActivarMúsica) {
  btnActivarMúsica.addEventListener('click', () => {
    reproducirMusica();
    avisoGirar.classList.add('oculto');
  });
}

// Control manual del botón flotante inferior
if (btnAudio && musica) {
  btnAudio.addEventListener('click', () => {
    if (musica.paused) {
      reproducirMusica();
      btnAudio.textContent = '🎵';
    } else {
      musica.pause();
      btnAudio.textContent = '🔇';
    }
  });
}

// Ocultar aviso automáticamente a los 3.2s e iniciar escena
setTimeout(() => {
  if (avisoGirar && !avisoGirar.classList.contains('oculto')) {
    avisoGirar.classList.add('oculto');
  }

  // Iniciar escena gráfica y letras
  animar();
  const contenedorTexto = document.querySelector(".contenedor-texto");
  if (contenedorTexto) {
    contenedorTexto.classList.add("iniciar-animacion");
  }

  // Intento de reproducción automática por si el navegador lo permite sin clic
  reproducirMusica();
}, 3200);