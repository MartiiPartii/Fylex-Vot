# Test Plan: register.test.ts

## Purpose of the Module

The `registerAction` server action orchestrates the registration use case:
1. Validates form data using auth service
2. Calls API client to register user
3. Sets authentication cookie
4. Redirects to dashboard

This is a server action that coordinates between validation, API calls, storage, and navigation.

## Public Functions

### `registerAction(previousState: unknown, formData: FormData): Promise<ServerActionResponse<never>>`
- **Description**: Handles registration form submission
- **Dependencies**: 
  - `validateRegisterData` from `~/services/auth-service`
  - `authRegister` from `~/infrastructure/external`
  - `setAuthToken` from `~/infrastructure/storage/cookie-storage`
  - `createErrorResponse`, `isNextRedirect` from `~/services/error-service`
  - `redirect` from `next/navigation`
- **Returns**: ServerActionResponse (never returns on success, redirects instead)

## Use Cases

### Happy Paths
1. Successful registration with valid data
2. Registration with rememberMe option
3. Registration without rememberMe option

## Error Conditions

1. **Invalid form data** - Returns error response with validation error
2. **API registration failure** - Returns error response with user-friendly message
3. **Next.js redirect errors** - Re-thrown (not caught)

## Domain/Business Rules

1. Form data must be validated before API call
2. RememberMe checkbox value determines cookie expiration
3. Successful registration always redirects to /dashboard
4. Errors are wrapped in user-friendly messages
5. Next.js redirects are re-thrown, not returned as errors

## Expected Interactions

1. Calls `validateRegisterData` with formData
2. If validation fails, returns error response
3. If validation succeeds, calls `authRegister` with firstName, lastName, email, password
4. If API call succeeds, calls `setAuthToken` with token and rememberMe boolean
5. If token setting succeeds, calls `redirect("/dashboard")`
6. If any step fails (except redirect), returns error response

## Inputs, Outputs, and Side Effects

### Inputs
- `previousState`: Unknown (unused in this action)
- `formData`: FormData with firstName, lastName, email, password, optional rememberMe

### Outputs
- ServerActionResponse with success: false and error message (on failure)
- Throws redirect error (on success)

### Side Effects
- Sets authentication cookie via `setAuthToken`
- Redirects to /dashboard on success

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | registerAction | Successful registration with rememberMe | Valid formData with all fields | Validates, calls API, sets token with rememberMe=true, redirects |
| TC002 | registerAction | Invalid form data | FormData with short firstName | Returns error response, no API call |
| TC003 | registerAction | API call fails | Valid formData, API throws error | Returns error response, no token set |
| TC004 | registerAction | Registration without rememberMe | Valid formData without rememberMe | Sets token with rememberMe=false |

