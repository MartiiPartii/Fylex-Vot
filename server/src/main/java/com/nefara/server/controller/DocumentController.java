package com.nefara.server.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nefara.server.dto.Document.DocumentAnalysisDto;
import com.nefara.server.dto.Document.DocumentDashboardDto;
import com.nefara.server.dto.Document.DocumentDto;
import com.nefara.server.service.Document.DocumentService;
import com.nefara.server.service.User.UserService;


@RestController
@RequestMapping("/api/document")
public class DocumentController {

    @Autowired
    DocumentService documentService;

    @Autowired
    UserService userService;

    @PostMapping("")
    public ResponseEntity<Long> createDocumentView(@RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String authHeaders) {
        String token = userService.extractToken(authHeaders);

        DocumentDto documentDto = documentService.createDocument(file, token);

        return ResponseEntity.status(200).body(documentDto.getId());
    }

    @GetMapping("")
    public ResponseEntity<List<DocumentDashboardDto>> getAllUserDocumentsView(@RequestHeader("Authorization") String authHeaders) {
        String token = userService.extractToken(authHeaders);

        List<DocumentDashboardDto> response = documentService.getUserDocuments(token);

        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDto> getDocumentByIdView(@PathVariable("id") Long documentId, @RequestHeader("Authorization") String authHeaders) {
        String token = userService.extractToken(authHeaders);

        DocumentDto documentDto = documentService.getDocumentById(token, documentId);

        return ResponseEntity.status(200).body(documentDto);
    }

    @GetMapping("/an")
    public ResponseEntity<DocumentAnalysisDto> getDashboardAnalisysView(@RequestHeader("Authorization") String authHeaders) {
        String token = userService.extractToken(authHeaders);

        DocumentAnalysisDto documentAnalysisDto = documentService.getDashboardAnalisys(token);

        return ResponseEntity.status(200).body(documentAnalysisDto);
    }

}