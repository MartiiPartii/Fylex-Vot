# Test Plan: auth-flow.test.ts

## Purpose of the Module

Integration test for the complete authentication flow, testing multiple layers together:
- Server action (loginAction)
- Service layer (validateLoginData, createErrorResponse)
- Infrastructure layer (httpRequest - mocked)
- Storage layer (setAuthToken - mocked via action)

This test verifies that the layers work together correctly in a real scenario.

## Test Scope

### Layers Tested Together
- Actions layer (real)
- Services layer (real)
- Infrastructure/HTTP layer (mocked - external service)

### Layers Mocked
- External API calls (httpRequest)
- Next.js navigation (redirect)
- Cookie storage (via action mocks)

## Use Cases

### Happy Paths
1. Complete login flow with valid credentials
2. Validation error handling without API call
3. API error handling with user-friendly messages

## Test Scenarios

1. **TC001**: Full login flow
   - Valid form data
   - API call succeeds
   - Redirect occurs
   - Verifies API was called with correct parameters

2. **TC002**: Validation error
   - Invalid form data
   - No API call made
   - Error response returned

3. **TC003**: API error
   - Valid form data
   - API call fails
   - User-friendly error returned

## Expected Behavior

- Real validation logic is used (not mocked)
- Real error handling logic is used (not mocked)
- External API is mocked
- Navigation is mocked
- Verifies correct data flow between layers

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | loginAction | Full login flow | Valid formData | Validates, calls API, redirects |
| TC002 | loginAction | Validation error | Invalid email | Returns error, no API call |
| TC003 | loginAction | API error | Valid formData, API fails | Returns user-friendly error |

