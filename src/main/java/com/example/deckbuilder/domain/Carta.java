package com.example.deckbuilder.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "carta")
@Data
@AllArgsConstructor
@NoArgsConstructor

/*Esta se podria sustituir actualmente por el idKonami y punto
* sin necesidad de tener una clase Carta. Se mantiene porque en un
* inicio contendria la cantidad de cartas. Ademas de eso en caso
* de ampliarse y Guardar las cartas en la BD sin API*/

public class Carta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer idKonami;
}