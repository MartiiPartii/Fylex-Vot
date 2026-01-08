# Test Plan: document-service.test.ts

## Purpose of the Module

The `document-service` module provides pure business logic for document processing operations. It handles:
- Parsing document analysis from JSON strings
- Calculating security scores from percentages
- Splitting document text into lines
- Processing raw document data into structured format

This is a pure domain logic layer with no side effects, HTTP requests, or framework dependencies.

## Public Functions

### `parseDocumentAnalysis(textAnalysis: string | undefined): ParsedDocumentAnalysis | null`
- **Description**: Parses document analysis from JSON string, extracting issues and counting threats
- **Dependencies**: None
- **Returns**: Parsed analysis object or null if invalid

### `calculateSecurityScore(percentage: number | undefined): number`
- **Description**: Calculates security score by rounding percentage to 2 decimal places
- **Dependencies**: None
- **Returns**: Rounded number (2 decimal places)

### `splitDocumentText(documentText: string | undefined): string[]`
- **Description**: Splits document text into array of lines by newline character
- **Dependencies**: None
- **Returns**: Array of text lines

### `processDocument(rawDocument): ProcessedDocument`
- **Description**: Orchestrates document processing by combining all three functions above
- **Dependencies**: `parseDocumentAnalysis`, `splitDocumentText`, `calculateSecurityScore`
- **Returns**: Processed document with issues, threats, textLines, and securityScore

## Use Cases

### Happy Paths
1. Parse valid document analysis JSON
2. Calculate security score from percentage
3. Split multi-line document text
4. Process complete document with all fields
5. Handle documents with partial data

## Error Conditions

1. **Invalid JSON in textAnalysis** - Returns null for parseDocumentAnalysis
2. **Missing textAnalysis** - Returns null
3. **Missing documentText** - Returns empty array
4. **Missing securityPercentage** - Defaults to 0
5. **Invalid JSON in processDocument** - Handles gracefully, returns undefined for issues

## Domain/Business Rules

1. Security scores are rounded to 2 decimal places
2. Undefined percentage defaults to 0
3. Empty or undefined documentText returns empty array
4. Invalid JSON in textAnalysis returns null
5. Missing analysis property results in undefined issues and 0 threats
6. Threats count equals the length of issues array (or 0 if issues is null/undefined)

## Expected Interactions

- No external dependencies (pure functions)
- Functions can be composed together in processDocument
- No side effects

## Inputs, Outputs, and Side Effects

### Inputs
- JSON strings for analysis parsing
- Numbers (or undefined) for security score calculation
- Strings (or undefined) for text splitting
- Raw document objects with optional fields

### Outputs
- ParsedDocumentAnalysis objects or null
- Numbers (rounded to 2 decimals)
- String arrays
- ProcessedDocument objects

### Side Effects
- None (pure functions)

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | parseDocumentAnalysis | Parse valid JSON analysis | Valid JSON string with analysis array | Returns parsed object with issues and threats count |
| TC002 | parseDocumentAnalysis | Parse undefined input | undefined | Returns null |
| TC003 | parseDocumentAnalysis | Parse empty string | Empty string | Returns null |
| TC004 | parseDocumentAnalysis | Parse invalid JSON | Invalid JSON string | Returns null |
| TC005 | parseDocumentAnalysis | Parse empty analysis array | JSON with empty analysis array | Returns object with empty issues and 0 threats |
| TC006 | parseDocumentAnalysis | Parse missing analysis property | JSON without analysis property | Returns object with undefined issues and 0 threats |
| TC007 | parseDocumentAnalysis | Parse null analysis | JSON with null analysis | Returns object with null issues and 0 threats |
| TC008 | calculateSecurityScore | Calculate score from percentage | 85.123456 | Returns 85.12 |
| TC009 | calculateSecurityScore | Calculate score from undefined | undefined | Returns 0 |
| TC010 | calculateSecurityScore | Calculate score from zero | 0 | Returns 0 |
| TC011 | calculateSecurityScore | Calculate score from 100 | 100 | Returns 100 |
| TC012 | calculateSecurityScore | Calculate score from negative | -10.567 | Returns -10.57 |
| TC013 | splitDocumentText | Split text by newlines | "Line 1\nLine 2\nLine 3" | Returns array of 3 lines |
| TC014 | splitDocumentText | Split undefined text | undefined | Returns empty array |
| TC015 | splitDocumentText | Split empty string | "" | Returns empty array |
| TC016 | splitDocumentText | Split text with multiple newlines | "Line 1\n\nLine 3" | Returns array with empty line |
| TC017 | splitDocumentText | Split single line | "Single line" | Returns array with one element |
| TC018 | processDocument | Process complete document | Document with all fields | Returns processed document with all data |
| TC019 | processDocument | Process empty document | Empty object | Returns document with defaults |
| TC020 | processDocument | Process document with only textAnalysis | Only textAnalysis field | Returns document with issues/threats only |
| TC021 | processDocument | Process document with only documentText | Only documentText field | Returns document with textLines only |
| TC022 | processDocument | Process document with only securityPercentage | Only securityPercentage field | Returns document with securityScore only |
| TC023 | processDocument | Process document with invalid textAnalysis | Invalid JSON in textAnalysis | Returns document with undefined issues, 0 threats |

