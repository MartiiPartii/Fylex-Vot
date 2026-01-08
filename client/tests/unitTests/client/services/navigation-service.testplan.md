# Test Plan: navigation-service.test.ts

## Purpose of the Module

The `navigation-service` module provides browser-only navigation utilities:
- Redirects to GitHub OAuth authorization page

This is a client-side service that interacts with the browser window object.

## Public Functions

### `redirectToGitHubAuth(): void`
- **Description**: Redirects browser to GitHub OAuth authorization page
- **Dependencies**: 
  - `env.NEXT_PUBLIC_GITHUB_CLIENT_ID` from `~/env`
  - `window.location` (browser API)
- **Returns**: void (redirects browser)

## Use Cases

### Happy Paths
1. Successful redirect to GitHub OAuth URL with correct parameters

## Error Conditions

1. **Window is undefined** - Throws error (server-side usage)
2. **GitHub client ID not configured** - Throws error

## Domain/Business Rules

1. Can only be used in browser environment (window must exist)
2. GitHub client ID must be configured
3. Redirect URI is constructed from window.location.origin
4. OAuth URL format: `https://github.com/login/oauth/authorize?client_id={id}&redirect_uri={uri}`

## Expected Interactions

1. Checks if window is defined
2. Gets GitHub client ID from environment
3. Constructs redirect URI from window.location.origin
4. Sets window.location.href to GitHub OAuth URL

## Inputs, Outputs, and Side Effects

### Inputs
- None (no parameters)

### Outputs
- void (browser redirects)

### Side Effects
- Redirects browser to GitHub OAuth page

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | redirectToGitHubAuth | Redirect to GitHub OAuth URL | No input | Sets window.location.href to GitHub OAuth URL |
| TC002 | redirectToGitHubAuth | Window undefined error | window undefined | Throws error "Navigation service can only be used in the browser" |
| TC003 | redirectToGitHubAuth | Missing client ID | client ID empty | Throws error (tested via comment, requires module re-import) |

