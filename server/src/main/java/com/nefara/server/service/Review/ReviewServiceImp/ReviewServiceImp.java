package com.nefara.server.service.Review.ReviewServiceImp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.nefara.server.dto.Review.ReviewDto;
import com.nefara.server.dto.Review.ReviewRequest;
import com.nefara.server.service.Review.ReviewService;

import com.nefara.server.exeptions.ValidationException;
import com.nefara.server.jwt.JwtUtils;
import com.nefara.server.mapper.Review.ReviewDtoMapper;
import com.nefara.server.models.Review;
import com.nefara.server.models.User;
import com.nefara.server.repository.ReviewRepository;
import com.nefara.server.repository.UserRepository;

@Service
public class ReviewServiceImp implements ReviewService{
    
    @Autowired
    ReviewRepository reviewRepository;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;
    
    @Override
    public ReviewDto createReview(ReviewRequest reviewRequest, String token) {
        
        Long id = jwtUtils.getIdFromToken(token);
        User user = userRepository.findById(id).orElse(null);
        if (user == null) throw new ValidationException("User with token credentials does not exixt!", HttpStatus.NOT_FOUND);

        if (reviewRequest == null) throw new ValidationException("The review is null!", HttpStatus.BAD_REQUEST);

        Review review = new Review();
        if (reviewRequest.getComment() != null) review.setComment(reviewRequest.getComment());
        review.setStars(reviewRequest.getStars());

        review.setUser(user);

        reviewRepository.save(review);

        return ReviewDtoMapper.mapReviewToDto(review);
    }
}
