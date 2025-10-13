package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.domain.ImagenUsuario;
import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.service.MazoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/MazoAPI")

public class MazoControllerAPI {
    MazoService mazoService;

    MazoControllerAPI(MazoService mazoService) {
        this.mazoService = mazoService;
    }

    //*FUNCIONES DEL CRUD*//

    @GetMapping(value = {"","/"})
    public List<Mazo> all(){
        return mazoService.findAll();
    }

    @PostMapping({"","/"})
    public Mazo newMazo(@RequestBody Mazo mazo) {
        return this.mazoService.save(mazo);
    }

    @GetMapping("/{id}")
    public Mazo one(@PathVariable("id") Long id) {
        return this.mazoService.findById(id);
    }

    @PutMapping("/{id}")
    public Mazo replaceImagenUsuario(@PathVariable("id") Long id, @RequestBody Mazo mazo) {
        return this.mazoService.replace(id, mazo);
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public Mazo deleteCarta(@PathVariable("id") Long id) {
        return this.mazoService.delete(id);
    }
}
