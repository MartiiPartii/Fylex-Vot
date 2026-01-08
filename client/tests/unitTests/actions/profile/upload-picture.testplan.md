# Test Plan: upload-picture.test.ts

## Purpose of the Module

The `uploadPictureAction` server action orchestrates profile picture upload:
1. Calls API to upload picture
2. Revalidates profile page cache
3. Returns success response

This is a server action that coordinates between API calls, cache management, and response formatting.

## Public Functions

### `uploadPictureAction(previousState: unknown, formData: FormData): Promise<ServerActionResponse<void>>`
- **Description**: Handles profile picture upload
- **Dependencies**: 
  - `authUploadPicture` from `~/infrastructure/external`
  - `getToken` from `~/utils/authentication`
  - `decodeTokenPayload` from `~/services/auth-service`
  - `revalidateTag`, `revalidatePath` from `next/cache`
  - `createErrorResponse`, `createSuccessResponse` from `~/services/error-service`
- **Returns**: ServerActionResponse with void data or error

## Use Cases

### Happy Paths
1. Successful picture upload with cache revalidation
2. Upload with anonymous userId when token is missing

## Error Conditions

1. **API upload failure** - Returns error response with user-friendly message

## Domain/Business Rules

1. Cache is revalidated with user-specific tags
2. Uses anonymous userId when token is missing
3. Always revalidates /profile path
4. Errors are wrapped in user-friendly messages

## Expected Interactions

1. Calls `authUploadPicture` with FormData
2. Gets token and decodes payload for userId
3. Revalidates cache tags and paths
4. Returns success response

## Inputs, Outputs, and Side Effects

### Inputs
- `previousState`: Unknown (unused)
- `formData`: FormData with picture file

### Outputs
- ServerActionResponse with success: true and void data (on success)
- ServerActionResponse with success: false and error message (on failure)

### Side Effects
- Revalidates cache tags and paths

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | uploadPictureAction | Successful upload and cache revalidation | formData with picture | Uploads, revalidates cache, returns success |
| TC002 | uploadPictureAction | API call fails | formData with picture, API error | Returns error response |
| TC003 | uploadPictureAction | Missing token | formData with picture, no token | Uses anonymous userId for cache |

