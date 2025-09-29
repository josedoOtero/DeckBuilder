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
    CartaService cartaService;

    CartaControllerAPI(CartaService cartaService) {
        this.cartaService = cartaService;
    }

    @GetMapping(value = {"","/"})
    public List<Carta> all(){
        return cartaService.findAll();
    }

    @PostMapping({"","/"})
    public Carta newCarta(@RequestBody Carta carta) {
        return this.cartaService.save(carta);
    }

    @GetMapping("/{id}")
    public Carta one(@PathVariable("id") Integer id) {
        return this.cartaService.findById(id);
    }

    @PutMapping("/{id}")
    public Carta replaceCarta(@PathVariable("id") Integer id, @RequestBody Carta carta) {
        return this.cartaService.replace(id, carta);
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public Carta deleteCarta(@PathVariable("id") Integer id) {
        return this.cartaService.delete(id);
    }
}
