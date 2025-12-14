package com.example.pokemonauth.trainer;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/trainer")
public class TrainerController {
    @GetMapping("/me")
    public Object me(Authentication auth) {
        return new MeRes(auth.getName()); // this is userId string from JWT filter
    }
    public record MeRes(String userId) {}
}
