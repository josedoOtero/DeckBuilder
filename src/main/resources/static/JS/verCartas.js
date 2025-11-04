document.addEventListener("DOMContentLoaded", () => {
    console.log("Script verCartas cargado");

    const filtros = document.querySelector("#filtros_cartas");
    const listaCartas = document.querySelector("#lista_cartas .row");
    const detalles = document.querySelector("#detalles_carta");
    let cartasFiltradas = [];

    filtros.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(filtros);
        const params = new URLSearchParams();

        let atkMin = null, atkMax = null, defMin = null, defMax = null;

        for (const [key, value] of formData.entries()) {
            if (!value.trim()) continue;
            const val = value.trim();

            switch (key) {
                case "q":
                    params.append("fname", val);
                    break;
                case "tipo":
                    params.append("type", val);
                    break;
                case "tipoCarta":
                    params.append("race", val);
                    break;
                case "arquetipo":
                    params.append("archetype", val);
                    break;
                case "atributo":
                    params.append("attribute", val);
                    break;
                case "nivel":
                    params.append("level", val);
                    break;
                case "familia":
                    params.append("race", val);
                    break;
                case "atkMin":
                    atkMin = parseInt(val);
                    break;
                case "atkMax":
                    atkMax = parseInt(val);
                    break;
                case "defMin":
                    defMin = parseInt(val);
                    break;
                case "defMax":
                    defMax = parseInt(val);
                    break;
                default:
                    params.append(key, val);
            }
        }

        const queryString = params.toString();
        const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?${encodeURI(queryString)}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 400) {
                    listaCartas.innerHTML = `
                        <p class="text-center text-muted mt-3">No cards found with those filters.</p>
                    `;
                    return;
                } else {
                    throw new Error("Error fetching cards");
                }
            }

            const data = await response.json();
            let cartas = data.data;

            // Aplicar filtros de ataque/defensa localmente
            cartas = cartas.filter(c => {
                if (atkMin !== null && c.atk < atkMin) return false;
                if (atkMax !== null && c.atk > atkMax) return false;
                if (defMin !== null && c.def < defMin) return false;
                if (defMax !== null && c.def > defMax) return false;
                return true;
            });

            if (cartas.length === 0) {
                listaCartas.innerHTML = `
                    <p class="text-center text-muted mt-3">No cards found.</p>
                `;
                return;
            }

            cartasFiltradas = cartas;
            mostrarCartas(cartas, listaCartas);

        } catch (error) {
            console.error("Error loading cards:", error);
            listaCartas.innerHTML = `
                <p class="text-center text-muted mt-3">Error loading cards. Please try again.</p>
            `;
        }
    });
});