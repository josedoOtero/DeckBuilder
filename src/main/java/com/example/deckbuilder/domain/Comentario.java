package com.example.deckbuilder.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comentario", uniqueConstraints = @UniqueConstraint(columnNames = {"mazo_id", "usuario_id"}))
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mazo_id")
    @JsonIgnoreProperties({"mainDeck", "extraDeck", "sideDeck", "vistas", "imagenCartaDestacada"})
    private Mazo mazo;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonIgnoreProperties({"mazos", "password", "mazosFavoritos", "cartasFavoritas"})
    private Usuario usuario;

    @NotBlank
    @Column(length = 1000)
    private String mensaje;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer valoracion;

    // Fecha y hora en que se creó el comentario. Se asigna en el servicio al crear.
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "creado_en")
    private LocalDateTime creadoEn;

}
