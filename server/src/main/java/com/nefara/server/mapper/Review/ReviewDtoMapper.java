package com.nefara.server.mapper.Review;

import com.nefara.server.dto.Review.ReviewDto;
import com.nefara.server.models.Review;

public class ReviewDtoMapper {
    public static ReviewDto mapReviewToDto(Review review) {
        if (review == null) return null;
        
        return new ReviewDto(
            review.getId(),
            review.getComment(),
            review.getStars(),
            review.getUser().getId()
        );
    }
}
