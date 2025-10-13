package com.example.deckbuilder.service.partesMazo;

import com.example.deckbuilder.domain.partesMazo.MainDeck;
import com.example.deckbuilder.repository.partesMazo.MainDeckRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public MainDeck replace(Long id, MainDeck nuevoDeck) {
        return mainDeckRepository.findById(id)
                .map(deckExistente -> {
                    deckExistente.setCartas(nuevoDeck.getCartas());
                    return mainDeckRepository.save(deckExistente);
                })
                .orElseGet(() -> {
                    nuevoDeck.setId(id);
                    return mainDeckRepository.save(nuevoDeck);
                });
    }


    @Transactional
    public MainDeck delete(Long id) {
        MainDeck mainDeck = mainDeckRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("MainDeck no encontrado con id: " + id));

        mainDeckRepository.delete(mainDeck);
        return mainDeck;
    }

}
