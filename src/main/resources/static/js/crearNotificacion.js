document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-notificacion");
    if (form) {
        form.addEventListener("submit", crearNotificacion);
    }
});

function crearNotificacion(e) {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!titulo || !categoria || !mensaje) {
        mostrarAlerta("Todos los campos son obligatorios.", "warning");
        return;
    }

    const ahora = new Date();
    const creadoEn = ahora.toISOString().slice(0, 19); // ⚡ Formato compatible con LocalDateTime

    const notificacion = { titulo, categoria, mensaje, creadoEn };

    const API_BASE = window.location.origin;

    fetch(`${API_BASE}/NotificacionAPI/notificaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificacion),
        credentials: "include"
    })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Error desconocido al crear la notificación");
            }
            return res.json();
        })
        .then(data => {
            mostrarAlerta("Notificación creada correctamente ✔", "success");
            document.getElementById("form-notificacion").reset();
            if (typeof cargarNotificacionesMensajes === "function") cargarNotificacionesMensajes();
        })
        .catch(err => {
            mostrarAlerta("Error al crear la notificación: " + err.message, "danger");
            console.error(err);
        });
}

function mostrarAlerta(texto, tipo) {
    const alerta = document.getElementById("alerta");
    if (!alerta) return;
    alerta.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}