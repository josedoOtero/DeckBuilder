package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.service.UsuarioService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/UsuarioAPI")
public class UsuarioControllerAPI {

    private final UsuarioService usuarioService;

    public UsuarioControllerAPI(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping({"", "/"})
    public List<Usuario> all() {
        return usuarioService.findAll();
    }

    @PostMapping({"", "/"})
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

    @GetMapping("/{id}/mazos/publicos")
    public List<Mazo> obtenerMazosPublicos(@PathVariable("id") Long id) {
        return usuarioService.obtenerMazosPublicos(id);
    }

    @PostMapping("/favoritos/{idMazo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addFavorito(@PathVariable Long idMazo, @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
        usuarioService.addMazoFavoritos(usuario.getId(), idMazo);
    }

    @DeleteMapping("/favoritos/{idMazo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavorito(@PathVariable Long idMazo, @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
        usuarioService.removeMazoFavoritos(usuario.getId(), idMazo);
    }

    @GetMapping("/favoritos/{idMazo}")
    public boolean isFavorito(@PathVariable Long idMazo, @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
        return usuarioService.isFavorito(usuario.getId(), idMazo);
    }

    @GetMapping("/favoritos")
    public Set<Mazo> obtenerFavoritos(@AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
        return usuario.getMazosFavoritos();
    }

}

