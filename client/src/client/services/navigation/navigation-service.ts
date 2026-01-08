"use client"

/**
 * Navigation Service
 * 
 * Browser-only navigation utilities.
 */

/**
 * Redirect to GitHub OAuth authorization page
 */
export function redirectToGitHubAuth(): void {
    if (typeof window === 'undefined') {
        throw new Error('Navigation service can only be used in the browser');
    }

    const clientID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientID) {
        throw new Error('GitHub client ID is not configured');
    }

    const redirectURI = `${window.location.origin}/auth/github/callback`;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
    window.location.href = authUrl;
}

