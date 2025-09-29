package com.example.deckbuilder.service.partesMazo;

import com.example.deckbuilder.domain.partesMazo.MainDeck;
import com.example.deckbuilder.repository.partesMazo.MainDeckRepository;
import org.springframework.stereotype.Service;

@Service

public class MainDeckService {
    MainDeckRepository mainDeckRepository;

    MainDeckService(MainDeckRepository mainDeckRepository) {
        this.mainDeckRepository = mainDeckRepository;
    }

    public MainDeck save(MainDeck mainDeck) {
        return mainDeckRepository.save(mainDeck);
    }

    public MainDeck findById(Long id) {
        return mainDeckRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        mainDeckRepository.deleteById(id);
    }
}
