# Test Plan: oauth.test.ts

## Purpose of the Module

The OAuth actions (`githubAuthAction` and `googleAuthAction`) orchestrate OAuth authentication flows:
1. Call API client with OAuth credentials
2. Set authentication cookie (always with rememberMe=false)
3. Redirect to dashboard

These are server actions that coordinate between API calls, storage, and navigation.

## Public Functions

### `githubAuthAction(code: string): Promise<ServerActionResponse<never>>`
- **Description**: Handles GitHub OAuth callback
- **Dependencies**: 
  - `authGithubLogin` from `~/infrastructure/external`
  - `setAuthToken` from `~/infrastructure/storage/cookie-storage`
  - `createErrorResponse`, `isNextRedirect` from `~/services/error-service`
  - `redirect` from `next/navigation`
- **Returns**: ServerActionResponse (never returns on success, redirects instead)

### `googleAuthAction(credentialResponse: { credential: string }): Promise<ServerActionResponse<never>>`
- **Description**: Handles Google OAuth callback
- **Dependencies**: Same as githubAuthAction
- **Returns**: ServerActionResponse (never returns on success, redirects instead)

## Use Cases

### Happy Paths
1. Successful GitHub authentication
2. Successful Google authentication

## Error Conditions

1. **API authentication failure** - Returns error response with user-friendly message
2. **Next.js redirect errors** - Re-thrown (not caught)

## Domain/Business Rules

1. OAuth flows always set rememberMe to false (no persistent cookies)
2. Successful OAuth always redirects to /dashboard
3. Errors are wrapped in user-friendly messages
4. Next.js redirects are re-thrown, not returned as errors

## Expected Interactions

1. Calls `authGithubLogin`/`authGoogleLogin` with OAuth credential
2. If API call succeeds, calls `setAuthToken` with token and rememberMe=false
3. If token setting succeeds, calls `redirect("/dashboard")`
4. If any step fails (except redirect), returns error response

## Inputs, Outputs, and Side Effects

### Inputs
- `code`: GitHub OAuth code string
- `credentialResponse`: Object with Google credential string

### Outputs
- ServerActionResponse with success: false and error message (on failure)
- Throws redirect error (on success)

### Side Effects
- Sets authentication cookie via `setAuthToken` (always with rememberMe=false)
- Redirects to /dashboard on success

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | githubAuthAction | Successful GitHub auth | Valid GitHub code | Calls API, sets token with rememberMe=false, redirects |
| TC002 | githubAuthAction | GitHub API fails | Invalid code | Returns error response, no token set |
| TC003 | githubAuthAction | Re-throw redirect (GitHub) | Valid code, redirect throws | Re-throws redirect error |
| TC004 | googleAuthAction | Successful Google auth | Valid Google credential | Calls API, sets token with rememberMe=false, redirects |
| TC005 | googleAuthAction | Google API fails | Invalid credential | Returns error response, no token set |
| TC006 | googleAuthAction | Always rememberMe=false | Valid credential | Sets token with rememberMe=false |

