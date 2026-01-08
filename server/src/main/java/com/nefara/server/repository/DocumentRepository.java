package com.nefara.server.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nefara.server.models.Document;

public interface DocumentRepository extends JpaRepository<Document, Long>{
    public List<Document> findAllByUserId(Long userId);
}