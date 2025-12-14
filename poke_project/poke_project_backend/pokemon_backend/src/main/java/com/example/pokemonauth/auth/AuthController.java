package com.example.pokemonauth.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterReq req, HttpServletResponse res) {
        var result = authService.register(req.email(), req.password(), req.trainerName());
        setRefreshCookie(res, result.refreshToken());
        return ResponseEntity.ok(new TokenRes(result.accessToken()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginReq req, HttpServletResponse res) {
        var result = authService.login(req.email(), req.password());
        setRefreshCookie(res, result.refreshToken());
        return ResponseEntity.ok(new TokenRes(result.accessToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken,
                                     HttpServletResponse res) {
        if (refreshToken == null) return ResponseEntity.status(401).build();
        var result = authService.refresh(refreshToken);
        setRefreshCookie(res, result.refreshToken());
        return ResponseEntity.ok(new TokenRes(result.accessToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken,
                                    HttpServletResponse res) {
        if (refreshToken != null) authService.logout(refreshToken);
        clearRefreshCookie(res);
        return ResponseEntity.ok().build();
    }

    private void setRefreshCookie(HttpServletResponse res, String token) {
        Cookie c = new Cookie("refreshToken", token);
        c.setHttpOnly(true);
        c.setSecure(false); // set true in prod (HTTPS)
        c.setPath("/");     // cookie available to /auth/refresh etc
        c.setMaxAge(14 * 24 * 3600);
        // SameSite isn't in javax Cookie; set via header if you need None in prod
        res.addCookie(c);
    }

    private void clearRefreshCookie(HttpServletResponse res) {
        Cookie c = new Cookie("refreshToken", "");
        c.setHttpOnly(true);
        c.setSecure(false);
        c.setPath("/");
        c.setMaxAge(0);
        res.addCookie(c);
    }

    public record RegisterReq(
            @Email @NotBlank String email,
            @Size(min = 8) String password,
            @NotBlank String trainerName
    ) {}

    public record LoginReq(@Email @NotBlank String email, @NotBlank String password) {}

    public record TokenRes(String accessToken) {}
}
