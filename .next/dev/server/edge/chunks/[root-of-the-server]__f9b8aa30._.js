(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f9b8aa30._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/ [middleware-edge] (unsupported edge import 'http', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`http`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'crypto', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`crypto`));
}),
"[externals]/node:assert [external] (node:assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:assert", () => require("node:assert"));

module.exports = mod;
}),
"[project]/ [middleware-edge] (unsupported edge import 'querystring', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`querystring`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'https', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`https`));
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[project]/auth.config.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * RISIVO CRM - Auth.js Configuration (Edge Compatible)
 * 
 * This file contains the configuration that can run on the Edge.
 * It does NOT include the Prisma adapter (which is not edge-compatible).
 * 
 * Used by: middleware.ts
 * 
 * IMPORTANT: This config is ONLY for session validation in middleware.
 * Actual credential verification happens in auth.ts via the API route.
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = {
    providers: [],
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signin',
        error: '/auth/signin'
    },
    callbacks: {
        // Allow the signin page and api routes to always be accessible
        authorized ({ request, auth }) {
            const { pathname } = request.nextUrl;
            // Always allow API routes
            if (pathname.startsWith('/api/')) {
                return true;
            }
            // Always allow auth pages
            if (pathname.startsWith('/auth/')) {
                return true;
            }
            // Always allow public pages
            if (pathname === '/' || pathname.startsWith('/demo/')) {
                return true;
            }
            // Protected routes need a session
            const isProtected = [
                '/sub-account',
                '/admin',
                '/company',
                '/agency',
                '/dashboard',
                '/super-admin'
            ].some((prefix)=>pathname.startsWith(prefix));
            if (isProtected) {
                return !!auth;
            }
            return true;
        }
    },
    session: {
        strategy: 'jwt'
    },
    trustHost: true,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
};
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/auth.config.ts [middleware-edge] (ecmascript)");
;
;
;
/**
 * RISIVO CRM Middleware
 * 
 * Auth.js v5 compatible middleware
 */ const { auth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"]);
// Routes that require authentication
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
    '/book',
    '/api/'
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
const __TURBOPACK__default__export__ = auth(async function middleware(request) {
    const { pathname } = request.nextUrl;
    // Skip static files
    if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon') || pathname.includes('.')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Check for admin path redirects (only when ?no-redirect is not present)
    const noRedirect = request.nextUrl.searchParams.get('no-redirect');
    if (!noRedirect) {
        // Check exact matches first
        if (adminRedirects[pathname]) {
            const url = request.nextUrl.clone();
            url.pathname = adminRedirects[pathname];
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url, {
                status: 301
            });
        }
        // Check for path prefixes
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
    const isPublicRoute = PUBLIC_ROUTES.some((route)=>pathname === route || pathname.startsWith(route + '/') || pathname.startsWith(route));
    if (isPublicRoute) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Check if route requires authentication
    const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((prefix)=>pathname.startsWith(prefix));
    if (isProtectedRoute) {
        // Auth.js v5 provides the session via request.auth
        const session = request.auth;
        // Check for demo access token in cookies
        const demoToken = request.cookies.get('demo_access_token')?.value;
        // If no regular session and no demo token, redirect to signin
        if (!session && !demoToken) {
            const signinUrl = new URL('/auth/signin', request.url);
            signinUrl.searchParams.set('callbackUrl', pathname);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(signinUrl);
        }
        // Handle demo user restrictions
        const isDemo = session?.user?.role === 'demo' || demoToken;
        if (isDemo) {
            const isRestrictedForDemo = DEMO_RESTRICTED_ROUTES.some((route)=>pathname.startsWith(route));
            if (isRestrictedForDemo) {
                const dashboardUrl = new URL('/sub-account/dashboard', request.url);
                dashboardUrl.searchParams.set('restricted', 'demo');
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(dashboardUrl);
            }
        }
        // Check user status
        if (session?.user?.status === 'suspended') {
            const suspendedUrl = new URL('/auth/suspended', request.url);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(suspendedUrl);
        }
        // Add user info to headers for server components
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        if (session?.user) {
            response.headers.set('x-user-id', session.user.id || '');
            response.headers.set('x-user-role', session.user.role || '');
            response.headers.set('x-user-email', session.user.email || '');
            response.headers.set('x-agency-id', session.user.agencyId || '');
            if (session.user.isMasterAdmin) {
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
});
const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f9b8aa30._.js.map