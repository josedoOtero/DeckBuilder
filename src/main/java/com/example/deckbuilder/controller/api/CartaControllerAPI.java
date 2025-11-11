package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.domain.Carta;
import com.example.deckbuilder.service.CartaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/CartaAPI")
public class CartaControllerAPI {

    private final CartaService cartaService;

    public CartaControllerAPI(CartaService cartaService) {
        this.cartaService = cartaService;
    }

    //* CRUD *//
    @GetMapping({"", "/"})
    public List<Carta> all() {
        return cartaService.findAll();
    }

    @PostMapping({"", "/"})
    public Carta newCarta(@RequestBody Carta carta) {
        return this.cartaService.save(carta);
    }

    // Buscar por ID autoincremental
    @GetMapping("/{id}")
    public Carta one(@PathVariable Long id) {
        return this.cartaService.findById(id);
    }

    // Reemplazar carta por idKonami
    @PutMapping("/{idKonami}")
    public Carta replaceCarta(@PathVariable Integer idKonami, @RequestBody Carta carta) {
        return this.cartaService.replace(idKonami, carta);
    }

    // Eliminar carta por idKonami
    @ResponseBody
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{idKonami}")
    public void deleteCarta(@PathVariable Integer idKonami) {
        this.cartaService.delete(idKonami);
    }
}

