// Carga los datos de data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const heroes = data;
        const rejillaHeroes = document.getElementById('rejilla-heroes');
        const botonesFiltro = document.querySelectorAll('.boton-navegacion');
        // Detener el spinner
        document.querySelector('.head-load').style.display = 'none';
        // Función para mostrar los héroes en la rejilla
        function mostrarHeroes(heroesAMostrar) {
            rejillaHeroes.innerHTML = ''; // Limpiar la rejilla

            heroesAMostrar.forEach(hero => {
                const tarjetaHeroe = document.createElement('div');
                tarjetaHeroe.classList.add('tarjeta-heroe');
                tarjetaHeroe.setAttribute('data-hero-id', hero.id);
                tarjetaHeroe.addEventListener('click', () => abrirModalHeroe(hero));

                const imagenTarjeta = document.createElement('div');
                imagenTarjeta.classList.add('imagen-tarjeta');
                const img = document.createElement('img');
                img.src = hero.img_path;
                img.alt = hero.nombre;
                imagenTarjeta.appendChild(img);
                tarjetaHeroe.appendChild(imagenTarjeta);

                const nombreHeroe = document.createElement('div');
                nombreHeroe.classList.add('nombre-heroe');

                // Agregar logo de rol
                let logoRol;
                if (hero.rol === 'tank') {
                    logoRol = crearImagenRol('/logos/tankLogo.svg', 'logo de tank');
                } else if (hero.rol === 'dps') {
                    logoRol = crearImagenRol('/logos/dpsLogo.svg', 'logo de dps');
                } else if (hero.rol === 'supp') {
                    logoRol = crearImagenRol('/logos/suppLogo.svg', 'logo de supp');
                }
                nombreHeroe.appendChild(logoRol);

                const spanNombre = document.createElement('span');
                spanNombre.textContent = hero.nombre;
                nombreHeroe.appendChild(spanNombre);
                tarjetaHeroe.appendChild(nombreHeroe);

                rejillaHeroes.appendChild(tarjetaHeroe);
            });
        }

        // Función auxiliar para crear la imagen del rol
        function crearImagenRol(src, alt) {
            const imgRol = document.createElement('img');
            imgRol.src = src;
            imgRol.alt = alt;
            imgRol.width = 30;
            imgRol.height = 30;
            return imgRol;
        }

        // Función para filtrar héroes
        function filtrarHeroes(filtro) {
            let heroesFiltrados = heroes;
            if (filtro !== 'all') {
                heroesFiltrados = heroes.filter(hero => hero.rol === filtro);
            }
            mostrarHeroes(heroesFiltrados);
        }

        // Manejar clics en los botones de filtro
        botonesFiltro.forEach(boton => {
            boton.addEventListener('click', () => {
                const filtro = boton.getAttribute('data-filtro');
                filtrarHeroes(filtro);

                // Actualizar la clase "filtro-seleccionado"
                botonesFiltro.forEach(b => b.classList.remove('filtro-seleccionado'));
                boton.classList.add('filtro-seleccionado');
            });
        });

        // Mostrar todos los héroes al cargar la página
        filtrarHeroes('all');

        // Función para abrir el modal de un héroe
        function abrirModalHeroe(hero) {
            document.getElementById('imagen-heroe-modal').src = hero.img_path;
            document.getElementById('nombre-heroe-modal').textContent = hero.nombre;
            document.getElementById('nota-heroe-modal').textContent = hero.nota;

            // Mostrar counters y countereas
            mostrarCountersYCountereas(hero);

            abrirModal('contadoresHeroe');
        }

        // Función para mostrar counters y countereas en el modal
        function mostrarCountersYCountereas(hero) {
            const columnaCounters = document.getElementById('columna-counters');
            const columnaCountereas = document.getElementById('columna-countereas');

            columnaCounters.innerHTML = '<div class="texto-cuerpo">Counters</div>';
            columnaCountereas.innerHTML = '<div class="texto-cuerpo">Es Counter</div>';

            // Buscar los IDs de counters y countereas en la data
            const heroCountersIds = hero.counters.map(c => c.id);
            const heroCounteredByIds = hero.countered_by.map(c => c.id);

            // Agrupar counters y countereas por rol
            const countersByRol = agruparPorRol(heroes.filter(h => heroCountersIds.includes(h.id)));
            const countereasByRol = agruparPorRol(heroes.filter(h => heroCounteredByIds.includes(h.id)));

            // Mostrar counters por rol
            for (const rol in countersByRol) {
                if (countersByRol[rol].length > 0) {
                    const divRol = crearDivRol(rol, 'alerta-peligro');
                    countersByRol[rol].forEach(counter => {
                        const imgCounter = document.createElement('img');
                        imgCounter.classList.add('imagen-pequena');
                        imgCounter.src = counter.img_path;
                        imgCounter.alt = `Imagen de ${counter.nombre}`;
                        divRol.appendChild(imgCounter);
                    });
                    columnaCounters.appendChild(divRol);
                }
            }

            // Mostrar countereas por rol
            for (const rol in countereasByRol) {
                if (countereasByRol[rol].length > 0) {
                    const divRol = crearDivRol(rol, 'alerta-primario');
                    countereasByRol[rol].forEach(counterea => {
                        const imgCounterea = document.createElement('img');
                        imgCounterea.classList.add('imagen-pequena');
                        imgCounterea.src = counterea.img_path;
                        imgCounterea.alt = `Imagen de ${counterea.nombre}`;
                        divRol.appendChild(imgCounterea);
                    });
                    columnaCountereas.appendChild(divRol);
                }
            }
        }

        // Función auxiliar para agrupar héroes por rol
        function agruparPorRol(heroes) {
            const grupos = {};
            heroes.forEach(hero => {
                if (!grupos[hero.rol]) {
                    grupos[hero.rol] = [];
                }
                grupos[hero.rol].push(hero);
            });
            return grupos;
        }

        // Función auxiliar para crear un div de rol con imagen y nombre
        function crearDivRol(rol, claseAlerta) {
            const divRol = document.createElement('div');
            divRol.classList.add(claseAlerta, 'counters');

            const nombreRol = document.createElement('div');
            nombreRol.classList.add('nombre-rol');

            let imgRol;
            if (rol === 'tank') {
                imgRol = crearImagenRol('https://images.blz-contentstack.com/v3/assets/blt9c12f249ac15c7ec/bltcb94e9203be4088a/dark_circle_tank.svg', 'TANK');
            } else if (rol === 'dps') {
                imgRol = crearImagenRol('https://images.blz-contentstack.com/v3/assets/blt9c12f249ac15c7ec/blt052e8b02aef879b0/dark_circle_damage.svg', 'DPS');
            } else if (rol === 'supp') {
                imgRol = crearImagenRol('https://images.blz-contentstack.com/v3/assets/blt9c12f249ac15c7ec/blt8cf279e9b3126ef8/dark_circle_support.svg', 'SUPPORT');
            } else {
                imgRol = document.createElement('span');
                imgRol.textContent = '*';
            }
            imgRol.classList.add('m-0', 'imagen-contador');
            nombreRol.appendChild(imgRol);

            const spanNombre = document.createElement('span');
            spanNombre.classList.add('ms-2');
            spanNombre.textContent = rol.toUpperCase();
            nombreRol.appendChild(spanNombre);

            divRol.appendChild(nombreRol);
            return divRol;
        }
    });

// Funciones para abrir y cerrar el modal (copiadas de tu código Livewire)
function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);
    document.querySelector('#' + idModal + ' .boton-cerrar').setAttribute('aria-hidden', 'false');
    document.body.classList.add('desbordamiento-oculto');
}

function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    modal.classList.add('fade-out');
    document.querySelector('#' + idModal + ' .boton-cerrar').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('desbordamiento-oculto');

    setTimeout(() => {
        modal.classList.remove('fade-out');
        modal.style.display = 'none';
    }, 300);
}