package com.example.deckbuilder.repository;

import com.example.deckbuilder.domain.Carta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface CartaRepository extends JpaRepository<Carta, Integer> {
    Carta findByNombre(String nombre);
}
