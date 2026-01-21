package com.example.deckbuilder.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuario")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, message = "Username must have at least 3 characters")
    @Column(unique = true)
    @EqualsAndHashCode.Include
    private String nombre;

    @NotBlank(message = "Password cannot be empty")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,}$",
            message = "Password must have at least 8 characters, one letter and one number"
    )
    private String password;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email format is not valid")
    @Column(unique = true)
    private String email;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "usuario_id")
    @JsonIgnore
    private Set<Mazo> mazos = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "usuario_mazos_favoritos",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "mazo_id")
    )
    @JsonIgnore
    private Set<Mazo> mazosFavoritos = new HashSet<>();

    private Set<Integer> cartasFavoritas = new HashSet<>();

    private String imagenUsuario;

    private String rol;

    @Size(max = 300, message = "Description cannot be longer than 300 characters")
    private String descripcion;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Comentario> comentarios = new HashSet<>();

}