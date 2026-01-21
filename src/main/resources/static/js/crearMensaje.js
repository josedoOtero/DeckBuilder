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
        mostrarAlerta("All fields are required.", "warning");
        return;
    }

    try {
        const resUsuario = await fetch(
            `${window.location.origin}/UsuarioAPI/por-nombre/${encodeURIComponent(nombreUsuario)}`,
            { credentials: "include" }
        );

        if (!resUsuario.ok) {
            if (resUsuario.status === 404) {
                throw new Error(`User "${nombreUsuario}" no exits`);
            } else {
                const text = await resUsuario.text();
                throw new Error(text || "Error retrieving user");
            }
        }

        const usuarioId = await resUsuario.json();

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
            throw new Error(text || "Error creating message");
        }

        mostrarAlerta("Message sent successfully", "success");
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