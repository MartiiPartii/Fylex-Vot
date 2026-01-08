# Test Plan: document-api.test.ts

## Purpose of the Module

The `document-api` module provides API client functions for document operations:
- List documents
- Get single document
- Upload document

This is an infrastructure layer that constructs API requests for document endpoints.

## Public Functions

### `documentList(): Promise<Document[]>`
- **Description**: Gets list of user's documents with caching
- **Dependencies**: `httpRequest`, `getToken`, `decodeTokenPayload`, `unstable_cache`
- **Returns**: Array of Document objects

### `documentGet(id: string): Promise<Document>`
- **Description**: Gets single document by ID with caching
- **Dependencies**: `httpRequest`, `getToken`, `decodeTokenPayload`, `unstable_cache`
- **Returns**: Document object

### `documentUpload(file: File): Promise<Document>`
- **Description**: Uploads document file
- **Dependencies**: `httpRequest` from `~/infrastructure/http/fetch-client`
- **Returns**: Document object

## Use Cases

### Happy Paths
1. List documents with user-specific caching
2. Get document with user-specific caching
3. Upload document file

## Error Conditions

1. **API errors** - Propagated from httpRequest
2. **Missing token** - Uses anonymous userId for caching

## Domain/Business Rules

1. List and Get endpoints use GET method with caching
2. Upload endpoint uses POST method with FormData
3. Cache keys are user-specific
4. Anonymous userId is used when token is missing
5. Token is passed to cached function to avoid cookie access

## Expected Interactions

1. Gets token and decodes payload for userId
2. Constructs API request with correct URL, method, body
3. For list/get, uses unstable_cache with user-specific key
4. For upload, creates FormData with file
5. Calls httpRequest with constructed config

## Inputs, Outputs, and Side Effects

### Inputs
- Document ID (for get)
- File object (for upload)

### Outputs
- Document objects or arrays
- Cached responses for list/get

### Side Effects
- Makes HTTP requests to backend
- Caches document data

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | documentList | Call httpRequest with user-specific cache | Token present | Calls httpRequest with /document, uses user cache |
| TC002 | documentList | Use anonymous userId | Token missing | Calls httpRequest with token=null, uses anonymous cache |
| TC003 | documentGet | Call httpRequest with document ID | Document ID, token present | Calls httpRequest with /document/{id}, uses user cache |
| TC004 | documentUpload | Call httpRequest with FormData | File object | Calls httpRequest with /document POST, FormData body |

