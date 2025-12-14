package com.example.pokemonauth.catchgame;

import com.example.pokemonauth.pokemon.PokemonEntity;
import com.example.pokemonauth.pokemon.PokemonRepository;
import com.example.pokemonauth.portfolio.UserPokemonEntity;
import com.example.pokemonauth.portfolio.UserPokemonRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.UUID;

@Service
public class CatchService {
    private final CatchSessionRepository sessionRepo;
    private final PokemonRepository pokemonRepo;
    private final UserPokemonRepository userPokemonRepo;
    private final SecureRandom rng = new SecureRandom();

    private static final int MIN = 1;
    private static final int MAX = 20;
    private static final int TRIES = 3;

    public CatchService(CatchSessionRepository sessionRepo, PokemonRepository pokemonRepo, UserPokemonRepository userPokemonRepo) {
        this.sessionRepo = sessionRepo;
        this.pokemonRepo = pokemonRepo;
        this.userPokemonRepo = userPokemonRepo;
    }

    public StartRes start(UUID userId) {
        PokemonEntity p = pokemonRepo.findRandom(PageRequest.of(0, 1)).get(0);

        CatchSessionEntity s = sessionRepo.findById(userId).orElseGet(() -> {
            CatchSessionEntity x = new CatchSessionEntity();
            x.setUserId(userId); // PRIMARY KEY
            return x;
        });

        s.setPokemonId(p.getId());
        s.setTargetNumber(rng.nextInt(MAX - MIN + 1) + MIN);
        s.setAttemptsLeft(TRIES);
        s.setStatus("ACTIVE");

        sessionRepo.save(s); // update if exists, insert if not

        return new StartRes(p.getId(), p.getName(), p.getHp(), p.getAttack(), p.getDefense(), p.getType(), MIN, MAX, TRIES);
    }


    public GuessRes guess(UUID userId, int guess) {
        CatchSessionEntity s = sessionRepo.findById(userId).orElseThrow(() -> new RuntimeException("NO_ACTIVE_SESSION"));
        if (!"ACTIVE".equals(s.getStatus())) throw new RuntimeException("SESSION_NOT_ACTIVE");

        int attemptsLeft = s.getAttemptsLeft() - 1;
        s.setAttemptsLeft(attemptsLeft);

        if (guess == s.getTargetNumber()) {
            s.setStatus("CAPTURED");
            sessionRepo.save(s);

            // add to portfolio if not already owned
            if (!userPokemonRepo.existsByUserIdAndPokemonId(userId, s.getPokemonId())) {
                UserPokemonEntity up = new UserPokemonEntity();
                up.setId(UUID.randomUUID());
                up.setUserId(userId);
                up.setPokemonId(s.getPokemonId());
                userPokemonRepo.save(up);
            }

            // end session
            sessionRepo.deleteById(userId);
            return new GuessRes("CAPTURED", "Correct! You captured it.", 0);
        }

        if (attemptsLeft <= 0) {
            s.setStatus("ESCAPED");
            sessionRepo.save(s);
            sessionRepo.deleteById(userId);
            return new GuessRes("ESCAPED", "Failed 3 tries. It ran away.", 0);
        }

        String hint = guess < s.getTargetNumber() ? "Higher" : "Lower";
        sessionRepo.save(s);
        return new GuessRes("TRY_AGAIN", hint, attemptsLeft);
    }

    public record StartRes(Integer id, String name, int hp, int attack, int defense, String type , int min, int max, int tries) {}
    public record GuessRes(String status, String message, int attemptsLeft) {}
}
