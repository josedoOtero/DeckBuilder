package com.example.deckbuilder.service.partesMazo;

import com.example.deckbuilder.repository.partesMazo.MainDeckRepository;
import org.springframework.stereotype.Service;

@Service

public class MainDeckService {
    MainDeckRepository mainDeckRepository;

    MainDeckService(MainDeckRepository mainDeckRepository) {
        this.mainDeckRepository = mainDeckRepository;
    }
}
