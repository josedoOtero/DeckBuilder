document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("filtro-tipo")
        ?.addEventListener("change", cargarNotificacionesMensajes);

    cargarNotificacionesMensajes();
});

function cargarNotificacionesMensajes() {
    const tipo = document.getElementById("filtro-tipo")?.value || "todo";
    const usuarioId = document
        .getElementById("usuario-logueado")
        ?.getAttribute("data-usuario-id");

    if (!usuarioId) {
        console.error("User ID not found");
        return;
    }

    fetch(`/NotificacionAPI/todos/${usuarioId}`)
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) data = [];

            if (tipo === "mensajes") {
                data = data.filter(i => i.tipo === "mensaje");
            } else if (tipo === "notificaciones") {
                data = data.filter(i => i.tipo === "notificacion");
            }

            mostrarNotificaciones(data);
        })
        .catch(() => {
            document.getElementById("cont-notificaciones").innerHTML =
                `<div class="text-center text-danger">
                    Notifications could not be loaded.
                 </div>`;
        });
}

function mostrarNotificaciones(lista) {
    const cont = document.getElementById("cont-notificaciones");
    cont.innerHTML = "";

    if (!lista || lista.length === 0) {
        cont.innerHTML =
            `<div class="text-center text-muted">No data available.</div>`;
        return;
    }

    lista.sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));

    lista.forEach(item => {
        const card = document.createElement("div");
        card.className = "card notificacion-card shadow-sm";

        card.innerHTML = `
            <div class="card-body">
                <span class="badge bg-primary categoria">
                    ${item.categoria || "Uncategorized"}
                </span>

                <h5 class="card-title mt-2">
                    ${item.titulo || "Untitled"}
                </h5>

                <p class="card-text">
                    ${item.mensaje || ""}
                </p>
            </div>

            <div class="card-footer bg-white border-0 text-end">
                <span class="fecha">
                    ${formatearFecha(item.creadoEn)}
                </span>
            </div>
        `;

        cont.appendChild(card);
    });
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return "";
    return new Date(fechaISO).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}