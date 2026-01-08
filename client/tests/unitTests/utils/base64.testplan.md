# Test Plan: base64.test.ts

## Purpose of the Module

The `base64` utils module provides base64 encoding and decoding utilities:
- Encode strings to base64
- Decode base64 strings back to original

This is a pure utility module with no side effects.

## Public Functions

### `encodeString(str: string): string`
- **Description**: Encodes a string to base64
- **Dependencies**: Node.js Buffer API
- **Returns**: Base64-encoded string

### `decodeString(str: string): string`
- **Description**: Decodes a base64 string to original string
- **Dependencies**: Node.js Buffer API
- **Returns**: Decoded string

## Use Cases

### Happy Paths
1. Encode regular strings
2. Encode strings with special characters
3. Encode JSON strings
4. Decode base64 strings
5. Round-trip encoding/decoding

## Error Conditions

1. **Empty strings** - Handled correctly (empty string encodes/decodes to empty string)

## Domain/Business Rules

1. Encoding uses UTF-8 encoding
2. Decoding uses UTF-8 decoding
3. Round-trip encoding/decoding should preserve original string
4. JSON strings can be encoded/decoded and parsed correctly

## Expected Interactions

- Uses Node.js Buffer API for encoding/decoding
- No external dependencies

## Inputs, Outputs, and Side Effects

### Inputs
- String to encode
- Base64 string to decode

### Outputs
- Base64-encoded string
- Decoded string

### Side Effects
- None (pure functions)

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | encodeString | Encode string to base64 | "Hello, World!" | Returns base64-encoded string |
| TC002 | encodeString | Encode empty string | "" | Returns empty string |
| TC003 | encodeString | Encode special characters | "Hello! @#$%^&*()" | Returns base64-encoded string |
| TC004 | encodeString | Encode JSON string | JSON.stringify({id, name}) | Returns base64-encoded JSON |
| TC005 | decodeString | Decode base64 string | Base64-encoded string | Returns original string |
| TC006 | decodeString | Decode empty string | "" | Returns empty string |
| TC007 | encodeString/decodeString | Round-trip encoding | String with special chars | Encodes and decodes to original |
| TC008 | encodeString/decodeString | Decode JSON string | Base64-encoded JSON | Decodes and parses to object |

