// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

document.addEventListener("DOMContentLoaded", () => {

    const listaCartas = document.querySelector("#lista_cartas");
    const filtro = document.querySelector("#filtro_cartas");
    const imgPerfil = document.querySelector("#fotoPerfil");
    const usuarioId = imgPerfil.getAttribute("data-usuario-id");

    if (!usuarioId) {
        console.error("User ID not found.");
        return;
    }

    document.getElementById('btnToggleRol').addEventListener('click', async function () {
        try {
            const currentRole = this.textContent.includes('ADMIN') ? 'ADMIN' : 'USER';
            const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';

            const response = await fetch(`/UsuarioAPI/cambiarRol/${usuarioId}`, {
                method: 'PUT'
            });

            if (response.ok) {
                this.textContent = `Role: ${newRole}`;
                alert(`Role changed to ${newRole}`);
            } else {
                alert("Error changing role");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while changing the role.");
        }
    });

    const formCambiarPassword = document.getElementById("formCambiarPassword");

    formCambiarPassword.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nueva = document.getElementById("passwordNueva").value;
        const repetida = document.getElementById("passwordRepetida").value;

        if (nueva.length < 6) {
            alert("Password must have at least 6 characters");
            return;
        }

        if (nueva !== repetida) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`/UsuarioAPI/cambiarPassword/${usuarioId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password: nueva
                })
            });

            if (response.ok) {
                alert("Password updated successfully");
                formCambiarPassword.reset();
                bootstrap.Modal.getInstance(
                    document.getElementById("modalPassword")
                ).hide();
            } else {
                const error = await response.text();
                alert("Error changing password: " + error);
            }
        } catch (error) {
            console.error(error);
            alert("Error changing password");
        }
    });

    filtro.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = new FormData(filtro).get("q").trim();
        if (!nombre) {
            listaCartas.innerHTML = "<p class='text-muted'>Write a name.</p>";
            return;
        }

        const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(nombre)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                listaCartas.innerHTML = "<p class='text-muted'>No cards found.</p>";
                return;
            }
            const data = await response.json();
            mostrarCartas(data.data);
        } catch (e) {
            console.error(e);
            listaCartas.innerHTML = "<p class='text-danger'>Error loading cards.</p>";
        }
    });

    function mostrarCartas(cartas) {
        listaCartas.innerHTML = "";

        cartas.forEach(carta => {
            const col = document.createElement("div");
            col.classList.add("col");

            const imagen = carta.card_images[0].image_url_cropped;

            col.innerHTML = `
                <img src="${imagen}"
                     class="img-fluid img-thumbnail"
                     style="cursor:pointer"
                     onerror="this.src='/img/fotoPerfil.png'">
            `;

            col.querySelector("img").addEventListener("click", () => {
                seleccionarCarta(imagen);
            });

            listaCartas.appendChild(col);
        });
    }

    async function seleccionarCarta(urlImagen) {
        try {
            const response = await fetch(
                `/UsuarioAPI/cambiarImg/${usuarioId}?url=${encodeURIComponent(urlImagen)}`,
                { method: "PUT" }
            );

            if (response.ok) {
                imgPerfil.src = urlImagen;
                alert("Image updated successfully");
                bootstrap.Modal.getInstance(
                    document.getElementById("modalSeleccionarCarta")
                ).hide();
            } else {
                alert("Error updating image");
            }
        } catch (e) {
            console.error(e);
            alert("Error updating the image");
        }
    }

});