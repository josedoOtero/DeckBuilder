package com.example.deckbuilder.controller.api;

/*ESTE CONTROLADOR ME SIRVE PARA REALIZAR LAS CONSULTAS CON LA API
* SE HACE EN EL LADO DEL BACKEND POR SEGURIDAD*/

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@Slf4j
@RestController
@RequestMapping("/consulta")

public class YGOProDeckControllerAPI {

    private final RestTemplate restTemplate;

    @Autowired
    public YGOProDeckControllerAPI(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/carta/{idKonami}")
    public ResponseEntity<String> obtenerCartaPorId(@PathVariable("idKonami") String idKonami) {
        try {
            String url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?id=" + idKonami;
            String respuesta = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al consultar la carta.");
        }
    }

    @GetMapping("/cartas")
    public ResponseEntity<String> obtenerCartasPaginadas(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "90") int numCartas) {
        try {
            String url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?num=" + numCartas + "&offset=" + pagina;
            String respuesta = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al consultar las cartas.");
        }
    }

}
