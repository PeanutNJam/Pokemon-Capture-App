package com.example.pokemonauth.pokemon;

import jakarta.persistence.*;



@Entity
@Table(name = "pokemon")
public class PokemonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false) private int hp;
    @Column(nullable = false) private int attack;
    @Column(nullable = false) private int defense;
    @Column(nullable = false) private String type;

    public Integer getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getHp() { return hp; }
    public void setHp(int hp) { this.hp = hp; }
    public int getAttack() { return attack; }
    public void setAttack(int attack) { this.attack = attack; }
    public int getDefense() { return defense; }
    public void setDefense(int defense) { this.defense = defense; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}