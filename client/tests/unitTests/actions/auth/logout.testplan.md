# Test Plan: logout.test.ts

## Purpose of the Module

The `logoutAction` server action orchestrates the logout use case:
1. Removes authentication cookie
2. Redirects to login page

This is a server action that coordinates between storage and navigation.

## Public Functions

### `logoutAction(): Promise<ServerActionResponse<never>>`
- **Description**: Handles user logout
- **Dependencies**: 
  - `removeAuthToken` from `~/infrastructure/storage/cookie-storage`
  - `createErrorResponse`, `isNextRedirect` from `~/services/error-service`
  - `redirect` from `next/navigation`
- **Returns**: ServerActionResponse (never returns on success, redirects instead)

## Use Cases

### Happy Paths
1. Successful logout and redirect to login

## Error Conditions

1. **Token removal failure** - Returns error response with user-friendly message
2. **Next.js redirect errors** - Re-thrown (not caught)

## Domain/Business Rules

1. Successful logout always redirects to /login
2. Errors are wrapped in user-friendly messages
3. Next.js redirects are re-thrown, not returned as errors

## Expected Interactions

1. Calls `removeAuthToken` to delete cookie
2. If removal succeeds, calls `redirect("/login")`
3. If removal fails, returns error response

## Inputs, Outputs, and Side Effects

### Inputs
- None (no parameters)

### Outputs
- ServerActionResponse with success: false and error message (on failure)
- Throws redirect error (on success)

### Side Effects
- Removes authentication cookie via `removeAuthToken`
- Redirects to /login on success

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | logoutAction | Successful logout | No input | Removes token, redirects to /login |
| TC002 | logoutAction | Token removal fails | No input, storage error | Returns error response |
| TC003 | logoutAction | Re-throw redirect | No input, redirect throws | Re-throws redirect error |

