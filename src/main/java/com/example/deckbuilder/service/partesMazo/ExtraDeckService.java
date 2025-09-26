package com.example.deckbuilder.service.partesMazo;

import com.example.deckbuilder.repository.partesMazo.ExtraDeckRepository;
import org.springframework.stereotype.Service;

@Service

public class ExtraDeckService {
    ExtraDeckRepository extraDeckRepository;

    ExtraDeckService(ExtraDeckRepository extraDeckRepository) {
        this.extraDeckRepository = extraDeckRepository;
    }
}
