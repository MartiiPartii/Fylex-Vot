/**
 * API Client Index
 * 
 * Central export point for all API client functions.
 * This allows importing from a single location while keeping
 * functions organized in separate feature files.
 */

// Auth API exports
export {
    authLogin,
    authRegister,
    authGoogleLogin,
    authGithubLogin,
    authGetProfile,
    authUploadPicture
} from "~/infrastructure/external/auth-api";

// Document API exports
export {
    documentList,
    documentGet,
    documentUpload
} from "~/infrastructure/external/document-api";

// Stats API exports
export {
    statsGet
} from "~/infrastructure/external/stats-api";

// Review API exports
export {
    reviewSubmit
} from "~/infrastructure/external/review-api";
