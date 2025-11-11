package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.service.MazoService;
import com.example.deckbuilder.service.UsuarioService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/MazoAPI")

public class MazoControllerAPI {
    private final MazoService mazoService;
    private final UsuarioService usuarioService;

    MazoControllerAPI(MazoService mazoService, UsuarioService usuarioService) {
        this.mazoService = mazoService;
        this.usuarioService = usuarioService;
    }

    @GetMapping(value = {"","/"})
    public List<Mazo> all(){
        return mazoService.findAll();
    }

    @PostMapping({"","/"})
    public Mazo newMazo(@RequestBody Mazo mazo) {
        return mazoService.save(mazo);
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

    @GetMapping("/usuario")
    public List<Mazo> obtenerMazosUsuario(Authentication auth) {
        String nombreUsuario = auth.getName();
        Usuario usuario = usuarioService.findByNombre(nombreUsuario);
        return mazoService.findByUsuario(usuario);
    }
}
