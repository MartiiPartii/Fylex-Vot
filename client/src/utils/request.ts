export function summarizeResponse(data: unknown): unknown {
    if (data == null) return null;

    if (Array.isArray(data)) {
        return {
            type: 'array',
            length: data.length,
        };
    }

    if (typeof data === 'object') {
        const keys = Object.keys(data as Record<string, unknown>);
        return {
            type: 'object',
            keys,
        };
    }

    // Primitives (string/number/boolean) – log type only
    return {
        type: typeof data,
    };
}


export function summarizeRequestBody(body: unknown): unknown {
    if (!body) return undefined;

    if (body instanceof FormData) {
        // Avoid logging field names/values
        return '[FormData body]';
    }

    if (typeof body === 'string') {
        // Likely JSON or text payload – don't parse or log contents
        return '[String body]';
    }

    // Fallback for other body types (Blob, ArrayBuffer, etc.)
    return '[Binary/Unknown body]';
}