// @ts-nocheck
// ...existing code...
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
        console.error("No se encontró el ID del usuario.");
        return;
    }
    filtro.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const nombre = new FormData(filtro).get("q").trim();
        if (!nombre) {
            listaCartas.innerHTML = "<p class='text-muted'>Escribe un nombre.</p>";
            return;
        }
        const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(nombre)}`;
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                listaCartas.innerHTML = "<p class='text-muted'>No se encontraron cartas.</p>";
                return;
            }
            const data = yield response.json();
            mostrarCartas(data.data);
        }
        catch (e) {
            console.error(e);
            listaCartas.innerHTML = "<p class='text-danger'>Error cargando cartas.</p>";
        }
    }));
    function mostrarCartas(cartas) {
        listaCartas.innerHTML = "";
        cartas.forEach(carta => {
            const col = document.createElement("div");
            col.classList.add("col");
            const imagenCropped = carta.card_images[0].image_url_cropped;
            col.innerHTML = `
                <img src="${imagenCropped}"
                     class="img-fluid img-thumbnail seleccionar-carta"
                     style="cursor:pointer;"
                     data-url="${imagenCropped}"
                     onerror="this.src='/img/fotoPerfil.png'">
            `;
            listaCartas.appendChild(col);
            col.querySelector("img").addEventListener("click", () => {
                seleccionarCarta(imagenCropped);
            });
        });
    }
    function seleccionarCarta(urlImagen) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`/UsuarioAPI/cambiarImg/${usuarioId}?url=${encodeURIComponent(urlImagen)}`, {
                    method: "PUT"
                });
                if (response.ok) {
                    imgPerfil.src = urlImagen;
                    alert("Imagen actualizada correctamente.");
                    bootstrap.Modal.getInstance(document.querySelector("#modalSeleccionarCarta")).hide();
                }
                else {
                    const errorText = yield response.text();
                    console.error("ERROR del servidor: ", errorText);
                    alert("Error: " + errorText);
                }
            }
            catch (e) {
                console.error(e);
                alert("Error al actualizar la imagen.");
            }
        });
    }
});
