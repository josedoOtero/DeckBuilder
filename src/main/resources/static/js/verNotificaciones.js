document.addEventListener("DOMContentLoaded", () => {
    const filtroTipo = document.getElementById("filtro-tipo");
    if (filtroTipo) {
        filtroTipo.addEventListener("change", cargarNotificacionesMensajes);
    }

    cargarNotificacionesMensajes();
});

function cargarNotificacionesMensajes() {
    const filtro = document.getElementById("filtro-tipo");
    const tipo = filtro ? filtro.value : "todo";

    // Obtener ID del usuario logueado desde el div oculto
    const usuarioDiv = document.getElementById("usuario-logueado");
    const usuarioId = usuarioDiv?.getAttribute("data-usuario-id");
    if (!usuarioId) {
        console.error("No se pudo obtener el ID del usuario logueado.");
        return;
    }

    fetch(`${window.location.origin}/NotificacionAPI/todos/${usuarioId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener las notificaciones");
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) data = [];

            let filtrados = data;

            if (tipo === "mensajes") {
                filtrados = data.filter(item => item.tipo === "mensaje");
            } else if (tipo === "notificaciones") {
                filtrados = data.filter(item => item.tipo === "notificacion");
            }

            mostrarNotificaciones(filtrados);
        })
        .catch(error => {
            console.error("Error cargando notificaciones:", error);
            const cont = document.getElementById("cont-notificaciones");
            if (cont) {
                cont.innerHTML = `
                    <div class="text-center text-danger">
                        No se pudieron cargar las notificaciones.
                    </div>
                `;
            }
        });
}

function mostrarNotificaciones(lista) {
    const cont = document.getElementById("cont-notificaciones");
    if (!cont) return;

    cont.innerHTML = "";

    if (!lista || lista.length === 0) {
        cont.innerHTML = `
            <div class="text-center text-muted">
                No hay datos disponibles.
            </div>
        `;
        return;
    }

    lista.sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));

    lista.forEach(item => {
        const card = document.createElement("div");
        card.className = "card notificacion-card shadow-sm mb-2";

        const mensaje = item.mensaje || "";
        const mensajeCorto = mensaje.length > 100 ? mensaje.slice(0, 100) + "..." : mensaje;
        const tieneMas = mensaje.length > 100;

        card.innerHTML = `
            <div class="card-body">
                <span class="badge bg-primary categoria">${item.categoria || "Sin categoría"}</span>
                <h5 class="card-title mt-2">${item.titulo || "Sin título"}</h5>
                <p class="card-text">
                    <span class="mensaje-corto">${mensajeCorto}</span>
                    ${
            tieneMas
                ? `<span class="mensaje-completo" style="display:none">${mensaje.slice(100)}</span>
                               <button class="btn-ver-mas btn btn-link p-0">Ver más</button>`
                : ""
        }
                </p>
            </div>
            <div class="card-footer bg-white border-0 text-end">
                <span class="fecha">${formatearFecha(item.creadoEn)}</span>
            </div>
        `;

        cont.appendChild(card);
    });

    document.querySelectorAll(".btn-ver-mas").forEach(btn => {
        btn.addEventListener("click", function () {
            const mensajeCompleto = this.previousElementSibling;
            const mensajeCorto = mensajeCompleto.previousElementSibling;

            if (mensajeCompleto.style.display === "none") {
                mensajeCompleto.style.display = "inline";
                mensajeCorto.style.display = "none";
                this.textContent = "Ver menos";
            } else {
                mensajeCompleto.style.display = "none";
                mensajeCorto.style.display = "inline";
                this.textContent = "Ver más";
            }
        });
    });
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return "";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}