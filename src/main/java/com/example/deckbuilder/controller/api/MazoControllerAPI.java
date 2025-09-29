package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.service.MazoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/MazoAPI")

public class MazoControllerAPI {
    MazoService mazoService;

    MazoControllerAPI(MazoService mazoService) {
        this.mazoService = mazoService;
    }
}
