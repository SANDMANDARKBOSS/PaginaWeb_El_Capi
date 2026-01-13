let menuData = [];

document.addEventListener('DOMContentLoaded', function () {

    const textoPorcentaje = document.getElementById('porcentaje');
    let valor = 0;

    const contador = setInterval(() => {
        valor += 1;

        if (textoPorcentaje) textoPorcentaje.textContent = valor + '%';

        if (valor === 100) {
            clearInterval(contador);
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 200);
        }
    }, 20);

    const slides = document.querySelectorAll('.hero-carousel .slide');
    let currentSlide = 0;
    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    consumirAPI();
});

async function consumirAPI() {
    const contenedor = document.getElementById('lista-platos');

    try {
        contenedor.innerHTML = '<p style="text-align:center; padding: 20px;">Cargando menú...</p>';

        const respuesta = await fetch('https://api.npoint.io/cef7eb527be6b0ec977d');

        if (!respuesta.ok) throw new Error('Error de conexión');

        menuData = await respuesta.json();
        cargarMenu('todos');

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p style="text-align:center; color:red;">Error al cargar los datos.</p>';
    }
}


function cargarMenu(filtro) {
    const contenedor = document.getElementById('lista-platos');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    const platosFiltrados = filtro === 'todos' ? menuData : menuData.filter(plato => plato.categoria === filtro);

    if (platosFiltrados.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; width:100%;">Próximamente...</p>';
        return;
    }

    platosFiltrados.forEach(plato => {
        const div = document.createElement('div');
        div.classList.add('plato-card');
        const img = plato.imagen ? plato.imagen : './IMG/logo.png';

        div.innerHTML = `
            <img src="${img}" alt="${plato.nombre}" loading="lazy">
            <div class="card-body">
                <span class="cat-tag" style="background:#4E342E; color:#fff; padding:2px 8px; border-radius:10px; font-size:0.8em;">${plato.categoria}</span>
                <h3>${plato.nombre}</h3>
                <p>${plato.descripcion}</p>
                <span class="precio">$${parseFloat(plato.precio).toFixed(2)}</span>
            </div>
        `;
        contenedor.appendChild(div);
    });
}