# Test Plan: auth-service.test.ts

## Purpose of the Module

The `auth-service` module provides pure business logic for authentication operations. It handles:
- Form data validation for login and registration
- Token expiration calculation based on user preferences
- JWT token payload decoding (without verification)

This is a pure domain logic layer with no side effects, HTTP requests, or framework dependencies.

## Public Functions

### `validateLoginData(formData: FormData): ValidationResult<LoginSchema>`
- **Description**: Validates login form data against LoginSchema
- **Dependencies**: `LoginSchema` from `~/schemas/auth`
- **Returns**: Validation result with parsed data or error message

### `validateRegisterData(formData: FormData): ValidationResult<RegisterSchema>`
- **Description**: Validates registration form data against RegisterSchema
- **Dependencies**: `RegisterSchema` from `~/schemas/auth`
- **Returns**: Validation result with parsed data or error message

### `calculateTokenExpiration(rememberMe: boolean, tokenExp?: number): { maxAge?: number; expires?: Date }`
- **Description**: Calculates cookie expiration configuration based on rememberMe preference and optional token expiration
- **Dependencies**: None
- **Returns**: Object with either `maxAge` (seconds) or `expires` (Date)

### `decodeTokenPayload(token: string): TokenPayload | null`
- **Description**: Decodes JWT token payload without verification (base64 decode only)
- **Dependencies**: None
- **Returns**: Decoded payload object or null if invalid

## Use Cases

### Happy Paths
1. Valid login form data validation
2. Valid registration form data validation
3. Token expiration calculation for "remember me" scenarios
4. Token expiration calculation for session-only scenarios
5. Successful JWT token payload decoding

## Error Conditions

1. **Invalid email format** - Returns validation error
2. **Missing required fields** - Returns validation error
3. **Short name fields** - Returns validation error for registration
4. **Invalid JWT format** - Returns null for decodeTokenPayload
5. **Invalid base64/JSON in token** - Returns null for decodeTokenPayload

## Domain/Business Rules

1. Email must be valid format
2. Password is required for login
3. First name and last name must be at least 2 characters
4. Remember me with token expiration uses `expires` date
5. Remember me without token expiration uses 30-day `maxAge`
6. Session-only (no remember me) uses 1-hour `maxAge`
7. JWT tokens must have exactly 3 parts separated by dots
8. Token payload must be valid base64-encoded JSON

## Expected Interactions

- No external dependencies (pure functions)
- Uses Zod schemas for validation
- No side effects

## Inputs, Outputs, and Side Effects

### Inputs
- FormData objects for validation
- Boolean and optional number for expiration calculation
- String token for decoding

### Outputs
- ValidationResult objects with success flag, data, and optional error
- Expiration configuration objects
- TokenPayload objects or null

### Side Effects
- None (pure functions)

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | validateLoginData | Valid login data | FormData with email, password, rememberMe | Returns success with parsed data |
| TC002 | validateLoginData | Invalid email | FormData with invalid email | Returns error "Please enter a valid email address" |
| TC003 | validateLoginData | Missing password | FormData without password | Returns error "Required" |
| TC004 | validateLoginData | Empty form data | Empty FormData | Returns error "Required" |
| TC005 | validateRegisterData | Valid registration data | FormData with all required fields | Returns success with parsed data |
| TC006 | validateRegisterData | Short first name | FormData with 1-char first name | Returns error "First name must be at least 2 characters" |
| TC007 | validateRegisterData | Short last name | FormData with 1-char last name | Returns error "Last name must be at least 2 characters" |
| TC008 | validateRegisterData | Invalid email in registration | FormData with invalid email | Returns error "Please enter a valid email address" |
| TC009 | calculateTokenExpiration | Remember me with token exp | rememberMe=true, tokenExp provided | Returns expires Date |
| TC010 | calculateTokenExpiration | Remember me without token exp | rememberMe=true, tokenExp undefined | Returns maxAge 30 days |
| TC011 | calculateTokenExpiration | Session-only (no remember me) | rememberMe=false | Returns maxAge 1 hour |
| TC012 | calculateTokenExpiration | Session-only with token exp | rememberMe=false, tokenExp provided | Returns maxAge 1 hour (ignores tokenExp) |
| TC013 | decodeTokenPayload | Valid JWT token | Valid 3-part JWT token | Returns decoded payload |
| TC014 | decodeTokenPayload | Invalid token format | Token with 2 parts | Returns null |
| TC015 | decodeTokenPayload | Invalid base64 | Token with invalid base64 payload | Returns null |
| TC016 | decodeTokenPayload | Invalid JSON payload | Token with non-JSON payload | Returns null |
| TC017 | decodeTokenPayload | Empty token | Empty string | Returns null |

