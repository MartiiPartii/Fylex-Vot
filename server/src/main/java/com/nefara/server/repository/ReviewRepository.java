package com.nefara.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nefara.server.models.Review;

public interface ReviewRepository extends JpaRepository<Review, Long>{
    
}
