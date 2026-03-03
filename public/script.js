// 🌙 Modo Oscuro
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
});

// ⏱️ Contador Regresivo
const targetDate = new Date(new Date().getFullYear(), 2, 6, 16, 0, 0).getTime(); // 6 de Marzo, 16:00 (Mes 2 = Marzo)
setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;
    if (distance < 0) {
        document.getElementById("countdown").innerHTML = "¡El evento ha comenzado!";
        return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById("countdown").innerHTML = `Faltan: ${days}d ${hours}h para encontrarnos`;
}, 1000);

// 📝 Contador de caracteres Espacio Violeta
const anonTexto = document.getElementById('anon-texto');
const charCount = document.getElementById('char-count');
anonTexto.addEventListener('input', () => {
    charCount.textContent = `${anonTexto.value.length} / 1500`;
});

// 🚀 Enviar Emprendimiento
document.getElementById('form-emprendimiento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const necesidades = Array.from(document.querySelectorAll('input[name="necesidades"]:checked')).map(cb => cb.value);
    
    const data = {
        nombre: document.getElementById('emp-nombre').value,
        tipo: document.getElementById('emp-tipo').value,
        descripcion: document.getElementById('emp-desc').value,
        necesidades: JSON.stringify(necesidades),
        equipo: document.getElementById('emp-equipo').value,
        contacto: document.getElementById('emp-contacto').value
    };

    const res = await fetch('/api/emprendimientos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if(res.ok) {
        document.getElementById('emp-msg').innerHTML = "<p style='color:green; font-weight:bold;'>¡Solicitud enviada con éxito!</p>";
        e.target.reset();
    }
});

// 💜 Enviar Mensaje Anónimo
document.getElementById('form-anonimo').addEventListener('submit', async (e) => {
    e.preventDefault();
    const texto = document.getElementById('anon-texto').value.trim();
    if(texto.length < 5) return alert("El mensaje es muy corto."); // Filtro básico antispam

    const data = {
        tipo: document.getElementById('anon-tipo').value,
        texto: texto,
        leer_microfono: document.getElementById('anon-micro').checked,
        publicar_muro: document.getElementById('anon-muro').checked
    };

    const res = await fetch('/api/testimonios', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if(res.ok) {
        document.getElementById('anon-msg').innerHTML = "<p style='color:green; font-weight:bold;'>Tu mensaje fue recibido de forma anónima y segura.</p>";
        e.target.reset();
        charCount.textContent = "0 / 1500";
    }
});