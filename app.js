// Estructura: { nombre: string, sorteado: boolean }
let amigos = [];
let sorteoIniciado = false; // para permitir continuar hasta el último una vez iniciado

// Agregar amigo
function agregarAmigo() {
  const input = document.getElementById('amigo');
  const nombre = input.value.trim();

  if (!nombre) {
    alert('Por favor, inserte un nombre.');
    return;
  }

  amigos.push({ nombre, sorteado: false });
  input.value = '';
  sorteoIniciado = false;          // si agregas, aún no ha iniciado el sorteo
  actualizarLista();
  mostrarResultado('Aún no hay resultado.');
  toggleReiniciar(false);
  input.focus();
}

// Renderizar lista
function actualizarLista() {
  const lista = document.getElementById('listaAmigos');
  lista.innerHTML = '';

  for (let i = 0; i < amigos.length; i++) {
    const li = document.createElement('li');
    li.className = amigos[i].sorteado ? 'li-sorteado' : '';

    const label = document.createElement('label');
    label.className = 'amigo-item';

    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.disabled = true;
    chk.checked = amigos[i].sorteado;

    const span = document.createElement('span');
    span.textContent = amigos[i].nombre;

    const tag = document.createElement('small');
    tag.className = 'tag';
    tag.textContent = amigos[i].sorteado ? 'Sorteado' : 'Pendiente';

    label.append(chk, span, tag);
    li.appendChild(label);
    lista.appendChild(li);
  }

  // NOTA: no deshabilitamos el botón de sorteo para que muestre mensajes al hacer clic
}

// Sorteo
function sortearAmigo() {
  const resultado = document.getElementById('resultado');

  // Validación previa al inicio: al menos 2 nombres
  if (!sorteoIniciado) {
    const pendientesIniciales = amigos.filter(a => !a.sorteado).length;

    if (pendientesIniciales === 0) {
      resultado.innerHTML = '⚠️ No hay amigos para sortear. Agrega al menos uno.';
      return;
    }
    if (pendientesIniciales < 2) {
      resultado.innerHTML = 'ℹ️ Debes agregar <strong>al menos 2</strong> nombres para iniciar el sorteo.';
      return;
    }
    sorteoIniciado = true;
  }

  // Candidatos no sorteados
  const candidatos = amigos
    .map((a, idx) => ({ ...a, idx }))
    .filter(a => !a.sorteado);

  // Si no quedan candidatos
  if (candidatos.length === 0) {
    resultado.innerHTML = '✅ ¡Todos los amigos ya fueron sorteados!';
    toggleReiniciar(true);
    return;
  }

  // Elegir uno al azar
  const indiceCandidatos = Math.floor(Math.random() * candidatos.length);
  const elegido = candidatos[indiceCandidatos];

  // Marcar como sorteado y actualizar UI
  amigos[elegido.idx].sorteado = true;
  actualizarLista();

  // Mostrar resultado
  resultado.innerHTML = `🎉 Amigo secreto: <strong>${escaparHTML(elegido.nombre)}</strong>`;

  // Si ya no quedan pendientes, mensaje final + botón reiniciar
  const quedanPendientes = amigos.some(a => !a.sorteado);
  if (!quedanPendientes) {
    setTimeout(() => {
      resultado.innerHTML = '✅ ¡Todos los amigos ya fueron sorteados!';
      toggleReiniciar(true);
    }, 1200);
  }
}

// Reiniciar sorteo (limpia **todo**)
function reiniciarSorteo() {
  amigos = [];               // vaciar lista
  sorteoIniciado = false;    // reiniciar estado
  actualizarLista();         // re-render sin elementos
  mostrarResultado('Aún no hay resultado.');
  toggleReiniciar(false);    // ocultar botón reiniciar
  const input = document.getElementById('amigo');
  input.value = '';
  input.focus();
}

// Utilidades UI
function toggleReiniciar(mostrar) {
  const btn = document.getElementById('btn-reiniciar');
  if (mostrar) btn.classList.remove('hidden');
  else btn.classList.add('hidden');
}

function mostrarResultado(texto) {
  const res = document.getElementById('resultado');
  res.innerHTML = texto || 'Aún no hay resultado.';
}

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.innerText = texto;
  return div.innerHTML;
}

// Eventos
document.getElementById('btn-add').addEventListener('click', agregarAmigo);
document.getElementById('btn-sorteo').addEventListener('click', sortearAmigo);
document.getElementById('btn-reiniciar').addEventListener('click', reiniciarSorteo);

document.getElementById('amigo').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') agregarAmigo();
});
