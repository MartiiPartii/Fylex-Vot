# Test Plan: fetch-client.test.ts

## Purpose of the Module

The `fetch-client` module provides low-level HTTP client functionality:
- Makes HTTP requests to backend API
- Handles authentication tokens
- Handles network errors and API errors

This is an infrastructure layer that wraps the native fetch API.

## Public Functions

### `httpRequest<T>(config: HttpRequestConfig): Promise<T>`
- **Description**: Makes HTTP request to backend server with authentication and error handling
- **Dependencies**: 
  - `getToken` from `~/utils/authentication`
  - `env.SERVER_BASE_URL` from `~/env`
  - Global `fetch` API
- **Returns**: Promise resolving to response data

## Use Cases

### Happy Paths
1. Successful GET request with token
2. Successful POST request with JSON body
3. Successful POST request with FormData
4. Request without token (unauthenticated)
5. Request with provided token (for cached functions)

## Error Conditions

1. **Non-ok response** - Throws FetchError with user-friendly message
2. **Network errors** - Throws FetchError with network error message
3. **Invalid JSON response** - Returns null

## Domain/Business Rules

1. Token is included in Authorization header when present
2. JSON body is stringified for POST requests with Content-Type: application/json
3. FormData is passed as-is for POST requests without JSON Content-Type
4. Network errors are caught and wrapped in FetchError

## Expected Interactions

1. Gets token from cookies (or uses provided token)
2. Constructs request URL from SERVER_BASE_URL
3. Adds Authorization header if token exists
4. Stringifies JSON body if Content-Type is application/json
5. Makes fetch request
6. Parses JSON response
7. Throws FetchError for non-ok responses

## Inputs, Outputs, and Side Effects

### Inputs
- URL path
- HTTP method
- Optional body (JSON or FormData)
- Optional headers
- Optional token (to avoid cookie access in cached functions)

### Outputs
- Response data (typed)
- Throws FetchError on failure

### Side Effects
- Makes HTTP requests to backend
- Logs request duration

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | httpRequest | Successful GET with token | GET request with token | Returns response data, includes Authorization header |
| TC002 | httpRequest | Successful POST with JSON | POST request with JSON body | Returns response data, stringifies body |
| TC003 | httpRequest | Request without token | GET request, no token | Returns response data, no Authorization header |
| TC004 | httpRequest | POST with FormData | POST request with FormData | Returns response data, passes FormData as-is |
| TC005 | httpRequest | Non-ok response | Request returns 400 | Throws FetchError |
| TC006 | httpRequest | Network error | Fetch fails | Throws FetchError with network message |
| TC007 | httpRequest | Use provided token | Request with provided token | Uses provided token, doesn't call getToken |
| TC008 | httpRequest | Response without JSON | Response with invalid JSON | Returns null |

