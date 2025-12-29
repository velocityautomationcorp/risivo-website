module.exports=[93695,(e,t,o)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,o)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,o)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,o)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,o)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,o)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,o)=>{t.exports=e.x("util",()=>require("util"))},54799,(e,t,o)=>{t.exports=e.x("crypto",()=>require("crypto"))},29173,(e,t,o)=>{t.exports=e.x("@prisma/client",()=>require("@prisma/client"))},62294,e=>{"use strict";var t=e.i(29173);let o=globalThis.prisma??new t.PrismaClient({log:["error"]});e.s(["prisma",0,o])},15976,e=>{"use strict";function t(){return`
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
      <p style="color: #999; font-size: 12px; text-align: center; margin: 0 0 10px 0;">
        <a href="https://risivo.com/terms-of-service" style="color: #666; text-decoration: none;">Terms of Service</a>
        &nbsp;|&nbsp;
        <a href="https://risivo.com/privacy-policy" style="color: #666; text-decoration: none;">Privacy Policy</a>
        &nbsp;|&nbsp;
        <a href="mailto:support@risivo.com" style="color: #666; text-decoration: none;">Contact Support</a>
      </p>
      <p style="color: #999; font-size: 11px; text-align: center; margin: 0;">
        \xa9 ${new Date().getFullYear()} Risivo™ by Velocity Automation Corp. All rights reserved.
      </p>
    </div>
  `}async function o(e){let t=process.env.SENDGRID_API_KEY;if(!t)return console.log("[Email] SendGrid not configured, logging email:"),console.log("To:",e.to),console.log("Subject:",e.subject),console.log("---"),!0;let o=Array.isArray(e.to)?e.to:[e.to];try{let r=await fetch("https://api.sendgrid.com/v3/mail/send",{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({personalizations:[{to:o.map(e=>({email:e})),subject:e.subject}],from:{email:e.fromEmail||process.env.SENDGRID_FROM_EMAIL||"hello@risivo.com",name:e.fromName||process.env.SENDGRID_FROM_NAME||"RISIVO CRM"},content:[{type:"text/html",value:e.html}],tracking_settings:{click_tracking:{enable:!1},open_tracking:{enable:!1}}})});if(!r.ok){let e=await r.text();return console.error("[Email] SendGrid error:",r.status,e),!1}return console.log("[Email] Sent successfully to:",e.to),!0}catch(e){return console.error("[Email] Error sending:",e),!1}}async function r(e){return o({to:"admin@risivo.com",subject:e.subject,html:e.html})}function i(e){let o=e.signupTime.toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZoneName:"short"});return{subject:`🆕 New Demo Signup: ${e.name} (Pending Verification)`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">🆕 New Demo Signup</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Pending Email Verification</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px 0;">Investor Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666; width: 120px;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">${e.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                <a href="mailto:${e.email}" style="color: #2563eb;">${e.email}</a>
              </td>
            </tr>
            ${e.company?`
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666;">Company:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${e.company}</td>
            </tr>
            `:""}
            ${e.phone?`
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666;">Phone:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${e.phone}</td>
            </tr>
            `:""}
            <tr>
              <td style="padding: 10px 0; color: #666;">Signup Time:</td>
              <td style="padding: 10px 0; font-size: 14px;">${o}</td>
            </tr>
          </table>
          
          <div style="margin-top: 25px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              ⏳ <strong>Status:</strong> Waiting for email verification. You'll be notified once they verify their email.
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://app.risivo.com/sub-account/platform-admin/demos" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">View in Demo Management</a>
          </div>
        </div>
        
        ${t()}
      </body>
      </html>
    `}}function n(e){let o=e.verifiedTime.toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZoneName:"short"});return{subject:`✅ Demo Verified: ${e.name} is now active`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">✅ Email Verified</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Demo Account Now Active</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px 0;">Investor Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666; width: 120px;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">${e.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                <a href="mailto:${e.email}" style="color: #2563eb;">${e.email}</a>
              </td>
            </tr>
            ${e.company?`
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666;">Company:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${e.company}</td>
            </tr>
            `:""}
            <tr>
              <td style="padding: 10px 0; color: #666;">Verified At:</td>
              <td style="padding: 10px 0; font-size: 14px;">${o}</td>
            </tr>
          </table>
          
          <div style="margin-top: 25px; padding: 15px; background: #d1fae5; border-radius: 8px; border-left: 4px solid #10b981;">
            <p style="margin: 0; color: #065f46; font-size: 14px;">
              ✅ <strong>Status:</strong> This investor has verified their email and set their password. They can now access the demo.
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://app.risivo.com/sub-account/platform-admin/demos" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">View in Demo Management</a>
          </div>
        </div>
        
        ${t()}
      </body>
      </html>
    `}}function a(e){let o=e.accessTime.toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZoneName:"short"}),r=e.isFirstAccess?"🎉":"👋",i=e.isFirstAccess?"First Demo Access!":"Demo Accessed",n=e.isFirstAccess?"Investor logged in for the first time":`Access #${e.accessCount}`;return{subject:`${r} ${e.name} ${e.isFirstAccess?"accessed demo for the first time":"logged into demo"}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">${r} ${i}</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">${n}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px 0;">Investor Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666; width: 120px;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">${e.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                <a href="mailto:${e.email}" style="color: #2563eb;">${e.email}</a>
              </td>
            </tr>
            ${e.company?`
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666;">Company:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${e.company}</td>
            </tr>
            `:""}
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666;">Access Time:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;">${o}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Total Logins:</td>
              <td style="padding: 10px 0; font-weight: 600; color: #2563eb;">${e.accessCount}</td>
            </tr>
          </table>
          
          ${e.isFirstAccess?`
          <div style="margin-top: 25px; padding: 15px; background: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              🎉 <strong>First Access!</strong> This investor is exploring the demo for the first time. Consider reaching out to offer assistance or answer questions.
            </p>
          </div>
          `:""}
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://app.risivo.com/sub-account/platform-admin/demos" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">View Demo Activity</a>
          </div>
        </div>
        
        ${t()}
      </body>
      </html>
    `}}e.s(["getAdminDemoAccessedEmail",()=>a,"getAdminNewSignupEmail",()=>i,"getAdminVerifiedEmail",()=>n,"sendAdminNotification",()=>r])},2778,e=>{"use strict";var t=e.i(47909),o=e.i(74017),r=e.i(96250),i=e.i(59756),n=e.i(61916),a=e.i(14444),s=e.i(37092),d=e.i(69741),l=e.i(16795),p=e.i(87718),c=e.i(95169),m=e.i(47587),u=e.i(66012),x=e.i(70101),g=e.i(26937),f=e.i(10372),h=e.i(93695);e.i(52474);var y=e.i(220),b=e.i(89171),v=e.i(93458),w=e.i(62294),R=e.i(15976),A=e.i(49632),E=e.i(24652);async function C(e){console.log("[Demo Investor Login] Request received");try{let{email:t,password:o}=await e.json();if(!t||!o)return b.NextResponse.json({success:!1,error:"Email and password are required"},{status:400});let r=t.toLowerCase().trim();if(!w.prisma)return b.NextResponse.json({success:!1,error:"Database not available"},{status:503});let i=await w.prisma.demoAccess.findUnique({where:{email:r}});if(!i)return b.NextResponse.json({success:!1,error:"Invalid email or password"},{status:401});if(!i.emailVerified)return b.NextResponse.json({success:!1,error:"Please verify your email first. Check your inbox for the verification link."},{status:403});if(!i.password)return b.NextResponse.json({success:!1,error:"This account was created by an admin. Please use the magic link sent to your email."},{status:403});if("revoked"===i.status)return b.NextResponse.json({success:!1,error:"Your demo access has been revoked. Please contact support."},{status:403});if("expired"===i.status||new Date>i.expiresAt)return b.NextResponse.json({success:!1,error:"Your demo access has expired. Please sign up again."},{status:403});if(!await A.default.compare(o,i.password))return b.NextResponse.json({success:!1,error:"Invalid email or password"},{status:401});let n=await w.prisma.demoAccess.update({where:{id:i.id},data:{lastAccessAt:new Date,lastUsedAt:new Date,accessCount:{increment:1},usageCount:{increment:1}}}),a=0===i.accessCount,s=(0,R.getAdminDemoAccessedEmail)({name:i.name,email:i.email,company:i.company||void 0,accessTime:new Date,accessCount:n.accessCount,isFirstAccess:a});try{await (0,R.sendAdminNotification)(s)?console.log("[Demo Investor Login] Admin notification sent successfully"):console.error("[Demo Investor Login] Admin notification failed to send")}catch(e){console.error("[Demo Investor Login] Failed to send admin notification:",e)}let d=process.env.NEXTAUTH_SECRET||process.env.AUTH_SECRET;if(!d)return b.NextResponse.json({success:!1,error:"Server configuration error"},{status:500});let l={id:`demo-${i.id}`,email:i.email,name:i.name,role:"demo",isMasterAdmin:!1,status:"active",agencyId:null,agencyName:"Demo",sub:`demo-${i.id}`},p=E.default.sign(l,d,{expiresIn:"7d"});console.log("[Demo Investor Login] Login successful for:",i.email);let c=await (0,v.cookies)();return c.set("__Secure-authjs.session-token",p,{httpOnly:!0,secure:!0,sameSite:"lax",path:"/",maxAge:604800}),c.set("demo_access_token",i.accessToken,{httpOnly:!0,secure:!0,sameSite:"lax",path:"/",maxAge:604800}),b.NextResponse.json({success:!0,user:{id:l.id,email:i.email,name:i.name,company:i.company}})}catch(e){return console.error("[Demo Investor Login] Error:",e),b.NextResponse.json({success:!1,error:"Failed to process login"},{status:500})}}e.s(["POST",()=>C,"dynamic",0,"force-dynamic","runtime",0,"nodejs"],35777);var S=e.i(35777);let k=new t.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/demo/investor-login/route",pathname:"/api/demo/investor-login",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/demo/investor-login/route.ts",nextConfigOutput:"",userland:S}),{workAsyncStorage:N,workUnitAsyncStorage:T,serverHooks:D}=k;function $(){return(0,r.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:T})}async function j(e,t,r){k.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let b="/api/demo/investor-login/route";b=b.replace(/\/index$/,"")||"/";let v=await k.prepare(e,t,{srcPage:b,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:w,params:R,nextConfig:A,parsedUrl:E,isDraftMode:C,prerenderManifest:S,routerServerContext:N,isOnDemandRevalidate:T,revalidateOnlyGenerated:D,resolvedPathname:$,clientReferenceManifest:j,serverActionsManifest:I}=v,P=(0,d.normalizeAppPath)(b),_=!!(S.dynamicRoutes[P]||S.routes[$]),O=async()=>((null==N?void 0:N.render404)?await N.render404(e,t,E,!1):t.end("This page could not be found"),null);if(_&&!C){let e=!!S.routes[$],t=S.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(A.experimental.adapterPath)return await O();throw new h.NoFallbackError}}let q=null;!_||k.isDev||C||(q="/index"===(q=$)?"/":q);let M=!0===k.isDev||!_,U=_&&!M;I&&j&&(0,a.setReferenceManifestsSingleton)({page:b,clientReferenceManifest:j,serverActionsManifest:I,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:I})});let z=e.method||"GET",F=(0,n.getTracer)(),H=F.getActiveScopeSpan(),L={params:R,prerenderManifest:S,renderOpts:{experimental:{authInterrupts:!!A.experimental.authInterrupts},cacheComponents:!!A.cacheComponents,supportsDynamicResponse:M,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:A.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,o,r)=>k.onRequestError(e,t,r,N)},sharedContext:{buildId:w}},V=new l.NodeNextRequest(e),B=new l.NodeNextResponse(t),K=p.NextRequestAdapter.fromNodeNextRequest(V,(0,p.signalFromNodeResponse)(t));try{let a=async e=>k.handle(K,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let o=F.getRootSpanAttributes();if(!o)return;if(o.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${o.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=o.get("next.route");if(r){let t=`${z} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${z} ${b}`)}),s=!!(0,i.getRequestMeta)(e,"minimalMode"),d=async i=>{var n,d;let l=async({previousCacheEntry:o})=>{try{if(!s&&T&&D&&!o)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await a(i);e.fetchMetrics=L.renderOpts.fetchMetrics;let d=L.renderOpts.pendingWaitUntil;d&&r.waitUntil&&(r.waitUntil(d),d=void 0);let l=L.renderOpts.collectedTags;if(!_)return await (0,u.sendResponse)(V,B,n,L.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,x.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[f.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let o=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,r=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:o,expire:r}}}}catch(t){throw(null==o?void 0:o.isStale)&&await k.onRequestError(e,t,{routerKind:"App Router",routePath:b,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:T})},N),t}},p=await k.handleResponse({req:e,nextConfig:A,cacheKey:q,routeKind:o.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:D,responseGenerator:l,waitUntil:r.waitUntil,isMinimalMode:s});if(!_)return null;if((null==p||null==(n=p.value)?void 0:n.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(d=p.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",T?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,x.fromNodeOutgoingHttpHeaders)(p.value.headers);return s&&_||c.delete(f.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,g.getCacheControlHeader)(p.cacheControl)),await (0,u.sendResponse)(V,B,new Response(p.value.body,{headers:c,status:p.value.status||200})),null};H?await d(H):await F.withPropagatedContext(e.headers,()=>F.trace(c.BaseServerSpan.handleRequest,{spanName:`${z} ${b}`,kind:n.SpanKind.SERVER,attributes:{"http.method":z,"http.target":e.url}},d))}catch(t){if(t instanceof h.NoFallbackError||await k.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:T})}),_)throw t;return await (0,u.sendResponse)(V,B,new Response(null,{status:500})),null}}e.s(["handler",()=>j,"patchFetch",()=>$,"routeModule",()=>k,"serverHooks",()=>D,"workAsyncStorage",()=>N,"workUnitAsyncStorage",()=>T],2778)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__65ec8def._.js.map