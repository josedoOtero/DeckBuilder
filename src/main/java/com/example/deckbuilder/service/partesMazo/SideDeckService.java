package com.example.deckbuilder.service.partesMazo;

import com.example.deckbuilder.domain.partesMazo.SideDeck;
import com.example.deckbuilder.repository.partesMazo.SideDeckRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service

public class SideDeckService {
    SideDeckRepository sideDeckRepository;

    SideDeckService(SideDeckRepository sideDeckRepository) {
        this.sideDeckRepository = sideDeckRepository;
    }

    public SideDeck save(SideDeck sideDeck) {
        return sideDeckRepository.save(sideDeck);
    }

    public SideDeck findById(Long id) {
        return sideDeckRepository.findById(id).orElse(null);
    }

    public SideDeck replace(Long id, SideDeck nuevoDeck) {
        return sideDeckRepository.findById(id)
                .map(deckExistente -> {
                    deckExistente.setCartas(nuevoDeck.getCartas());
                    return sideDeckRepository.save(deckExistente);
                })
                .orElseGet(() -> {
                    nuevoDeck.setId(id);
                    return sideDeckRepository.save(nuevoDeck);
                });
    }


    @Transactional
    public SideDeck delete(Long id) {
        SideDeck sideDeck = sideDeckRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("SideDeck no encontrado con id: " + id));

        sideDeckRepository.delete(sideDeck);
        return sideDeck;
    }

}
