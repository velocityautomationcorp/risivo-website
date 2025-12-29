module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},29173,(e,t,r)=>{t.exports=e.x("@prisma/client",()=>require("@prisma/client"))},62294,e=>{"use strict";var t=e.i(29173);let r=globalThis.prisma??new t.PrismaClient({log:["error"]});e.s(["prisma",0,r])},15976,e=>{"use strict";function t(){return`
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
  `}async function r(e){let t=process.env.SENDGRID_API_KEY;if(!t)return console.log("[Email] SendGrid not configured, logging email:"),console.log("To:",e.to),console.log("Subject:",e.subject),console.log("---"),!0;let r=Array.isArray(e.to)?e.to:[e.to];try{let o=await fetch("https://api.sendgrid.com/v3/mail/send",{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({personalizations:[{to:r.map(e=>({email:e})),subject:e.subject}],from:{email:e.fromEmail||process.env.SENDGRID_FROM_EMAIL||"hello@risivo.com",name:e.fromName||process.env.SENDGRID_FROM_NAME||"RISIVO CRM"},content:[{type:"text/html",value:e.html}],tracking_settings:{click_tracking:{enable:!1},open_tracking:{enable:!1}}})});if(!o.ok){let e=await o.text();return console.error("[Email] SendGrid error:",o.status,e),!1}return console.log("[Email] Sent successfully to:",e.to),!0}catch(e){return console.error("[Email] Error sending:",e),!1}}async function o(e){return r({to:"admin@risivo.com",subject:e.subject,html:e.html})}function i(e){let r=e.signupTime.toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZoneName:"short"});return{subject:`🆕 New Demo Signup: ${e.name} (Pending Verification)`,html:`
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
              <td style="padding: 10px 0; font-size: 14px;">${r}</td>
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
    `}}function a(e){let r=e.verifiedTime.toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZoneName:"short"});return{subject:`✅ Demo Verified: ${e.name} is now active`,html:`
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
              <td style="padding: 10px 0; font-size: 14px;">${r}</td>
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
    `}}function n(e){let r=e.accessTime.toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZoneName:"short"}),o=e.isFirstAccess?"🎉":"👋",i=e.isFirstAccess?"First Demo Access!":"Demo Accessed",a=e.isFirstAccess?"Investor logged in for the first time":`Access #${e.accessCount}`;return{subject:`${o} ${e.name} ${e.isFirstAccess?"accessed demo for the first time":"logged into demo"}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">${o} ${i}</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">${a}</p>
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
              <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;">${r}</td>
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
    `}}e.s(["getAdminDemoAccessedEmail",()=>n,"getAdminNewSignupEmail",()=>i,"getAdminVerifiedEmail",()=>a,"sendAdminNotification",()=>o])},29811,e=>{"use strict";var t=e.i(47909),r=e.i(74017),o=e.i(96250),i=e.i(59756),a=e.i(61916),n=e.i(14444),s=e.i(37092),d=e.i(69741),l=e.i(16795),p=e.i(87718),c=e.i(95169),m=e.i(47587),u=e.i(66012),x=e.i(70101),f=e.i(26937),g=e.i(10372),h=e.i(93695);e.i(52474);var y=e.i(220),b=e.i(89171),v=e.i(93458),w=e.i(62294),R=e.i(15976),A=e.i(49632),E=e.i(24652);async function S(e){try{let{searchParams:t}=new URL(e.url),r=t.get("token");if(!r)return b.NextResponse.json({valid:!1,error:"Verification token is required"},{status:400});if(!w.prisma)return b.NextResponse.json({valid:!1,error:"Database not available"},{status:503});let o=await w.prisma.demoAccess.findUnique({where:{verificationToken:r}});if(!o)return b.NextResponse.json({valid:!1,error:"Invalid or expired verification link"},{status:404});if(o.verificationSentAt&&Date.now()-new Date(o.verificationSentAt).getTime()>864e5)return b.NextResponse.json({valid:!1,error:"Verification link has expired. Please sign up again."},{status:410});if(o.emailVerified&&o.password)return b.NextResponse.json({valid:!0,alreadyVerified:!0,name:o.name,email:o.email,message:"Your email is already verified. Please log in."});return b.NextResponse.json({valid:!0,alreadyVerified:!1,name:o.name,email:o.email,company:o.company})}catch(e){return console.error("[Demo Verify GET] Error:",e),b.NextResponse.json({valid:!1,error:"Failed to verify token"},{status:500})}}async function k(e){console.log("[Demo Verify POST] Request received");try{let{token:t,password:r}=await e.json();if(!t||!r)return b.NextResponse.json({success:!1,error:"Token and password are required"},{status:400});if(r.length<8)return b.NextResponse.json({success:!1,error:"Password must be at least 8 characters long"},{status:400});if(!w.prisma)return b.NextResponse.json({success:!1,error:"Database not available"},{status:503});let o=await w.prisma.demoAccess.findUnique({where:{verificationToken:t}});if(!o)return b.NextResponse.json({success:!1,error:"Invalid or expired verification link"},{status:404});if(o.verificationSentAt&&Date.now()-new Date(o.verificationSentAt).getTime()>864e5)return b.NextResponse.json({success:!1,error:"Verification link has expired. Please sign up again."},{status:410});let i=await A.default.hash(r,12),a=await w.prisma.demoAccess.update({where:{id:o.id},data:{password:i,emailVerified:!0,verificationToken:null,status:"active",firstAccessAt:new Date}});console.log("[Demo Verify POST] Demo access activated:",a.id);let n=(0,R.getAdminVerifiedEmail)({name:a.name,email:a.email,company:a.company||void 0,verifiedTime:new Date});try{await (0,R.sendAdminNotification)(n)?console.log("[Demo Verify] Admin notification sent successfully"):console.error("[Demo Verify] Admin notification failed to send")}catch(e){console.error("[Demo Verify] Failed to send admin notification:",e)}let s=process.env.NEXTAUTH_SECRET||process.env.AUTH_SECRET;if(!s)return b.NextResponse.json({success:!1,error:"Server configuration error"},{status:500});let d={id:`demo-${a.id}`,email:a.email,name:a.name,role:"demo",isMasterAdmin:!1,status:"active",agencyId:null,agencyName:"Demo",sub:`demo-${a.id}`},l=E.default.sign(d,s,{expiresIn:"7d"}),p=await (0,v.cookies)();return p.set("__Secure-authjs.session-token",l,{httpOnly:!0,secure:!0,sameSite:"lax",path:"/",maxAge:604800}),p.set("demo_access_token",a.accessToken,{httpOnly:!0,secure:!0,sameSite:"lax",path:"/",maxAge:604800}),b.NextResponse.json({success:!0,message:"Your account has been verified and activated!",user:{id:d.id,email:a.email,name:a.name,company:a.company}})}catch(e){return console.error("[Demo Verify POST] Error:",e),b.NextResponse.json({success:!1,error:"Failed to verify account"},{status:500})}}e.s(["GET",()=>S,"POST",()=>k,"dynamic",0,"force-dynamic","runtime",0,"nodejs"],69263);var T=e.i(69263);let N=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/demo/verify/route",pathname:"/api/demo/verify",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/demo/verify/route.ts",nextConfigOutput:"",userland:T}),{workAsyncStorage:D,workUnitAsyncStorage:C,serverHooks:$}=N;function j(){return(0,o.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:C})}async function P(e,t,o){N.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let b="/api/demo/verify/route";b=b.replace(/\/index$/,"")||"/";let v=await N.prepare(e,t,{srcPage:b,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==o.waitUntil||o.waitUntil.call(o,Promise.resolve()),null;let{buildId:w,params:R,nextConfig:A,parsedUrl:E,isDraftMode:S,prerenderManifest:k,routerServerContext:T,isOnDemandRevalidate:D,revalidateOnlyGenerated:C,resolvedPathname:$,clientReferenceManifest:j,serverActionsManifest:P}=v,O=(0,d.normalizeAppPath)(b),_=!!(k.dynamicRoutes[O]||k.routes[$]),I=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,E,!1):t.end("This page could not be found"),null);if(_&&!S){let e=!!k.routes[$],t=k.dynamicRoutes[O];if(t&&!1===t.fallback&&!e){if(A.experimental.adapterPath)return await I();throw new h.NoFallbackError}}let q=null;!_||N.isDev||S||(q="/index"===(q=$)?"/":q);let V=!0===N.isDev||!_,M=_&&!V;P&&j&&(0,n.setReferenceManifestsSingleton)({page:b,clientReferenceManifest:j,serverActionsManifest:P,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:P})});let U=e.method||"GET",F=(0,a.getTracer)(),z=F.getActiveScopeSpan(),H={params:R,prerenderManifest:k,renderOpts:{experimental:{authInterrupts:!!A.experimental.authInterrupts},cacheComponents:!!A.cacheComponents,supportsDynamicResponse:V,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:A.cacheLife,waitUntil:o.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,o)=>N.onRequestError(e,t,o,T)},sharedContext:{buildId:w}},L=new l.NodeNextRequest(e),G=new l.NodeNextResponse(t),B=p.NextRequestAdapter.fromNodeNextRequest(L,(0,p.signalFromNodeResponse)(t));try{let n=async e=>N.handle(B,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let o=r.get("next.route");if(o){let t=`${U} ${o}`;e.setAttributes({"next.route":o,"http.route":o,"next.span_name":t}),e.updateName(t)}else e.updateName(`${U} ${b}`)}),s=!!(0,i.getRequestMeta)(e,"minimalMode"),d=async i=>{var a,d;let l=async({previousCacheEntry:r})=>{try{if(!s&&D&&C&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await n(i);e.fetchMetrics=H.renderOpts.fetchMetrics;let d=H.renderOpts.pendingWaitUntil;d&&o.waitUntil&&(o.waitUntil(d),d=void 0);let l=H.renderOpts.collectedTags;if(!_)return await (0,u.sendResponse)(L,G,a,H.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,x.toNodeOutgoingHttpHeaders)(a.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,o=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:o}}}}catch(t){throw(null==r?void 0:r.isStale)&&await N.onRequestError(e,t,{routerKind:"App Router",routePath:b,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:D})},T),t}},p=await N.handleResponse({req:e,nextConfig:A,cacheKey:q,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:k,isRoutePPREnabled:!1,isOnDemandRevalidate:D,revalidateOnlyGenerated:C,responseGenerator:l,waitUntil:o.waitUntil,isMinimalMode:s});if(!_)return null;if((null==p||null==(a=p.value)?void 0:a.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(d=p.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",D?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,x.fromNodeOutgoingHttpHeaders)(p.value.headers);return s&&_||c.delete(g.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,f.getCacheControlHeader)(p.cacheControl)),await (0,u.sendResponse)(L,G,new Response(p.value.body,{headers:c,status:p.value.status||200})),null};z?await d(z):await F.withPropagatedContext(e.headers,()=>F.trace(c.BaseServerSpan.handleRequest,{spanName:`${U} ${b}`,kind:a.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},d))}catch(t){if(t instanceof h.NoFallbackError||await N.onRequestError(e,t,{routerKind:"App Router",routePath:O,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:D})}),_)throw t;return await (0,u.sendResponse)(L,G,new Response(null,{status:500})),null}}e.s(["handler",()=>P,"patchFetch",()=>j,"routeModule",()=>N,"serverHooks",()=>$,"workAsyncStorage",()=>D,"workUnitAsyncStorage",()=>C],29811)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__c4c47bff._.js.map