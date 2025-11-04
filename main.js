// main.js - lógica para fetch, localStorage, Bootstrap components y PWA registration

// Inicializar tooltip y toast (Bootstrap)
document.addEventListener('DOMContentLoaded', () => {
  // Tooltip
  const tooltipTrigger = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTrigger.forEach(el => new bootstrap.Tooltip(el));

  // Toast referencia
  window.miToast = new bootstrap.Toast(document.getElementById('miToast'));

  // Intentar registrar service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker registrado'))
      .catch(err => console.warn('SW no registrado:', err));
  }

  // cargar imagen si existe
  const imgGuardada = localStorage.getItem('imagenProyecto');
  if (imgGuardada) {
    document.getElementById('preview').src = imgGuardada;
  }
});

// ---------- FETCH ----------
const apiUrl = 'https://jsonplaceholder.typicode.com/users';
document.getElementById('btnCargar').addEventListener('click', () => {
  const spinner = document.getElementById('spinnerArea');
  spinner.style.display = 'inline-block';
  fetch(apiUrl)
    .then(response => {
      spinner.style.display = 'none';
      if (!response.ok) throw new Error('Respuesta no OK ' + response.status);
      return response.json();
    })
    .then(users => {
      const lista = document.getElementById('listaUsuarios');
      lista.innerHTML = '';
      users.forEach(u => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<strong>${u.name}</strong> &nbsp; <small>${u.email}</small><br>
                        ${u.address.street}, ${u.address.city} <br> Tel: ${u.phone}`;
        lista.appendChild(li);
      });
      // mostrar toast
      window.miToast.show();
    })
    .catch(err => {
      spinner.style.display = 'none';
      console.error('Error fetch:', err);
      const lista = document.getElementById('listaUsuarios');
      lista.innerHTML = '<li class="list-group-item text-danger">Error al cargar usuarios.</li>';
    });
});

// ---------- LocalStorage - nombre ----------
document.getElementById('btnGuardarNombre').addEventListener('click', () => {
  const val = document.getElementById('nombre').value || '';
  localStorage.setItem('nombreUsuario', val);
  document.getElementById('mostrarNombre').innerText = 'Nombre guardado: ' + val;
  window.miToast.show();
});
document.getElementById('btnLeerNombre').addEventListener('click', () => {
  const val = localStorage.getItem('nombreUsuario') || '(vacío)';
  document.getElementById('mostrarNombre').innerText = 'Nombre en LocalStorage: ' + val;
});

// ---------- Imagenes ----------
const imgInput = document.getElementById('imgInput');
document.getElementById('btnGuardarImg').addEventListener('click', () => {
  if (!imgInput.files || !imgInput.files[0]) {
    alert('Selecciona primero un archivo de imagen.');
    return;
  }
  const file = imgInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    // guardar en localStorage (Base64)
    try {
      localStorage.setItem('imagenProyecto', reader.result);
      document.getElementById('preview').src = reader.result;
      window.miToast.show();
    } catch (e) {
      alert('Error guardando la imagen en LocalStorage (posible límite de espacio).');
      console.error(e);
    }
  };
  reader.readAsDataURL(file);
});

document.getElementById('btnCargarImg').addEventListener('click', () => {
  const img = localStorage.getItem('imagenProyecto');
  if (img) {
    document.getElementById('preview').src = img;
  } else {
    alert('No hay imagen guardada.');
  }
});
