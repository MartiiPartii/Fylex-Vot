# Test Plan: upload.test.ts

## Purpose of the Module

The `uploadDocumentAction` server action orchestrates document upload:
1. Validates file (checks if provided)
2. Calls API to upload document
3. Revalidates cache (user-specific)
4. Redirects to document view page

This is a server action that coordinates between validation, API calls, cache management, and navigation.

## Public Functions

### `uploadDocumentAction(file: File | null): Promise<ServerActionResponse<Document>>`
- **Description**: Handles document file upload
- **Dependencies**: 
  - `documentUpload` from `~/infrastructure/external`
  - `getToken` from `~/utils/authentication`
  - `decodeTokenPayload` from `~/services/auth-service`
  - `encodeString` from `~/utils/base64`
  - `revalidateTag`, `revalidatePath` from `next/cache`
  - `createErrorResponse`, `isNextRedirect` from `~/services/error-service`
  - `redirect` from `next/navigation`
- **Returns**: ServerActionResponse (never returns on success, redirects instead)

## Use Cases

### Happy Paths
1. Successful document upload with redirect to document view
2. Upload with fallback to dashboard if encoding fails

## Error Conditions

1. **No file provided** - Returns error response
2. **API upload failure** - Returns error response with user-friendly message
3. **Next.js redirect errors** - Re-thrown (not caught)

## Domain/Business Rules

1. File must be provided (not null)
2. Cache is revalidated with user-specific tags
3. Document ID is base64-encoded for URL
4. If encoding fails, redirects to dashboard instead
5. Uses anonymous userId when token is missing

## Expected Interactions

1. Validates file is not null
2. Calls `documentUpload` with file
3. Gets token and decodes payload for userId
4. Revalidates cache tags and paths
5. Encodes document JSON for URL
6. Redirects to document view (or dashboard if encoding fails)

## Inputs, Outputs, and Side Effects

### Inputs
- `file`: File object or null

### Outputs
- ServerActionResponse with success: false and error message (on failure)
- Throws redirect error (on success)

### Side Effects
- Revalidates cache tags and paths
- Redirects to document view or dashboard on success

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | uploadDocumentAction | Successful upload | Valid file | Uploads, revalidates cache, redirects to document view |
| TC002 | uploadDocumentAction | No file provided | null | Returns error response, no API call |
| TC003 | uploadDocumentAction | API call fails | Valid file, API error | Returns error response |
| TC004 | uploadDocumentAction | Encoding fails | Valid file, encoding error | Redirects to dashboard instead |
| TC005 | uploadDocumentAction | Missing token | Valid file, no token | Uses anonymous userId for cache |

