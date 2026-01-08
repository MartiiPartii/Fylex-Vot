# Test Plan: review-api.test.ts

## Purpose of the Module

The `review-api` module provides API client functions for review operations:
- Submit review

This is an infrastructure layer that constructs API requests for review endpoints.

## Public Functions

### `reviewSubmit(data: { stars: number; comment?: string }): Promise<unknown>`
- **Description**: Submits review to backend
- **Dependencies**: `httpRequest` from `~/infrastructure/http/fetch-client`
- **Returns**: Review response data

## Use Cases

### Happy Paths
1. Submit review with comment
2. Submit review without comment

## Error Conditions

1. **API errors** - Propagated from httpRequest

## Domain/Business Rules

1. Review endpoint uses POST method
2. Comment is optional
3. Stars must be between 1 and 5 (validated by schema, not API client)

## Expected Interactions

1. Constructs API request with review data
2. Calls httpRequest with POST method and JSON body
3. Returns API response

## Inputs, Outputs, and Side Effects

### Inputs
- Review data object with stars and optional comment

### Outputs
- Review response data

### Side Effects
- Makes HTTP request to backend

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | reviewSubmit | Call httpRequest with review data | {stars: 5, comment: "Great!"} | Calls httpRequest with /review endpoint |
| TC002 | reviewSubmit | Handle review without comment | {stars: 4} | Calls httpRequest with /review endpoint, no comment |

