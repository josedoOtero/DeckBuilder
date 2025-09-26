package com.example.deckbuilder.service.partesMazo;

import com.example.deckbuilder.domain.partesMazo.SideDeck;
import com.example.deckbuilder.repository.partesMazo.SideDeckRepository;
import org.springframework.stereotype.Service;

@Service

public class SideDeckService {
    SideDeckRepository sideDeckRepository;

    SideDeckService(SideDeckRepository sideDeckRepository) {
        this.sideDeckRepository = sideDeckRepository;
    }
}
