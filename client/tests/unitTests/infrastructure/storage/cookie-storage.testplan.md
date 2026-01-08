# Test Plan: cookie-storage.test.ts

## Purpose of the Module

The `cookie-storage` module handles cookie operations for authentication:
- Set authentication token in cookie
- Remove authentication token from cookie

This is an infrastructure layer that interacts with Next.js cookies API.

## Public Functions

### `setAuthToken(token: string, rememberMe: boolean): Promise<void>`
- **Description**: Sets authentication token in cookie with appropriate expiration
- **Dependencies**: 
  - `getCookieStore` from `~/utils/authentication`
  - `calculateTokenExpiration`, `decodeTokenPayload` from `~/services/auth-service`
- **Returns**: void

### `removeAuthToken(): Promise<void>`
- **Description**: Removes authentication token from cookie
- **Dependencies**: `getCookieStore` from `~/utils/authentication`
- **Returns**: void

## Use Cases

### Happy Paths
1. Set token with rememberMe=true and token expiration
2. Set token with rememberMe=true without token expiration
3. Set token with rememberMe=false (session-only)
4. Set token with secure flag in production
5. Remove token from cookie

## Error Conditions

None - operations always complete (cookie operations don't throw)

## Domain/Business Rules

1. Cookie is httpOnly and sameSite: strict
2. Secure flag is set in production environment
3. Expiration is calculated based on rememberMe and token expiration
4. Token payload is decoded to get expiration time

## Expected Interactions

1. Gets cookie store from Next.js
2. Decodes token to get expiration
3. Calculates expiration config
4. Sets cookie with appropriate options
5. Deletes cookie for removal

## Inputs, Outputs, and Side Effects

### Inputs
- Token string
- RememberMe boolean

### Outputs
- void

### Side Effects
- Sets or deletes authentication cookie

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | setAuthToken | Set token with expiration config | token, rememberMe=true, tokenExp | Sets cookie with expires date |
| TC002 | setAuthToken | Set secure flag in production | token, NODE_ENV=production | Sets cookie with secure=true |
| TC003 | setAuthToken | Handle token without expiration | token, rememberMe, no tokenExp | Sets cookie with calculated expiration |
| TC004 | removeAuthToken | Delete token from cookies | No input | Deletes token cookie |

