package com.nefara.server.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nefara.server.dto.Review.ReviewDto;
import com.nefara.server.dto.Review.ReviewRequest;
import com.nefara.server.service.Review.ReviewService;
import com.nefara.server.service.User.UserService;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    ReviewService reviewService;

    @Autowired
    UserService userService;

    @PostMapping("")
    public ResponseEntity<ReviewDto> createReviewView(@RequestHeader("Authorization") String authHeaders, @RequestBody ReviewRequest reviewRequest) {
        String token = userService.extractToken(authHeaders);

        ReviewDto reviewDto = reviewService.createReview(reviewRequest, token);

        return ResponseEntity.status(200).body(reviewDto);
    }
}