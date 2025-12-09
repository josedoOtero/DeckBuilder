package com.example.deckbuilder.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Size(min = 3, message = "El nombre de usuario debe tener al menos 3 caracteres")
    @Column(unique = true)
    @EqualsAndHashCode.Include
    private String nombre;

    @NotBlank
    private String password;

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "El email no tiene un formato válido")
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

    @Size(max = 300, message = "La descripción no puede tener más de 300 caracteres")
    private String descripcion;

}