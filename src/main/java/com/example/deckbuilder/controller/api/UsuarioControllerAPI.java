package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.service.UsuarioService;
import com.example.deckbuilder.utility.UsuarioDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
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
        if (userDetails == null) throw new RuntimeException("No autenticado");
        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
        usuarioService.addMazoFavoritos(usuario.getId(), idMazo);
    }

    @DeleteMapping("/favoritos/{idMazo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavorito(@PathVariable Long idMazo, @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        if (userDetails == null) throw new RuntimeException("No autenticado");
        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
        usuarioService.removeMazoFavoritos(usuario.getId(), idMazo);
    }

    @GetMapping("/favoritos/{idMazo}")
    public boolean isFavorito(@PathVariable Long idMazo, @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        if (userDetails == null) return false;
        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
        return usuarioService.isFavorito(usuario.getId(), idMazo);
    }

    @GetMapping("/favoritos")
    public Set<Mazo> obtenerFavoritos(@AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        if (userDetails == null) return new HashSet<>();
        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
        return usuario.getMazosFavoritos();
    }

    @GetMapping("/buscar")
    public List<Usuario> buscarUsuario(
            @RequestParam(value = "nombre", required = false) String nombre,
            @RequestParam(value = "email", required = false) String email) {

        if ((nombre == null || nombre.isBlank()) && (email == null || email.isBlank())) {
            return usuarioService.findAll();
        }

        return usuarioService.buscarPorNombreOemail(nombre, email);
    }

    @PutMapping("/cambiarImg/{id}")
    public Usuario cambiarImg(
            @PathVariable Long id,
            @RequestParam(value = "url") String url) {
        Usuario usuario = usuarioService.findById(id);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuario.setImagenUsuario(url);
        return usuarioService.save(usuario);
    }

    @GetMapping("/cartasFavoritas")
    public ResponseEntity<List<Integer>> getCartasFavoritas(@AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        Usuario usuario = usuarioDetails.getUsuario();
        Set<Integer> cartasFavoritas = usuario.getCartasFavoritas();
        if (cartasFavoritas == null) {
            cartasFavoritas = new HashSet<>();
        }
        List<Integer> ids = new ArrayList<>(cartasFavoritas);
        return ResponseEntity.ok(ids);
    }

    @PostMapping("/cartasFavoritas/{idKonami}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addCartaFavorita(
            @PathVariable Integer idKonami,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails
    ) {
        Usuario usuario = usuarioDetails.getUsuario();

        Set<Integer> favoritas = usuario.getCartasFavoritas();
        if (favoritas == null) {
            favoritas = new HashSet<>();
            usuario.setCartasFavoritas(favoritas);
        }

        favoritas.add(idKonami);
        usuarioService.save(usuario);
    }

    @DeleteMapping("/cartasFavoritas/{idKonami}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeCartaFavorita(
            @PathVariable Integer idKonami,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails
    ) {
        Usuario usuario = usuarioDetails.getUsuario();

        Set<Integer> favoritas = usuario.getCartasFavoritas();
        if (favoritas != null) {
            favoritas.remove(idKonami);
        }

        usuarioService.save(usuario);
    }

    @GetMapping("/UsuarioAPI/logueado")
    public ResponseEntity<?> getUsuarioLogueado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario no autenticado");
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof UsuarioDetails usuarioDetails) {

            return ResponseEntity.ok(usuarioDetails.getUsuario().getId());
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("No se pudo obtener ID del usuario");
    }
}
