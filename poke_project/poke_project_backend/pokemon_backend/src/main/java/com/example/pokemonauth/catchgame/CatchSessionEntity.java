package com.example.pokemonauth.catchgame;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "catch_session")
public class CatchSessionEntity {
    @Id
    private UUID userId; // 1 active session per user

    @Column(nullable = false)
    private Integer pokemonId;

    @Column(nullable = false)
    private Integer targetNumber;

    @Column(nullable = false)
    private Integer attemptsLeft;

    @Column(nullable = false)
    private String status; // ACTIVE, CAPTURED, ESCAPED

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public Integer getPokemonId() { return pokemonId; }
    public void setPokemonId(Integer pokemonId) { this.pokemonId = pokemonId; }
    public Integer getTargetNumber() { return targetNumber; }
    public void setTargetNumber(Integer targetNumber) { this.targetNumber = targetNumber; }
    public Integer getAttemptsLeft() { return attemptsLeft; }
    public void setAttemptsLeft(Integer attemptsLeft) { this.attemptsLeft = attemptsLeft; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
