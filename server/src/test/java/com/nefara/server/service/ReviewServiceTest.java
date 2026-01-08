package com.nefara.server.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nefara.server.dto.Review.ReviewDto;
import com.nefara.server.dto.Review.ReviewRequest;
import com.nefara.server.exeptions.ValidationException;
import com.nefara.server.jwt.JwtUtils;
import com.nefara.server.models.Review;
import com.nefara.server.models.User;
import com.nefara.server.repository.ReviewRepository;
import com.nefara.server.repository.UserRepository;
import com.nefara.server.service.Review.ReviewServiceImp.ReviewServiceImp;


@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {
    
    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReviewServiceImp reviewService;

    @Test
    void createReview_validRequest_returnsDto() {
        String fakeToken = "fake-jwt";
        ReviewRequest reviewRequest = new ReviewRequest("Nice product", 5);

        User mockUser = new User(26L, "profile.png", "First", "Last", "email@gmail.com", "123");
        when(jwtUtils.getIdFromToken(fakeToken)).thenReturn(26L);
        when(userRepository.findById(26L)).thenReturn(Optional.of(mockUser));

        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ReviewDto result = reviewService.createReview(reviewRequest, fakeToken);

        assertNotNull(result);
        assertEquals("Nice product", result.getComment());
        assertEquals(5, result.getStars());
        assertEquals(26L, result.getUser_id());

        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    void createReview_nullRequest_throwsValidationException() {
        String fakeToken = "fake-jwt";
        when(jwtUtils.getIdFromToken(fakeToken)).thenReturn(26L);
        when(userRepository.findById(26L)).thenReturn(Optional.of(new User()));

        ValidationException exception = assertThrows(
            ValidationException.class,
            () -> reviewService.createReview(null, fakeToken)
        );

        assertEquals("The review is null!", exception.getMessage());
    }

    @Test
    void createReview_userNotFound_throwsValidationException() {
        String fakeToken = "fake-jwt";
        when(jwtUtils.getIdFromToken(fakeToken)).thenReturn(26L);
        when(userRepository.findById(26L)).thenReturn(Optional.empty());

        ValidationException exception = assertThrows(
            ValidationException.class,
            () -> reviewService.createReview(new ReviewRequest("comment", 3), fakeToken)
        );

        assertEquals("User with token credentials does not exixt!", exception.getMessage());
    }
}
