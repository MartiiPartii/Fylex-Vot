    package com.nefara.server.service.User.serviceImp;

    import java.io.IOException;
    import java.security.GeneralSecurityException;
    import java.util.Collections;
    import java.util.Map;

    import org.cloudinary.json.JSONObject;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.http.HttpStatus;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;
    import org.springframework.web.multipart.MultipartFile;

    import com.nefara.server.dto.User.UserDto;
    import com.nefara.server.dto.User.Responses.AuthResponse;
    import com.nefara.server.dto.User.requests.AuthLoginRequest;
    import com.nefara.server.dto.User.requests.AuthRequest;
    import com.nefara.server.service.User.UserService;
    import com.nefara.server.exeptions.ErrorExeption;
    import com.nefara.server.exeptions.ValidationException;
    import com.nefara.server.jwt.JwtUtils;
    import com.nefara.server.mapper.User.UserMapper;
    import com.nefara.server.models.User;
    import com.nefara.server.repository.UserRepository;
    import com.google.api.client.json.JsonFactory;
    import com.google.api.client.json.gson.GsonFactory;
    import com.google.api.client.http.javanet.NetHttpTransport;
    import com.cloudinary.Cloudinary;
    import com.cloudinary.utils.ObjectUtils;
    import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
    import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
    import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

    import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;

    @Service
    public class UserServiceImp implements UserService{

        @Autowired
        AuthenticationManager authenticationManager;

        @Autowired
        private PasswordEncoder encoder;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private Cloudinary cloudinary;

        @Autowired
        private JwtUtils jwtUtils;

        @Value("${google.clientid}")
        private String GOOGLE_CLIENT_ID;

        @Value("${github.clientid}")
        private String GITHUB_CLIENT_ID;

        @Value("${github.client.secret}")
        private String GITHUB_CLIENT_SECRET;

        @Override
        public AuthResponse register(AuthRequest user) {
            userRepository.findByEmail(user.getEmail()).ifPresent(u -> {
                throw new ValidationException("Email allready used!", HttpStatus.BAD_REQUEST);
            });

            User newUser = new User();
            newUser.setFirstName(user.getFirstName());
            newUser.setLastName(user.getLastName());
            newUser.setEmail(user.getEmail());
            newUser.setPassword(encoder.encode(user.getPassword()));

            userRepository.save(newUser);

            return new AuthResponse(newUser.getId(), newUser.getEmail(), jwtUtils.generateToken(newUser.getId(), newUser.getEmail() ));
        }

        @Override
        public AuthResponse login(AuthLoginRequest user) {
            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
                );

                User login_user = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new ValidationException("User with the given email not found!", HttpStatus.BAD_REQUEST));

                String token = jwtUtils.generateToken(login_user.getId(), login_user.getEmail());

                return new AuthResponse(
                    login_user.getId(),
                    login_user.getEmail(),
                    token
                );

            } catch (Exception e){
                throw new ValidationException(e.getMessage(), HttpStatus.BAD_REQUEST);
            }

        }

        @Override
        public AuthResponse google_auth(String access_token) {

            NetHttpTransport transport = new NetHttpTransport();
            JsonFactory jsonFactory = GsonFactory.getDefaultInstance();

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();

            try {
                GoogleIdToken idToken = verifier.verify(access_token);

                if (idToken == null) {
                    throw new ValidationException("Invalid ID token", HttpStatus.BAD_REQUEST);
                }

                Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String FirstName = (String) payload.get("given_name");
                String LastName = (String) payload.get("family_name");

                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    return new AuthResponse(
                        user.getId(),
                        user.getEmail(),
                        jwtUtils.generateToken(user.getId(), user.getEmail())
                    );
                }

                User newUser = new User();
                newUser.setEmail(email);
                newUser.setFirstName(FirstName);
                newUser.setLastName(LastName);

                userRepository.save(newUser);

                return new AuthResponse(
                    newUser.getId(),
                    newUser.getEmail(),
                    jwtUtils.generateToken(newUser.getId(), newUser.getEmail())
                );
            

            } catch (GeneralSecurityException | IOException e) {
                throw new ValidationException(e.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }

        @Override
        public AuthResponse github_auth(String code) {

            try {
                String body = "client_id=" + GITHUB_CLIENT_ID +
                            "&client_secret=" + GITHUB_CLIENT_SECRET +
                            "&code=" + code;

                HttpClient client = HttpClient.newHttpClient();
                HttpRequest tokenRequest = HttpRequest.newBuilder()
                        .uri(URI.create("https://github.com/login/oauth/access_token"))
                        .header("Accept", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(body))
                        .build();

                HttpResponse<String> tokenResponse = client.send(tokenRequest, HttpResponse.BodyHandlers.ofString());

                JSONObject tokenJson = new JSONObject(tokenResponse.body());
                if (!tokenJson.has("access_token")) {
                    throw new ValidationException(tokenResponse.body(), HttpStatus.BAD_REQUEST);
                }

                String accessToken = tokenJson.getString("access_token");

                HttpRequest userRequest = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.github.com/user"))
                        .header("Accept", "application/vnd.github+json")
                        .header("Authorization", "Bearer " + accessToken)
                        .GET()
                        .build();

                HttpResponse<String> userResponse = client.send(userRequest, HttpResponse.BodyHandlers.ofString());
                JSONObject userJson = new JSONObject(userResponse.body());

                String email = userJson.has("email") && !userJson.isNull("email")
                                ? userJson.getString("email")
                                : userJson.getString("login");

                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    return new AuthResponse(
                        user.getId(),
                        user.getEmail(),
                        jwtUtils.generateToken(user.getId(), user.getEmail())
                    );
                }

                User newUser = new User();
                newUser.setEmail(email);
                userRepository.save(newUser);

                return new AuthResponse(
                    newUser.getId(),
                    newUser.getEmail(),
                    jwtUtils.generateToken(newUser.getId(), newUser.getEmail())
                );

            } catch (IOException | InterruptedException e) {
                throw new ValidationException(e.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }


        @Override
        public String extractToken(String authHeader) {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                return authHeader.substring(7);
            }
            return null;
        }

        @Override
        public UserDto details(String token) {
            
            String email;

            try {
                email = jwtUtils.getEmailFromToken(token);
            } catch (Exception e) {
                throw new ErrorExeption(e.getMessage(), HttpStatus.BAD_REQUEST);
            }

            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) throw new ValidationException("User with the given email not found!", HttpStatus.BAD_REQUEST);

            UserDto userDto = UserMapper.mapToDto(user);

            return userDto;
        }

        @Override
        public String uploadProfileImage(MultipartFile profileImage, String token) {
            String email = jwtUtils.getEmailFromToken(token);

            if (profileImage == null || profileImage.isEmpty()) {
                throw new ValidationException("Profile image is required", HttpStatus.BAD_REQUEST);
            }

            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) throw new ValidationException("User with the given email not found!", HttpStatus.BAD_REQUEST);
            
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    profileImage.getBytes(),
                    ObjectUtils.asMap(
                        "folder", "Fylex/profile_images",
                        "public_id", "profile_" + user.getId() + "_" + System.currentTimeMillis(),
                        "overwrite", true
                    )
                );

                String url = (String) uploadResult.get("secure_url");

                user.setProfileImage(url);
                userRepository.save(user);

                return url;

            } catch (IOException e) {
                throw new ValidationException(e.getMessage(), HttpStatus.BAD_REQUEST);
            }
                
        }
    }
