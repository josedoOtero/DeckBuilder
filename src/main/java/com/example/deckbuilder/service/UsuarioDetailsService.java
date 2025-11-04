package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByNombre(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        String role = usuario.getRol();
        if (role.startsWith("ROLE_")) {
            role = role.substring(5);
        }

        return User.builder()
                .username(usuario.getNombre())
                .password(usuario.getPassword())
                .roles(role)
                .build();
    }
}

