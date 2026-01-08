# Test Plan: middleware.test.ts

## Purpose of the Module

The `middleware` function handles route protection and authentication redirects:
- Redirects authenticated users away from auth pages (login, register, GitHub callback)
- Redirects unauthenticated users away from protected pages (dashboard, profile, upload, document)
- Allows access to public pages

This is Next.js middleware that runs on every request.

## Public Functions

### `middleware(request: NextRequest): NextResponse`
- **Description**: Middleware function for route protection
- **Dependencies**: 
  - `NextResponse` from `next/server`
- **Returns**: NextResponse (redirect or next)

## Use Cases

### Happy Paths
1. Authenticated user accesses protected page
2. Unauthenticated user accesses public page
3. Authenticated user redirected from auth pages
4. Unauthenticated user redirected from protected pages

## Error Conditions

None - middleware always returns a response

## Domain/Business Rules

1. Protected routes: `/dashboard`, `/document/[id]`, `/profile`, `/upload`
2. Auth routes: `/auth/github/callback`, `/login`, `/register`
3. Authenticated users on auth routes → redirect to `/dashboard`
4. Unauthenticated users on protected routes → redirect to `/login`
5. All other routes are allowed

## Expected Interactions

1. Checks for `token` cookie
2. Compares pathname against protected/auth route lists
3. Returns appropriate redirect or next response

## Inputs, Outputs, and Side Effects

### Inputs
- `request`: NextRequest with cookies and pathname

### Outputs
- NextResponse.redirect() for redirects
- NextResponse.next() for allowed access

### Side Effects
- None (pure routing logic)

## Test Case Matrix

| Test ID | Function | Description | Input | Expected Behavior |
|---------|----------|-------------|-------|-------------------|
| TC001 | middleware | Authenticated user on login page | Cookie present, pathname=/login | Redirects to /dashboard |
| TC002 | middleware | Unauthenticated user on dashboard | No cookie, pathname=/dashboard | Redirects to /login |
| TC003 | middleware | Authenticated user on dashboard | Cookie present, pathname=/dashboard | Allows access (next) |
| TC004 | middleware | Unauthenticated user on public page | No cookie, pathname=/ | Allows access (next) |
| TC005 | middleware | Authenticated user on register page | Cookie present, pathname=/register | Redirects to /dashboard |
| TC006 | middleware | Unauthenticated user on profile page | No cookie, pathname=/profile | Redirects to /login |

