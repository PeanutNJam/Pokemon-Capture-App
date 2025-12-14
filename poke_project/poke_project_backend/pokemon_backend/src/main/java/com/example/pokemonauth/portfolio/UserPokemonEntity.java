package com.example.pokemonauth.portfolio;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_pokemon",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "pokemon_id"}))
public class UserPokemonEntity {
    @Id
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "pokemon_id", nullable = false)
    private Integer pokemonId;

    private String nickname;

    @Column(nullable = false)
    private Instant capturedAt = Instant.now();

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public Integer getPokemonId() { return pokemonId; }
    public void setPokemonId(Integer pokemonId) { this.pokemonId = pokemonId; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public Instant getCapturedAt() { return capturedAt; }
}
