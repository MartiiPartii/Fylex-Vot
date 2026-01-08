package com.nefara.server.dto.User.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthRequest {
    private String FirstName;
    private String LastName;
    private String email;
    private String password;
}
