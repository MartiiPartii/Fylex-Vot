# Test Plan: document-upload-flow.test.ts

## Purpose of the Module

Integration test for the complete document upload flow, testing multiple layers together:
- Server action (uploadDocumentAction)
- Service layer (decodeTokenPayload, encodeString)
- Infrastructure layer (httpRequest - mocked)
- Cache management (revalidateTag, revalidatePath - mocked)

This test verifies that the layers work together correctly in a real scenario.

## Test Scope

### Layers Tested Together
- Actions layer (real)
- Services layer (real - decodeTokenPayload, encodeString)
- Infrastructure/HTTP layer (mocked - external service)
- Cache layer (mocked - Next.js cache)

### Layers Mocked
- External API calls (httpRequest)
- Next.js cache operations
- Next.js navigation (redirect)
- Authentication utilities (getToken, decodeTokenPayload)

## Use Cases

### Happy Paths
1. Complete document upload flow with cache revalidation
2. Missing file error handling
3. API error handling with user-friendly messages

## Test Scenarios

1. **TC001**: Full upload flow
   - Valid file
   - API call succeeds
   - Cache revalidated
   - Redirect occurs
   - Verifies API was called correctly

2. **TC002**: Missing file error
   - null file
   - Returns error response
   - No API call made

3. **TC003**: API error
   - Valid file
   - API call fails
   - User-friendly error returned

## Expected Behavior

- Real validation logic is used (not mocked)
- Real encoding logic is used (not mocked)
- External API is mocked
- Cache operations are mocked
- Navigation is mocked
- Verifies correct data flow between layers

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | uploadDocumentAction | Full upload flow | Valid file | Uploads, revalidates cache, redirects |
| TC002 | uploadDocumentAction | Missing file error | null file | Returns error "No file provided", no API call |
| TC003 | uploadDocumentAction | API error | Valid file, API fails | Returns user-friendly error |

