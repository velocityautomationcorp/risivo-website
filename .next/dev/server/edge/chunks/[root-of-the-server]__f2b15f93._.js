(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = /*#__PURE__*/ __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
/**
 * RISIVO CRM Middleware
 * 
 * Uses custom JWT verification to work with our custom login endpoint
 */ // Routes that require authentication
const PROTECTED_ROUTE_PREFIXES = [
    '/sub-account',
    '/admin',
    '/company',
    '/agency',
    '/dashboard',
    '/super-admin'
];
// Routes that are always public
const PUBLIC_ROUTES = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/demo/access',
    '/demo/signup',
    '/demo/verify',
    '/demo/login',
    '/demo/forgot-password',
    '/demo/reset-password',
    '/book'
];
// Demo users cannot access these routes
const DEMO_RESTRICTED_ROUTES = [
    '/sub-account/settings',
    '/sub-account/platform-admin',
    '/sub-account/settings/my-staff',
    '/sub-account/settings/business-profile',
    '/sub-account/settings/branding',
    '/sub-account/settings/import',
    '/company/settings',
    '/agency/settings'
];
// Redirect map from old admin paths to new platform-admin paths
const adminRedirects = {
    '/super-admin': '/sub-account/platform-admin',
    '/super-admin/agencies': '/sub-account/platform-admin/agencies',
    '/super-admin/settings': '/sub-account/platform-admin/settings',
    '/super-admin/settings/telephony': '/sub-account/platform-admin/settings/telephony',
    '/super-admin/settings/subscriptions': '/sub-account/platform-admin/settings/subscriptions',
    '/super-admin/billing': '/sub-account/platform-admin/billing',
    '/super-admin/analytics': '/sub-account/platform-admin/analytics',
    '/super-admin/health': '/sub-account/platform-admin/health',
    '/super-admin/logs': '/sub-account/platform-admin/logs',
    '/super-admin/features': '/sub-account/platform-admin/features',
    '/admin': '/sub-account/platform-admin',
    '/admin/overview': '/sub-account/platform-admin',
    '/admin/staff': '/sub-account/platform-admin/staff',
    '/admin/support': '/sub-account/platform-admin/support',
    '/admin/users': '/sub-account/platform-admin/users',
    '/admin/companies': '/sub-account/platform-admin/agencies',
    '/admin/newsletters': '/sub-account/platform-admin/newsletters',
    '/admin/settings': '/sub-account/platform-admin/settings',
    '/admin/settings/roles': '/sub-account/platform-admin/settings/roles',
    '/admin/settings/custom-fields': '/sub-account/platform-admin/settings/custom-fields',
    '/admin/settings/email-service': '/sub-account/platform-admin/settings/email-service'
};
// Simple JWT decode (no verification in middleware - just check if token exists and not expired)
function decodeJWT(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const decoded = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(payload, 'base64url').toString('utf-8'));
        // Check expiration
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return null // Token expired
            ;
        }
        return decoded;
    } catch  {
        return null;
    }
}
async function middleware(request) {
    const { pathname } = request.nextUrl;
    // Skip static files and API routes
    if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon') || pathname.startsWith('/api/') || pathname.includes('.')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Check for admin path redirects (only when ?no-redirect is not present)
    const noRedirect = request.nextUrl.searchParams.get('no-redirect');
    if (!noRedirect) {
        if (adminRedirects[pathname]) {
            const url = request.nextUrl.clone();
            url.pathname = adminRedirects[pathname];
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url, {
                status: 301
            });
        }
        for (const [oldPath, newPath] of Object.entries(adminRedirects)){
            if (pathname.startsWith(oldPath + '/')) {
                const remainingPath = pathname.slice(oldPath.length);
                const url = request.nextUrl.clone();
                url.pathname = newPath + remainingPath;
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url, {
                    status: 301
                });
            }
        }
    }
    // Handle locale prefixes
    const localePattern = /^\/(en|fr|es|de|pt|zh|ar|ja|ko|it|nl|ru|pl)(\/|$)/;
    if (localePattern.test(pathname)) {
        const newPath = pathname.replace(localePattern, '/');
        const url = request.nextUrl.clone();
        url.pathname = newPath || '/';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    // Check if route is public
    const isPublicRoute = PUBLIC_ROUTES.some((route)=>pathname === route || pathname.startsWith(route + '/'));
    if (isPublicRoute) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Check if route requires authentication
    const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((prefix)=>pathname.startsWith(prefix));
    if (isProtectedRoute) {
        // Get JWT from cookies - check both production and dev cookie names
        const prodCookie = request.cookies.get('__Secure-authjs.session-token')?.value;
        const devCookie = request.cookies.get('authjs.session-token')?.value;
        const tokenValue = prodCookie || devCookie;
        // Decode the token
        const token = tokenValue ? decodeJWT(tokenValue) : null;
        // Check for demo access token
        const demoToken = request.cookies.get('demo_access_token')?.value;
        // If no session and no demo token, redirect to signin
        if (!token && !demoToken) {
            const signinUrl = new URL('/auth/signin', request.url);
            signinUrl.searchParams.set('callbackUrl', pathname);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(signinUrl);
        }
        // Handle demo user restrictions
        const isDemo = token?.role === 'demo' || demoToken;
        if (isDemo) {
            const isRestrictedForDemo = DEMO_RESTRICTED_ROUTES.some((route)=>pathname.startsWith(route));
            if (isRestrictedForDemo) {
                const dashboardUrl = new URL('/sub-account/dashboard', request.url);
                dashboardUrl.searchParams.set('restricted', 'demo');
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(dashboardUrl);
            }
        }
        // Check user status
        if (token?.status === 'suspended') {
            const suspendedUrl = new URL('/auth/suspended', request.url);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(suspendedUrl);
        }
        // Add user info to headers for server components
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        if (token) {
            response.headers.set('x-user-id', String(token.id || ''));
            response.headers.set('x-user-role', String(token.role || ''));
            response.headers.set('x-user-email', String(token.email || ''));
            response.headers.set('x-agency-id', String(token.agencyId || ''));
            if (token.isMasterAdmin) {
                response.headers.set('x-is-master-admin', 'true');
            }
        }
        if (demoToken) {
            response.headers.set('x-demo-token', demoToken);
            response.headers.set('x-user-role', 'demo');
        }
        return response;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map