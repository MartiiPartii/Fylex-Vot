# Testing Strategy

This directory contains the comprehensive testing suite for the Fylex client application, following a layered architecture testing approach.

## Test Structure

```
tests/
├── setup.ts                          # Global test configuration
├── unitTests/                        # Unit tests (isolated, mocked dependencies)
│   ├── actions/                      # Server actions tests
│   ├── services/                     # Business logic tests
│   ├── infrastructure/               # Infrastructure layer tests
│   ├── client/                       # Client-side tests
│   ├── utils/                        # Utility function tests
│   └── middleware.test.ts            # Middleware tests
└── integrationTests/                 # Integration tests (multiple layers)
```

## Testing Principles

### Layered Architecture Testing
- Each layer tests its own responsibilities
- Lower layers are treated as "trusted primitives" (mocked, not re-tested)
- Each layer only tests its orchestration/coordination logic

### Test Organization
- Test directory structure mirrors source code structure
- Each test file has a corresponding `.testplan.md` file documenting the test specification
- Test cases are numbered (TC001, TC002, etc.) and referenced in test plans

### Test Types

#### Unit Tests
- Test individual modules in isolation
- All dependencies are mocked
- Fast execution
- Located in `tests/unitTests/`

#### Integration Tests
- Test multiple layers together
- Use real implementations of internal layers
- Only external services are mocked
- Located in `tests/integrationTests/`

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests Once (CI mode)
```bash
npm run test:run
```

## Test Coverage

The test suite covers:

### Services Layer
- ✅ `auth-service` - Authentication validation and token utilities
- ✅ `error-service` - Error handling and response formatting
- ✅ `document-service` - Document processing logic

### Actions Layer
- ✅ `auth/login` - Login server action
- ✅ `auth/register` - Registration server action
- ✅ `auth/oauth` - OAuth authentication actions
- ✅ `auth/logout` - Logout server action
- ✅ `document/upload` - Document upload action
- ✅ `profile/upload-picture` - Profile picture upload action
- ✅ `review/submit` - Review submission action

### Infrastructure Layer
- ✅ `http/fetch-client` - HTTP request client
- ✅ `external/auth-api` - Authentication API client
- ✅ `external/document-api` - Document API client
- ✅ `external/review-api` - Review API client
- ✅ `storage/cookie-storage` - Cookie management

### Client Layer
- ✅ `state/use-file-upload` - File upload hook with **dynamic file size limit** (configured via `NEXT_PUBLIC_MAX_FILE_SIZE` environment variable)
- ✅ `services/navigation-service` - Navigation utilities

### Utilities
- ✅ `base64` - Base64 encoding/decoding
- ✅ `authentication` - Authentication utilities

### Middleware
- ✅ Route protection and authentication redirects

### Integration Tests
- ✅ Authentication flow
- ✅ Document upload flow
- ✅ Error handling flow

## Test Plan Documentation

Each test file has a corresponding `.testplan.md` file that documents:
- Purpose of the module
- Public functions and their dependencies
- Use cases (happy paths)
- Error conditions
- Domain/business rules
- Expected interactions
- Inputs, outputs, and side effects
- Test case matrix mapping test IDs to descriptions

## Writing New Tests

When adding new tests:

1. **Create test file** in the appropriate directory matching source structure
2. **Create test plan** (`.testplan.md`) documenting the test specification
3. **Number test cases** (TC001, TC002, etc.)
4. **Mock dependencies** before imports
5. **Follow Arrange-Act-Assert** pattern
6. **Use real implementations** in integration tests (except external services)

### Example Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("~/path/to/dependency", () => ({
  functionName: vi.fn(),
}));

// Import after mocks
import { functionUnderTest } from "~/path/to/module";
import { functionName } from "~/path/to/dependency";

describe("moduleName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: should do something when condition is met", async () => {
    // Arrange
    const mockData = { /* ... */ };
    vi.mocked(functionName).mockResolvedValue(mockData);

    // Act
    const result = await functionUnderTest(input);

    // Assert
    expect(result).toEqual(expected);
    expect(functionName).toHaveBeenCalledWith(expectedArgs);
  });
});
```

## Configuration

- **Framework**: Vitest
- **Environment**: jsdom for client tests, node for server tests
- **Path Aliases**: Configured to match `tsconfig.json` (`~/*` → `./src/*`)
- **Setup**: `tests/setup.ts` contains global mocks for Next.js modules

### Environment Variables for Testing

When testing file upload functionality, the `NEXT_PUBLIC_MAX_FILE_SIZE` environment variable is mocked in tests. The test suite mocks this to `5` (MB) by default to ensure consistent test behavior. The actual application uses this environment variable to configure the maximum file upload size dynamically.

## Notes

- UI components (React components) are not tested - only client actions/state that drive them
- Database schema/ORM internals are treated as trusted primitives
- Framework internals (Next.js, React) are mocked as needed
- External services are mocked in all tests (unit and integration)
- Third-party library internals are mocked via their interfaces

