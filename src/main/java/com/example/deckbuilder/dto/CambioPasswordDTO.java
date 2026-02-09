package com.example.deckbuilder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CambioPasswordDTO {

    @NotBlank(message = "Current password is required")
    private String actual;

    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,}$",
            message = "Password must have at least 8 characters, one letter and one number"
    )
    private String nueva;

    @NotBlank(message = "Please repeat the password")
    private String repetir;
}


