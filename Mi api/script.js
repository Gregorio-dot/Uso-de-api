async function obtenerRecetas() {
    const buscar = document.getElementById('buscar').value.trim().toLowerCase();
    const categoria = document.getElementById('categoria').value;
    const region = document.getElementById('region').value;
    let recetas = [];
    try {
        if (categoria) {
            const respuestaCategoria = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`);
            const datosCategoria = await respuestaCategoria.json();
            recetas = datosCategoria.meals || [];
        }
        if (region) {
            const respuestaRegion = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${region}`);
            const datosRegion = await respuestaRegion.json();
            const recetasRegion = datosRegion.meals || [];
            if (recetas.length > 0) {
                recetas = recetas.filter(receta => recetasRegion.some(r => r.idMeal === receta.idMeal));
            } else {
                recetas = recetasRegion;
            }
        }
        if (buscar) {
            if (recetas.length > 0) {
                recetas = recetas.filter(receta => receta.strMeal.toLowerCase().includes(buscar));
            } else {
                const respuestaBuscar = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${buscar}`);
                const datosBuscar = await respuestaBuscar.json();
                recetas = datosBuscar.meals || [];
            }
        }
        if (recetas.length === 0 && !categoria && !region && !buscar) {
            recetas = await obtenerPlatosAleatorios(20);
        }
        mostrarRecetas(recetas);
    } catch (error) {
        console.error('Error al obtener las recetas:', error);
        document.getElementById('recetas-contenedor').innerHTML = '<p>Error al cargar recetas.</p>';
    }
}
async function obtenerPlatosAleatorios(cantidad) {
    const recetasAleatorias = [];
    for (let i = 0; i < cantidad; i++) {
        try {
            const respuesta = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const datos = await respuesta.json();
            if (datos.meals) recetasAleatorias.push(datos.meals[0]);
        } catch (error) {
            console.error('Error al obtener recetas aleatorias:', error);
        }
    }
    return recetasAleatorias;
}
function mostrarRecetas(recetas) {
    const contenedor = document.getElementById('recetas-contenedor');
    contenedor.innerHTML = '';

    if (recetas.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron recetas.</p>';
        return;
    }
    recetas.forEach(receta => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-receta');
        tarjeta.innerHTML = `
            <img src="${receta.strMealThumb}" alt="${receta.strMeal}">
            <div class="info-receta">
                <h3>${receta.strMeal}</h3>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}
document.addEventListener('DOMContentLoaded', obtenerRecetas);