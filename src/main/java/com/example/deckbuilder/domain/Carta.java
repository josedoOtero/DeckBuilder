package com.example.deckbuilder.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="carta")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Carta {

    @Id
    private Integer idKonami;
}

