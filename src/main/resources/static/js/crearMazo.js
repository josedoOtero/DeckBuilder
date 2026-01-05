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
document.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
    const filtros = document.querySelector("#filtros_cartas");
    const listaCartas = document.querySelector("#lista_cartas .row");
    const mainDeck = document.querySelector("#main_deck");
    const extraDeck = document.querySelector("#extra_deck");
    const sideDeck = document.querySelector("#side_deck");
    const btnFavoritos = document.querySelector("#btnFavoritos");
    const btnSave = document.querySelector("#btnSave");
    const btnDelete = document.querySelector("#btnDelete");
    const nombreMazo = document.querySelector("#nombreMazo");
    const cartaDestacada = document.querySelector("#cartaDestacada");
    const estadoSelect = document.querySelector("#estadoMazo");
    const currentUrl = window.location.pathname;
    const match = currentUrl.match(/\/constructorMazos\/(\d+)/i);
    const ID_MAZO = match ? match[1] : null;
    let cartasFiltradas = [];
    let zonaSeleccionada = "mainExtra";
    const mazo = { main: [], extra: [], side: [] };
    let paginaActual = 1;
    const cartasPorPagina = 180;
    let cartasMazoInfo = {};
    let _actualizandoInfoMazo = false;
    function cargarMazoExistente() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!ID_MAZO)
                return;
            try {
                const resp = yield fetch(`/MazoAPI/${ID_MAZO}`);
                if (!resp.ok)
                    throw new Error();
                const data = yield resp.json();
                mazo.main = ((_a = data.mainDeck) === null || _a === void 0 ? void 0 : _a.cartas) || [];
                mazo.extra = ((_b = data.extraDeck) === null || _b === void 0 ? void 0 : _b.cartas) || [];
                mazo.side = ((_c = data.sideDeck) === null || _c === void 0 ? void 0 : _c.cartas) || [];
                nombreMazo.value = data.nombre || "";
                estadoSelect.value = data.estado || "publico";
                cartaDestacada.value = data.imagenCartaDestacada || "/img/cartaDorso.jpg";
                document.getElementById("cartaDestacadaPreview").src = cartaDestacada.value;
                yield actualizarInfoMazo();
                mostrarMazo();
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    btnFavoritos.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            const response = yield fetch("/UsuarioAPI/cartasFavoritas", { method: "GET", credentials: "include" });
            if (!response.ok)
                throw new Error();
            const idsFavoritas = yield response.json();
            if (idsFavoritas.length === 0) {
                alert("No tienes cartas favoritas.");
                return;
            }
            const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${idsFavoritas.join(",")}`;
            const res = yield fetch(url);
            if (!res.ok)
                throw new Error();
            const data = yield res.json();
            cartasFiltradas = data.data;
            paginaActual = 1;
            mostrarCartasPaginadas();
        }
        catch (error) {
            alert("Error al cargar cartas favoritas");
        }
    }));
    // ... el resto del código ya copiado arriba ...
    cargarMazoExistente();
}));
