package com.example.deckbuilder.repository;

import com.example.deckbuilder.domain.Mazo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface MazoRepository extends JpaRepository<Mazo, Long> {
}
