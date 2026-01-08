# Test Plan: use-file-upload.test.ts

## Purpose of the Module

The `useFileUpload` hook manages file upload state and dropzone logic for the client. It:
- Manages loading and error state during file uploads
- Handles file drop acceptance and rejection
- Calls the upload document action
- Re-throws Next.js redirect errors (expected behavior)

This is a React hook that orchestrates file upload UI interactions.

## Public Functions

### `useFileUpload(): { loading, error, setError, onDropAccepted, onDropRejected }`
- **Description**: React hook for managing file upload state and handlers
- **Dependencies**: 
  - `uploadDocumentAction` from `~/actions/document`
  - `isNextRedirect` from `~/services/error-service`
- **Returns**: Object with loading state, error state, error setter, and drop handlers

## Use Cases

### Happy Paths
1. Initialize with default state (no loading, no error)
2. Handle file drop acceptance
3. Handle file drop rejection with appropriate error messages
4. Clear errors when new files are accepted

## Error Conditions

1. **Upload failure** - Sets error state with error message
2. **File too large rejection** - Sets specific error message with dynamic file size limit from environment variable
3. **Other rejection types** - Sets generic error message
4. **Next.js redirect errors** - Re-thrown (becomes unhandled rejection, expected behavior)

## Domain/Business Rules

1. Loading state is set to true during upload, false after completion
2. Error state is cleared when new files are accepted
3. File too large errors show specific message with dynamic file size limit from environment variable
4. Next.js redirects are re-thrown, not caught as regular errors
5. onDropAccepted calls sendFile for each file (async, not awaited)

## Expected Interactions

1. Calls `uploadDocumentAction` when file is dropped
2. Sets loading state during upload
3. Sets error state on failure (except redirects)
4. Re-throws redirect errors (becomes unhandled rejection in test environment)

## Inputs, Outputs, and Side Effects

### Inputs
- Files via `onDropAccepted` callback
- File rejections via `onDropRejected` callback

### Outputs
- Loading boolean state
- Error string state (or null)
- Callback functions for dropzone integration

### Side Effects
- Calls server action to upload files
- Redirects occur on successful upload (handled by Next.js)

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | useFileUpload | Initialize with default state | Hook initialization | Returns loading=false, error=null |
| TC002 | useFileUpload | Set loading during upload | File dropped | Sets loading=true during upload |
| TC003 | useFileUpload | Set error on upload failure | File dropped, upload fails | Sets error with failure message |
| TC004 | useFileUpload | Handle file too large rejection | File rejection with file-too-large code | Sets error with dynamic file size limit from environment variable |
| TC005 | useFileUpload | Handle other rejection types | File rejection with other code | Sets generic error message |
| TC006 | useFileUpload | Re-throw redirect errors | File dropped, redirect occurs | Re-throws redirect (unhandled rejection) |
| TC007 | useFileUpload | Clear error on new file | New file after error | Clears error state |
| TC008 | useFileUpload | Manual error setting | setError called | Sets error to specified value |

