document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-mensaje");
    if (form) {
        form.addEventListener("submit", crearMensaje);
    }
});

async function crearMensaje(e) {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const mensajeTexto = document.getElementById("mensaje").value.trim();
    const nombreUsuario = document.getElementById("nombre-usuario").value.trim();

    if (!titulo || !categoria || !mensajeTexto || !nombreUsuario) {
        mostrarAlerta("Todos los campos son obligatorios.", "warning");
        return;
    }

    try {
        // 1️⃣ Obtener ID del usuario destino
        const resUsuario = await fetch(
            `${window.location.origin}/UsuarioAPI/por-nombre/${encodeURIComponent(nombreUsuario)}`,
            { credentials: "include" }
        );

        if (!resUsuario.ok) {
            if (resUsuario.status === 404) {
                throw new Error(`El usuario "${nombreUsuario}" no existe`);
            } else {
                const text = await resUsuario.text();
                throw new Error(text || "Error al obtener el usuario");
            }
        }

        const usuarioId = await resUsuario.json();

        // 2️⃣ Crear mensaje
        const creadoEn = new Date().toISOString().slice(0, 19);

        const mensaje = {
            titulo,
            categoria,
            mensaje: mensajeTexto,
            creadoEn,
            usuario: { id: usuarioId }
        };

        const resMensaje = await fetch(
            `${window.location.origin}/NotificacionAPI/mensajes`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mensaje),
                credentials: "include"
            }
        );

        if (!resMensaje.ok) {
            const text = await resMensaje.text();
            throw new Error(text || "Error al crear el mensaje");
        }

        mostrarAlerta("Mensaje enviado correctamente ✔", "success");
        document.getElementById("form-mensaje").reset();

    } catch (err) {
        console.error(err);
        mostrarAlerta(err.message, "danger");
    }
}

function mostrarAlerta(texto, tipo) {
    const alerta = document.getElementById("alerta");
    if (!alerta) return;

    alerta.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}