# Test Plan: auth-api.test.ts

## Purpose of the Module

The `auth-api` module provides API client functions for authentication operations:
- Login, register, OAuth login (Google, GitHub)
- Get user profile
- Upload profile picture

This is an infrastructure layer that constructs API requests for authentication endpoints.

## Public Functions

### `authLogin(credentials: { email: string; password: string }): Promise<AuthResponse>`
- **Description**: Authenticates user with email and password
- **Dependencies**: `httpRequest` from `~/infrastructure/http/fetch-client`
- **Returns**: AuthResponse with token and user data

### `authRegister(data: { firstName, lastName, email, password }): Promise<AuthResponse>`
- **Description**: Registers new user
- **Dependencies**: `httpRequest` from `~/infrastructure/http/fetch-client`
- **Returns**: AuthResponse with token and user data

### `authGoogleLogin(token: string): Promise<AuthResponse>`
- **Description**: Authenticates user with Google OAuth token
- **Dependencies**: `httpRequest` from `~/infrastructure/http/fetch-client`
- **Returns**: AuthResponse with token and user data

### `authGithubLogin(code: string): Promise<AuthResponse>`
- **Description**: Authenticates user with GitHub OAuth code
- **Dependencies**: `httpRequest` from `~/infrastructure/http/fetch-client`
- **Returns**: AuthResponse with token and user data

### `authGetProfile(): Promise<User>`
- **Description**: Gets current user profile with caching
- **Dependencies**: `httpRequest`, `getToken`, `decodeTokenPayload`, `unstable_cache`
- **Returns**: User object

### `authUploadPicture(formData: FormData): Promise<void>`
- **Description**: Uploads profile picture
- **Dependencies**: `httpRequest` from `~/infrastructure/http/fetch-client`
- **Returns**: void

## Use Cases

### Happy Paths
1. Successful login
2. Successful registration
3. Successful Google OAuth
4. Successful GitHub OAuth
5. Get user profile with caching
6. Upload profile picture

## Error Conditions

1. **API errors** - Propagated from httpRequest
2. **Missing token** - Uses anonymous userId for caching

## Domain/Business Rules

1. All auth endpoints use POST method except getProfile (GET)
2. Profile endpoint uses user-specific caching
3. Anonymous userId is used when token is missing
4. Token is passed to cached function to avoid cookie access

## Expected Interactions

1. Constructs API request with correct URL, method, body, headers
2. Calls httpRequest with constructed config
3. For getProfile, uses unstable_cache with user-specific key
4. Returns API response

## Inputs, Outputs, and Side Effects

### Inputs
- Credentials, registration data, OAuth tokens/codes
- FormData for picture upload

### Outputs
- AuthResponse objects
- User object
- void (for upload)

### Side Effects
- Makes HTTP requests to backend
- Caches profile data

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | authLogin | Call httpRequest with credentials | {email, password} | Calls httpRequest with /auth/login endpoint |
| TC002 | authRegister | Call httpRequest with registration data | {firstName, lastName, email, password} | Calls httpRequest with /auth/register endpoint |
| TC003 | authGoogleLogin | Call httpRequest with Google token | Google token string | Calls httpRequest with /auth/google-login endpoint |
| TC004 | authGithubLogin | Call httpRequest with GitHub code | GitHub code string | Calls httpRequest with /auth/github-login endpoint |
| TC005 | authGetProfile | Call httpRequest with token and cache | Token present | Calls httpRequest with /auth/me, uses user-specific cache |
| TC006 | authGetProfile | Use anonymous userId | Token missing | Calls httpRequest with token=null, uses anonymous cache |
| TC007 | authUploadPicture | Call httpRequest with FormData | FormData with picture | Calls httpRequest with /auth/me POST, FormData body |

