package com.example.deckbuilder.utility;

import com.example.deckbuilder.service.UsuarioDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UsuarioDetailsService usuarioDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Recursos públicos: login, registro, CSS, JS, imágenes
                        .requestMatchers("/", "/login/**", "/crearCuenta/**", "/css/**", "/js/**", "/img/**").permitAll()

                        // APIs públicas de Mazo y Usuario (solo GETs que devuelven info)
                        .requestMatchers("/MazoAPI/**").permitAll()
                        .requestMatchers("/UsuarioAPI/**").permitAll()

                        // Solo usuarios logueados pueden acceder a POST, PUT, DELETE en UsuarioAPI
                        .requestMatchers("/UsuarioAPI/**").hasAnyRole("USER", "ADMIN")

                        // Páginas públicas de mazos (visualizador)
                        .requestMatchers("/user/visualizadorMazos/**", "/user/verUser/**", "/user/mazos", "/user/cartas").permitAll()

                        // Solo usuarios logueados pueden acceder a otras páginas de /user/**
                        .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")

                        // Solo admins pueden acceder a /admin/**
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // Cualquier otra ruta requiere autenticación
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login/iniciarSesion")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/login/home", true)
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .permitAll()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendRedirect("/");
                        })
                );


        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http,
                                                       PasswordEncoder passwordEncoder) throws Exception {
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.userDetailsService(usuarioDetailsService)
                .passwordEncoder(passwordEncoder);
        return authBuilder.build();
    }
}