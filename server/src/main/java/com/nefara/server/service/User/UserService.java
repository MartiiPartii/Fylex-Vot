package com.nefara.server.service.User;

import org.springframework.web.multipart.MultipartFile;

import com.nefara.server.dto.User.UserDto;
import com.nefara.server.dto.User.Responses.AuthResponse;
import com.nefara.server.dto.User.requests.AuthLoginRequest;
import com.nefara.server.dto.User.requests.AuthRequest;

public interface UserService {
    public AuthResponse register(AuthRequest user);
    public AuthResponse login(AuthLoginRequest user);
    public AuthResponse google_auth(String access_token);
    public AuthResponse github_auth(String access_token);

    String extractToken(String authHeader);

    public UserDto details(String token);

    public String uploadProfileImage(MultipartFile profileImage, String token);
}
