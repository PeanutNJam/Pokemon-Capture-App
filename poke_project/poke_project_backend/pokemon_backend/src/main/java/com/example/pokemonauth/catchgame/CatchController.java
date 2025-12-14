package com.example.pokemonauth.catchgame;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/catch")
public class CatchController {

    private final CatchService catchService;

    public CatchController(CatchService catchService) {
        this.catchService = catchService;
    }

    @PostMapping("/start")
    public CatchService.StartRes start(Authentication auth) {
        UUID userId = UUID.fromString(auth.getName());
        return catchService.start(userId);
    }

    @PostMapping("/guess")
    public CatchService.GuessRes guess(Authentication auth, @RequestBody GuessReq req) {
        UUID userId = UUID.fromString(auth.getName());
        return catchService.guess(userId, req.guess());
    }

    public record GuessReq(int guess) {}
}
