package com.example.deckbuilder.utility;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class hash {
    private static final PasswordEncoder ENCODER = new BCryptPasswordEncoder();

    private hash() {}

    /*Funcion para hacer un hash a un String que se le pasa*/
    public static String hashPassword(String password) {
        return ENCODER.encode(password);
    }

    /*Comprobacion de un hash coincide*/
    public static boolean matches(String password, String hash) {
        return ENCODER.matches(password, hash);
    }
}
