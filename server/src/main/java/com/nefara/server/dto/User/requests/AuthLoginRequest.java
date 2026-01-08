package com.nefara.server.dto.User.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthLoginRequest {
    private String email;
    private String password;
}
