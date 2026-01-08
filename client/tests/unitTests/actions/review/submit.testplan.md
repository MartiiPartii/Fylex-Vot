# Test Plan: submit.test.ts

## Purpose of the Module

The `submitReviewAction` server action orchestrates review submission:
1. Validates review data using schema
2. Calls API to submit review
3. Returns success response

This is a server action that coordinates between validation, API calls, and response formatting.

## Public Functions

### `submitReviewAction(previousState: unknown, formData: FormData, stars: number): Promise<ServerActionResponse<unknown>>`
- **Description**: Handles review form submission
- **Dependencies**: 
  - `ReviewSchema` from `~/schemas/auth`
  - `reviewSubmit` from `~/infrastructure/external`
  - `createErrorResponse`, `createSuccessResponse` from `~/services/error-service`
- **Returns**: ServerActionResponse with review data or error

## Use Cases

### Happy Paths
1. Successful review submission with comment
2. Successful review submission without comment (empty string)

## Error Conditions

1. **Invalid stars (less than 1)** - Returns validation error
2. **Invalid stars (greater than 5)** - Returns validation error
3. **API submission failure** - Returns error response with user-friendly message

## Domain/Business Rules

1. Stars must be between 1 and 5 (inclusive)
2. Comment is optional (can be empty string)
3. FormData.get("comment") returns null when key doesn't exist, but Zod's optional() doesn't accept null
4. Errors are wrapped in user-friendly messages

## Expected Interactions

1. Extracts comment from FormData
2. Validates stars and comment using ReviewSchema
3. If validation fails, returns error response
4. If validation succeeds, calls `reviewSubmit` with validated data
5. Returns success response with API response

## Inputs, Outputs, and Side Effects

### Inputs
- `previousState`: Unknown (unused)
- `formData`: FormData with optional comment
- `stars`: Number (1-5)

### Outputs
- ServerActionResponse with success: true and review data (on success)
- ServerActionResponse with success: false and error message (on failure)

### Side Effects
- None (pure orchestration)

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | submitReviewAction | Successful submission with comment | formData with comment, stars=5 | Validates, calls API, returns success |
| TC002 | submitReviewAction | Invalid stars (less than 1) | stars=0 | Returns validation error, no API call |
| TC003 | submitReviewAction | Invalid stars (greater than 5) | stars=6 | Returns validation error, no API call |
| TC004 | submitReviewAction | Review without comment | formData with empty comment, stars=4 | Validates, calls API with empty comment, returns success |
| TC005 | submitReviewAction | API call fails | Valid data, API throws error | Returns error response |

