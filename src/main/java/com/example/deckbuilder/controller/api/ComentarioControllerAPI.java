package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.domain.Comentario;
import com.example.deckbuilder.service.ComentarioService;
import com.example.deckbuilder.utility.UsuarioDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/ComentarioAPI")
public class ComentarioControllerAPI {

    private final ComentarioService comentarioService;

    public ComentarioControllerAPI(ComentarioService comentarioService) {
        this.comentarioService = comentarioService;
    }

    @GetMapping({"", "/"})
    public List<Comentario> all() {
        return comentarioService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> one(@PathVariable Long id) {
        Comentario comentario = comentarioService.findById(id);
        if (comentario == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comentario no encontrado");
        return ResponseEntity.ok(comentario);
    }

    @PostMapping({"", "/"})
    public ResponseEntity<?> createComentario(
            @RequestParam(required = false) Long idMazo,
            @RequestParam(required = false) Long idUsuario,
            @RequestBody Comentario comentario,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails
    ) {
        try {
            if (idMazo == null && comentario.getMazo() != null) idMazo = comentario.getMazo().getId();

            if (idUsuario == null) {
                if (usuarioDetails != null) {
                    idUsuario = usuarioDetails.getUsuario().getId();
                } else if (comentario.getUsuario() != null) {
                    idUsuario = comentario.getUsuario().getId();
                }
            }

            if (idMazo == null || idUsuario == null) {
                return ResponseEntity.badRequest().body("Faltan idMazo o idUsuario");
            }

            Comentario creado = comentarioService.crearComentario(idMazo, idUsuario, comentario);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComentario(@PathVariable Long id, @RequestBody Comentario comentario) {
        try {
            Comentario actualizado = comentarioService.editarComentario(id, comentario);
            return ResponseEntity.ok(actualizado);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteComentario(@PathVariable Long id) {
        comentarioService.borrarComentario(id);
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Comentario> comentariosPorUsuario(@PathVariable Long idUsuario) {
        return comentarioService.listarPorUsuario(idUsuario);
    }

    @GetMapping("/mazo/{idMazo}")
    public List<Comentario> comentariosPorMazo(@PathVariable Long idMazo) {
        return comentarioService.listarPorMazo(idMazo);
    }

}
