package com.example.deckbuilder.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensaje")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @NotBlank
    @Column(length = 70)
    private String titulo;

    @NotBlank
    @Column(length = 70)
    private String categoria;

    @NotBlank
    @Column(length = 1000)
    private String mensaje;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "creado_en")
    private LocalDateTime creadoEn;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}
