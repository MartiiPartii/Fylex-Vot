// package com.nefara.server.service.Document;

// import com.cloudinary.Cloudinary;
// import com.cloudinary.Uploader;
// import com.nefara.server.dto.Document.DocumentDto;
// import com.nefara.server.exeptions.ErrorExeption;
// import com.nefara.server.exeptions.ValidationException;
// import com.nefara.server.jwt.JwtUtils;
// import com.nefara.server.models.Document;
// import com.nefara.server.models.User;
// import com.nefara.server.repository.DocumentRepository;
// import com.nefara.server.repository.UserRepository;
// import com.nefara.server.service.Document.DocumentServiceImp.DocumentServiceImpl;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.*;
// import org.springframework.http.HttpStatus;
// import org.springframework.mock.web.MockMultipartFile;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.File;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.anyMap;
// import static org.mockito.ArgumentMatchers.anyString;
// import static org.mockito.Mockito.*;

// class DocumentServiceTest {

//     @Mock
//     private JwtUtils jwtUtils;

//     @Mock
//     private UserRepository userRepository;

//     @Mock
//     private DocumentRepository documentRepository;

//     @Mock
//     private Cloudinary cloudinary;

//     @Mock
//     private Uploader uploader;   

//     @Spy
//     @InjectMocks
//     private DocumentServiceImpl documentService;

//     private User user;
//     private MultipartFile file;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);

//         user = new User();
//         user.setId(1L);
//         user.setEmail("test@example.com");

//         file = new MockMultipartFile(
//                 "file",
//                 "test.pdf",
//                 "application/pdf",
//                 "dummy content".getBytes()
//         );

//         when(cloudinary.uploader()).thenReturn(uploader);
//     }

//     @Test
//     void createDocument_shouldThrowValidationException_whenFileIsNull() {
//         ValidationException ex = assertThrows(
//                 ValidationException.class,
//                 () -> documentService.createDocument(null, "validToken")
//         );

//         assertEquals("File is not provided!", ex.getMessage());
//         assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
//     }

//     @Test
//     void createDocument_shouldThrowErrorExeption_whenJwtInvalid() {
//         when(jwtUtils.getEmailFromToken("badToken"))
//                 .thenThrow(new RuntimeException("Invalid token"));

//         ErrorExeption ex = assertThrows(
//                 ErrorExeption.class,
//                 () -> documentService.createDocument(file, "badToken")
//         );

//         assertEquals("Invalid token", ex.getMessage());
//         assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
//     }

//     @Test
//     void createDocument_shouldThrowValidationException_whenUserNotFound() {
//         when(jwtUtils.getEmailFromToken("validToken"))
//                 .thenReturn("test@example.com");
//         when(userRepository.findByEmail("test@example.com"))
//                 .thenReturn(Optional.empty());

//         ValidationException ex = assertThrows(
//                 ValidationException.class,
//                 () -> documentService.createDocument(file, "validToken")
//         );

//         assertEquals("The user with the given id does not exists!", ex.getMessage());
//         assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
//     }

//     @Test
//     void createDocument_shouldReturnDocumentDto_whenSuccessful() throws Exception {
//         when(jwtUtils.getEmailFromToken("validToken")).thenReturn("test@example.com");
//         when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

//         Map<String, Object> uploadResult = new HashMap<>();
//         uploadResult.put("secure_url", "http://cloudinary.com/test.pdf");
//         when(uploader.upload(any(File.class), anyMap())).thenReturn(uploadResult);

//         doReturn("extracted text")
//             .when(documentService).textExtracter("http://cloudinary.com/test.pdf");

//         doReturn("{\"time\": \"12.5 seconds\", \"percentage\": 85.0, \"overall\": \"Safe\"}")
//             .when(documentService).modelResponse(anyString(), any(Document.class));

//         when(documentRepository.save(any(Document.class)))
//             .thenAnswer(invocation -> {
//                 Document doc = invocation.getArgument(0);
//                 doc.setId(1L);
//                 return doc;
//             });

//         DocumentDto dto = documentService.createDocument(file, "validToken");

//         assertNotNull(dto);
//         assertEquals(1L, dto.getId());
//         verify(documentRepository, times(1)).save(any(Document.class));
//     }

// }
