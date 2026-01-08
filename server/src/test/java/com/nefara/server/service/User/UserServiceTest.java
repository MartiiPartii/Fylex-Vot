package com.nefara.server.service.User;

import com.nefara.server.models.User;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nefara.server.dto.User.UserDto;
import com.nefara.server.jwt.JwtUtils;
import com.nefara.server.repository.UserRepository;
import com.nefara.server.service.User.serviceImp.UserServiceImp;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
       
    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private UserServiceImp underTest;

    @Test
    void testDetailsUser() {
        String token = "fake-token";
        String email = "fake-email";
        User user = new User();
        user.setEmail(email);
        user.setFirstName("name");
        user.setLastName("name");
        user.setPassword("123");
        user.setProfileImage("image-url");

        when(jwtUtils.getEmailFromToken(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        UserDto result = underTest.details(token);

        assertThat(result.getEmail()).isEqualTo(email);
        assertThat(result.getFirstName()).isEqualTo("name");
        assertThat(result.getLastName()).isEqualTo("name");
        assertThat(result.getProfileUrls()).isEqualTo("image-url");
        verify(jwtUtils).getEmailFromToken(token);
        verify(userRepository).findByEmail(email);
    }
}
