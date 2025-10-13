package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.service.UsuarioService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/UsuarioAPI")

public class UsuarioControllerAPI {
    UsuarioService usuarioService;

    UsuarioControllerAPI(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    //*FUNCIONES DEL CRUD*//

    @GetMapping(value = {"","/"})
    public List<Usuario> all(){
        return usuarioService.findAll();
    }

    @PostMapping({"","/"})
    public Usuario newUsuario(@RequestBody Usuario usuario) {
        return this.usuarioService.save(usuario);
    }

    @GetMapping("/{id}")
    public Usuario one(@PathVariable("id") Long id) {
        return this.usuarioService.findById(id);
    }

    @PutMapping("/{id}")
    public Usuario replaceImagenUsuario(@PathVariable("id") Long id, @RequestBody Usuario usuario) {
        return this.usuarioService.replace(id, usuario);
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public Usuario deleteCarta(@PathVariable("id") Long id) {
        return this.usuarioService.delete(id);
    }
}
