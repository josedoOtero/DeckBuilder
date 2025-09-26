package com.example.deckbuilder.repository.partesMazo;

import com.example.deckbuilder.domain.partesMazo.ExtraDeck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface ExtraDeckRepository extends JpaRepository<ExtraDeck, Long> {

}
