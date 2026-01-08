package com.nefara.server.service.Review;

import com.nefara.server.dto.Review.ReviewDto;
import com.nefara.server.dto.Review.ReviewRequest;

public interface ReviewService {
    public ReviewDto createReview(ReviewRequest reviewRequest, String token);
}
