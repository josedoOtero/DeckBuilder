package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class UsuarioService {
    UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    MazoService mazoService;

    UsuarioService(UsuarioRepository usuarioRepository, MazoService mazoService, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.mazoService = mazoService;
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Set<Mazo> getAllMazos(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);

        if(usuario != null) {
            return usuario.getMazos();
        }
        return null;
    }

    public Set<Mazo> getAllMazosFavoritos(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);

        if(usuario != null) {
            return usuario.getMazosFavoritos();
        }
        return null;
    }

    public Usuario replace(Long id, Usuario nuevoUsuario) {
        return usuarioRepository.findById(id)
                .map(usuarioExistente -> {
                    if (nuevoUsuario.getNombre() != null) {
                        usuarioExistente.setNombre(nuevoUsuario.getNombre());
                    }
                    if (nuevoUsuario.getPassword() != null && !nuevoUsuario.getPassword().isBlank()) {
                        usuarioExistente.setPassword(passwordEncoder.encode(nuevoUsuario.getPassword()));
                    }
                    if (nuevoUsuario.getEmail() != null) {
                        usuarioExistente.setEmail(nuevoUsuario.getEmail());
                    }
                    if (nuevoUsuario.getMazos() != null) {
                        usuarioExistente.setMazos(nuevoUsuario.getMazos());
                    }
                    if (nuevoUsuario.getMazosFavoritos() != null) {
                        usuarioExistente.setMazosFavoritos(nuevoUsuario.getMazosFavoritos());
                    }
                    if (nuevoUsuario.getImagenUsuario() != null) {
                        usuarioExistente.setImagenUsuario(nuevoUsuario.getImagenUsuario());
                    }
                    if (nuevoUsuario.getRol() != null) {
                        usuarioExistente.setRol(nuevoUsuario.getRol());
                    }
                    return usuarioRepository.save(usuarioExistente);
                })
                .orElseGet(() -> {
                    nuevoUsuario.setId(id);
                    if (nuevoUsuario.getPassword() != null && !nuevoUsuario.getPassword().isBlank()) {
                        nuevoUsuario.setPassword(passwordEncoder.encode(nuevoUsuario.getPassword()));
                    }
                    return usuarioRepository.save(nuevoUsuario);
                });
    }


    @Transactional
    public Usuario delete(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));

        usuarioRepository.delete(usuario);
        return usuario;
    }

    public Usuario findByNombre(String nombre) {
        return usuarioRepository.findByNombre(nombre).orElse(null);
    }

    public boolean exitByNombre(String nombre) {
        return usuarioRepository.findByNombre(nombre).isPresent();
    }

    public Usuario registrarUsuario(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol("ROLE_USER");
        return usuarioRepository.save(usuario);
    }

    public List<Mazo> obtenerMazosPublicos(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + idUsuario));

        return usuario.getMazos()
                .stream()
                .filter(m -> m.getEstado() != null && m.getEstado().equalsIgnoreCase("publico"))
                .toList();
    }

    @Transactional
    public void addMazoFavoritos(Long idUsuario, Long idMazo) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + idUsuario));

        Mazo mazo = mazoService.findById(idMazo);
        if (mazo == null) {
            throw new EntityNotFoundException("Mazo no encontrado con id: " + idMazo);
        }

        if (!usuario.getMazosFavoritos().contains(mazo)) {
            usuario.getMazosFavoritos().add(mazo);
            usuarioRepository.save(usuario);
        }
    }

    @Transactional
    public void removeMazoFavoritos(Long idUsuario, Long idMazo) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + idUsuario));

        Mazo mazo = mazoService.findById(idMazo);
        if (mazo == null) throw new EntityNotFoundException("Mazo no encontrado con id: " + idMazo);

        usuario.getMazosFavoritos().remove(mazo);
        usuarioRepository.save(usuario);
    }

    public boolean isFavorito(Long idUsuario, Long idMazo) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + idUsuario));
        return usuario.getMazosFavoritos().stream().anyMatch(m -> m.getId().equals(idMazo));
    }


    public List<Usuario> buscarPorNombreOemail(String nombre, String email) {
        if ((nombre == null || nombre.isBlank()) && (email == null || email.isBlank())) {
            return this.findAll();
        }
        return usuarioRepository.findByNombreContainingIgnoreCaseAndEmailContainingIgnoreCase(
                nombre == null ? "" : nombre,
                email == null ? "" : email
        );
    }

    public boolean existePorNombre(String nombre) {
        return usuarioRepository.existsByNombre(nombre);
    }

    public boolean existePorEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    public void cambiarPassword(String nombreUsuario, String nuevaPassword) {
        Usuario usuario = findByNombre(nombreUsuario);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        save(usuario);
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean passwordMatches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
