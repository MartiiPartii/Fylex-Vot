package com.nefara.server.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nefara.server.dto.User.UserDto;
import com.nefara.server.dto.User.Responses.AuthResponse;
import com.nefara.server.dto.User.requests.AuthLoginRequest;
import com.nefara.server.dto.User.requests.AuthRequest;
import com.nefara.server.service.User.UserService;


@RestController
@RequestMapping("/api/auth")
public class UserController {
        
    @Autowired
    private UserService userService;

    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerView(@RequestBody AuthRequest authRequest) {
        AuthResponse response = userService.register(authRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginView(@RequestBody AuthLoginRequest authLoginRequest) {
        AuthResponse response = userService.login(authLoginRequest);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/google-login")
    public ResponseEntity<AuthResponse> googleLoginView(@RequestBody Map<String, String> body) {
        String token = body.get("token");
       
        AuthResponse authResponse = userService.google_auth(token);

        return ResponseEntity.status(200).body(authResponse);
    }

    @PostMapping("/github-login")
    public ResponseEntity<AuthResponse> githubLoginView(@RequestBody Map<String, String> body) {
        String code = body.get("code");

        AuthResponse authResponse = userService.github_auth(code);

        return ResponseEntity.status(200).body(authResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> detailsView(@RequestHeader("Authorization") String authHeaders) {
        String token = userService.extractToken(authHeaders);

        UserDto response = userService.details(token);

        return ResponseEntity.status(200).body(response);
    }

    @PostMapping("/me")
    public ResponseEntity<String> upleadImageView(@RequestHeader("Authorization") String authHeaders, @RequestParam("image") MultipartFile profileImage) {
        String token = userService.extractToken(authHeaders);

        String url = userService.uploadProfileImage(profileImage, token);
        
        return ResponseEntity.status(200).body(url);
    }

}
