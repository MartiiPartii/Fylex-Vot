# Test Plan: error-service.test.ts

## Purpose of the Module

The `error-service` module provides centralized error handling for server actions. It:
- Identifies Next.js redirect errors
- Extracts user-friendly error messages from various error types
- Filters out technical error messages
- Creates standardized error and success responses

This module ensures consistent error handling across all server actions.

## Public Functions

### `isNextRedirect(error: unknown): boolean`
- **Description**: Checks if an error is a Next.js redirect error
- **Dependencies**: None
- **Returns**: Boolean indicating if error is a Next.js redirect

### `extractErrorMessage(error: unknown, defaultMessage?: string): string`
- **Description**: Extracts user-friendly error message from various error types, filtering technical errors
- **Dependencies**: None
- **Returns**: User-friendly error message string

### `createErrorResponse<T>(error: unknown, defaultMessage?: string): ServerActionResponse<T>`
- **Description**: Creates standardized error response, re-throwing Next.js redirects
- **Dependencies**: `isNextRedirect`, `extractErrorMessage`
- **Returns**: ServerActionResponse with success: false and error message

### `createSuccessResponse<T>(data: T): ServerActionResponse<T>`
- **Description**: Creates standardized success response
- **Dependencies**: None
- **Returns**: ServerActionResponse with success: true and data

## Use Cases

### Happy Paths
1. Identify Next.js redirect errors correctly
2. Extract user-friendly messages from FetchError responses
3. Extract user-friendly messages from standard Error objects
4. Create standardized error responses
5. Create standardized success responses

## Error Conditions

1. **Technical errors** - Filtered out, replaced with default message
2. **Unknown error types** - Use default message
3. **Next.js redirects** - Re-thrown (not returned as error response)
4. **Missing error messages** - Use default message

## Domain/Business Rules

1. Next.js redirects have digest starting with "NEXT_REDIRECT"
2. Technical error patterns should be hidden from users:
   - fetch failed, Failed to fetch
   - Network error, NetworkError
   - TypeError
   - Request failed, Connection errors
   - ECONNREFUSED, ENOTFOUND
   - Timeout errors
3. FetchError format: `{ response: { data: { error: string } } }`
4. Next.js redirects should be re-thrown, not returned as error responses
5. Always return default message for technical errors or unknown errors

## Expected Interactions

- No external dependencies
- Pure functions with no side effects
- Used by server actions for error handling

## Inputs, Outputs, and Side Effects

### Inputs
- Unknown error types
- Optional default message strings
- Data of any type for success responses

### Outputs
- Boolean for redirect detection
- String error messages
- ServerActionResponse objects

### Side Effects
- None (pure functions, except createErrorResponse which throws redirects)

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | isNextRedirect | Next.js redirect with NEXT_REDIRECT digest | Error with NEXT_REDIRECT digest | Returns true |
| TC002 | isNextRedirect | Error without digest | Standard Error | Returns false |
| TC003 | isNextRedirect | Error with non-NEXT_REDIRECT digest | Error with other digest | Returns false |
| TC004 | isNextRedirect | Null/undefined error | null/undefined | Returns false |
| TC005 | isNextRedirect | Non-object error | String | Returns false |
| TC006 | extractErrorMessage | Extract from FetchError | FetchError with data.error | Returns error message |
| TC007 | extractErrorMessage | Extract from Error | Standard Error | Returns error message |
| TC008 | extractErrorMessage | Technical error in FetchError | FetchError with technical error | Returns default message |
| TC009 | extractErrorMessage | Technical error in Error | Error with technical message | Returns default message |
| TC010 | extractErrorMessage | Unknown error type | Object without message | Returns default message |
| TC011 | extractErrorMessage | Null/undefined error | null/undefined | Returns default message |
| TC012 | extractErrorMessage | FetchError without data.error | FetchError with empty data | Returns default message |
| TC013 | extractErrorMessage | Various technical error patterns | Multiple technical error strings | All return default message |
| TC014 | createErrorResponse | Create error response | Error with message | Returns error response with message |
| TC015 | createErrorResponse | Create error response for technical error | Technical error | Returns error response with default |
| TC016 | createErrorResponse | Next.js redirect in createErrorResponse | Redirect error | Throws error |
| TC017 | createErrorResponse | Error without message | Empty object | Returns error response with default |
| TC018 | createSuccessResponse | Create success response | Data object | Returns success response with data |
| TC019 | createSuccessResponse | Create success response with null | null | Returns success response with null |
| TC020 | createSuccessResponse | Create success response with undefined | undefined | Returns success response with undefined |

