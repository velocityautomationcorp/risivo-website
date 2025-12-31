module.exports=[93695,(e,t,o)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,o)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,o)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,o)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,o)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,o)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,o)=>{t.exports=e.x("util",()=>require("util"))},54799,(e,t,o)=>{t.exports=e.x("crypto",()=>require("crypto"))},63021,(e,t,o)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},62294,e=>{"use strict";var t=e.i(63021);let o=globalThis.prisma??new t.PrismaClient({log:["error"]});e.s(["prisma",0,o])},15976,e=>{"use strict";function t(){return`
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
    `}}e.s(["getAdminDemoAccessedEmail",()=>a,"getAdminNewSignupEmail",()=>i,"getAdminVerifiedEmail",()=>n,"sendAdminNotification",()=>r])},2778,e=>{"use strict";var t=e.i(47909),o=e.i(74017),r=e.i(96250),i=e.i(59756),n=e.i(61916),a=e.i(74677),s=e.i(69741),d=e.i(16795),l=e.i(87718),c=e.i(95169),p=e.i(47587),m=e.i(66012),u=e.i(70101),x=e.i(26937),g=e.i(10372),f=e.i(93695);e.i(52474);var h=e.i(220),y=e.i(89171),b=e.i(93458),v=e.i(62294),w=e.i(15976),R=e.i(49632),A=e.i(24652);async function E(e){console.log("[Demo Investor Login] Request received");try{let{email:t,password:o}=await e.json();if(!t||!o)return y.NextResponse.json({success:!1,error:"Email and password are required"},{status:400});let r=t.toLowerCase().trim();if(!v.prisma)return y.NextResponse.json({success:!1,error:"Database not available"},{status:503});let i=await v.prisma.demoAccess.findUnique({where:{email:r}});if(!i)return y.NextResponse.json({success:!1,error:"Invalid email or password"},{status:401});if(!i.emailVerified)return y.NextResponse.json({success:!1,error:"Please verify your email first. Check your inbox for the verification link."},{status:403});if(!i.password)return y.NextResponse.json({success:!1,error:"This account was created by an admin. Please use the magic link sent to your email."},{status:403});if("revoked"===i.status)return y.NextResponse.json({success:!1,error:"Your demo access has been revoked. Please contact support."},{status:403});if("expired"===i.status||new Date>i.expiresAt)return y.NextResponse.json({success:!1,error:"Your demo access has expired. Please sign up again."},{status:403});if(!await R.default.compare(o,i.password))return y.NextResponse.json({success:!1,error:"Invalid email or password"},{status:401});let n=await v.prisma.demoAccess.update({where:{id:i.id},data:{lastAccessAt:new Date,lastUsedAt:new Date,accessCount:{increment:1},usageCount:{increment:1}}}),a=0===i.accessCount,s=(0,w.getAdminDemoAccessedEmail)({name:i.name,email:i.email,company:i.company||void 0,accessTime:new Date,accessCount:n.accessCount,isFirstAccess:a});try{await (0,w.sendAdminNotification)(s)?console.log("[Demo Investor Login] Admin notification sent successfully"):console.error("[Demo Investor Login] Admin notification failed to send")}catch(e){console.error("[Demo Investor Login] Failed to send admin notification:",e)}let d=process.env.NEXTAUTH_SECRET||process.env.AUTH_SECRET;if(!d)return y.NextResponse.json({success:!1,error:"Server configuration error"},{status:500});let l={id:`demo-${i.id}`,email:i.email,name:i.name,role:"demo",isMasterAdmin:!1,status:"active",agencyId:null,agencyName:"Demo",sub:`demo-${i.id}`},c=A.default.sign(l,d,{expiresIn:"7d"});console.log("[Demo Investor Login] Login successful for:",i.email);let p=await (0,b.cookies)();return p.set("__Secure-authjs.session-token",c,{httpOnly:!0,secure:!0,sameSite:"lax",path:"/",maxAge:604800}),p.set("demo_access_token",i.accessToken,{httpOnly:!0,secure:!0,sameSite:"lax",path:"/",maxAge:604800}),y.NextResponse.json({success:!0,user:{id:l.id,email:i.email,name:i.name,company:i.company}})}catch(e){return console.error("[Demo Investor Login] Error:",e),y.NextResponse.json({success:!1,error:"Failed to process login"},{status:500})}}e.s(["POST",()=>E,"dynamic",0,"force-dynamic","runtime",0,"nodejs"],35777);var C=e.i(35777);let k=new t.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/demo/investor-login/route",pathname:"/api/demo/investor-login",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/demo/investor-login/route.ts",nextConfigOutput:"",userland:C}),{workAsyncStorage:S,workUnitAsyncStorage:N,serverHooks:T}=k;function D(){return(0,r.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:N})}async function $(e,t,r){k.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/demo/investor-login/route";y=y.replace(/\/index$/,"")||"/";let b=await k.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!b)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:v,params:w,nextConfig:R,parsedUrl:A,isDraftMode:E,prerenderManifest:C,routerServerContext:S,isOnDemandRevalidate:N,revalidateOnlyGenerated:T,resolvedPathname:D,clientReferenceManifest:$,serverActionsManifest:j}=b,I=(0,s.normalizeAppPath)(y),P=!!(C.dynamicRoutes[I]||C.routes[D]),_=async()=>((null==S?void 0:S.render404)?await S.render404(e,t,A,!1):t.end("This page could not be found"),null);if(P&&!E){let e=!!C.routes[D],t=C.dynamicRoutes[I];if(t&&!1===t.fallback&&!e){if(R.experimental.adapterPath)return await _();throw new f.NoFallbackError}}let O=null;!P||k.isDev||E||(O="/index"===(O=D)?"/":O);let q=!0===k.isDev||!P,U=P&&!q;j&&$&&(0,a.setManifestsSingleton)({page:y,clientReferenceManifest:$,serverActionsManifest:j});let z=e.method||"GET",F=(0,n.getTracer)(),M=F.getActiveScopeSpan(),H={params:w,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:q,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:R.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,o,r,i)=>k.onRequestError(e,t,r,i,S)},sharedContext:{buildId:v}},L=new d.NodeNextRequest(e),V=new d.NodeNextResponse(t),B=l.NextRequestAdapter.fromNodeNextRequest(L,(0,l.signalFromNodeResponse)(t));try{let a=async e=>k.handle(B,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let o=F.getRootSpanAttributes();if(!o)return;if(o.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${o.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=o.get("next.route");if(r){let t=`${z} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${z} ${y}`)}),s=!!(0,i.getRequestMeta)(e,"minimalMode"),d=async i=>{var n,d;let l=async({previousCacheEntry:o})=>{try{if(!s&&N&&T&&!o)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await a(i);e.fetchMetrics=H.renderOpts.fetchMetrics;let d=H.renderOpts.pendingWaitUntil;d&&r.waitUntil&&(r.waitUntil(d),d=void 0);let l=H.renderOpts.collectedTags;if(!P)return await (0,m.sendResponse)(L,V,n,H.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,u.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let o=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,r=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:o,expire:r}}}}catch(t){throw(null==o?void 0:o.isStale)&&await k.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:N})},!1,S),t}},c=await k.handleResponse({req:e,nextConfig:R,cacheKey:O,routeKind:o.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:T,responseGenerator:l,waitUntil:r.waitUntil,isMinimalMode:s});if(!P)return null;if((null==c||null==(n=c.value)?void 0:n.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(d=c.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",N?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let f=(0,u.fromNodeOutgoingHttpHeaders)(c.value.headers);return s&&P||f.delete(g.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||f.get("Cache-Control")||f.set("Cache-Control",(0,x.getCacheControlHeader)(c.cacheControl)),await (0,m.sendResponse)(L,V,new Response(c.value.body,{headers:f,status:c.value.status||200})),null};M?await d(M):await F.withPropagatedContext(e.headers,()=>F.trace(c.BaseServerSpan.handleRequest,{spanName:`${z} ${y}`,kind:n.SpanKind.SERVER,attributes:{"http.method":z,"http.target":e.url}},d))}catch(t){if(t instanceof f.NoFallbackError||await k.onRequestError(e,t,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:N})},!1,S),P)throw t;return await (0,m.sendResponse)(L,V,new Response(null,{status:500})),null}}e.s(["handler",()=>$,"patchFetch",()=>D,"routeModule",()=>k,"serverHooks",()=>T,"workAsyncStorage",()=>S,"workUnitAsyncStorage",()=>N],2778)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__433c28f4._.js.map