document.addEventListener("DOMContentLoaded", function () {
    const tablaBody = document.querySelector("#tabla-mazos-body");
    const btnBuscar = document.getElementById("btnBuscarMazos");
    const btnCrear = document.getElementById("btnCrearMazo");
    const inputNombreMazo = document.getElementById("buscarNombreMazo");
    const inputCreador = document.getElementById("buscarCreador");

    async function cargarMazos(nombreMazo = "", nombreCreador = "") {
        const url = `/MazoAPI/buscar?nombreMazo=${encodeURIComponent(nombreMazo)}&nombreCreador=${encodeURIComponent(nombreCreador)}`;
        try {
            const response = await fetch(url, { credentials: "same-origin" });
            if (!response.ok) throw new Error("Error al obtener mazos");
            const mazos = await response.json();
            renderMazos(mazos);
        } catch (error) {
            console.error(error);
            tablaBody.innerHTML = `<tr><td colspan="5" class="text-danger">No se pudo cargar los mazos</td></tr>`;
        }
    }

    function renderMazos(mazos) {
        tablaBody.innerHTML = "";
        if (!mazos || mazos.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="5">No hay mazos</td></tr>`;
            return;
        }

        mazos.forEach(mazo => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${mazo.id}</td>
                <td>${mazo.nombre || "Sin nombre"}</td>
                <td>${mazo.creador?.nombre || "Desconocido"}</td>
                <td>${mazo.estado || "Desconocido"}</td>
                <td>
                    <button class="btn btn-sm btn-warning btnEditar" data-id="${mazo.id}">Editar</button>
                    <button class="btn btn-sm btn-danger btnEliminar" data-id="${mazo.id}">Eliminar</button>
                    <button class="btn btn-sm btn-info btnVer" data-id="${mazo.id}">Ver Mazos</button>
                </td>
            `;

            tr.querySelector(".btnEliminar").addEventListener("click", async () => {
                if (confirm(`¿Seguro que quieres eliminar el mazo "${mazo.nombre}"?`)) {
                    try {
                        const res = await fetch(`/MazoAPI/${mazo.id}`, { method: "DELETE", credentials: "same-origin" });
                        if (!res.ok) throw new Error("Error al eliminar mazo");
                        cargarMazos(inputNombreMazo.value, inputCreador.value);
                    } catch (err) {
                        console.error(err);
                        alert("No se pudo eliminar el mazo");
                    }
                }
            });

            tr.querySelector(".btnEditar").addEventListener("click", () => {
                window.location.href = `/user/constructorMazos/${mazo.id}`;
            });

            tr.querySelector(".btnVer").addEventListener("click", () => {
                window.location.href = `/user/visualizadorMazos/${mazo.id}`;
            });

            tablaBody.appendChild(tr);
        });
    }

    btnBuscar.addEventListener("click", () => {
        cargarMazos(inputNombreMazo.value, inputCreador.value);
    });

    btnCrear.addEventListener("click", () => {
        window.location.href = "/user/constructorMazos";
    });

    cargarMazos();
});