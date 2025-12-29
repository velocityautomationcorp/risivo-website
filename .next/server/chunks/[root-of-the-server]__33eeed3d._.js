module.exports=[93695,(e,t,o)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,o)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,o)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,o)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,o)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,o)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},54799,(e,t,o)=>{t.exports=e.x("crypto",()=>require("crypto"))},29173,(e,t,o)=>{t.exports=e.x("@prisma/client",()=>require("@prisma/client"))},62294,e=>{"use strict";var t=e.i(29173);let o=globalThis.prisma??new t.PrismaClient({log:["error"]});e.s(["prisma",0,o])},15976,e=>{"use strict";function t(){return`
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
    `}}function d(e){let o=e.verifiedTime.toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZoneName:"short"});return{subject:`✅ Demo Verified: ${e.name} is now active`,html:`
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
    `}}function n(e){let o=e.accessTime.toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZoneName:"short"}),r=e.isFirstAccess?"🎉":"👋",i=e.isFirstAccess?"First Demo Access!":"Demo Accessed",d=e.isFirstAccess?"Investor logged in for the first time":`Access #${e.accessCount}`;return{subject:`${r} ${e.name} ${e.isFirstAccess?"accessed demo for the first time":"logged into demo"}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">${r} ${i}</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">${d}</p>
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
    `}}e.s(["getAdminDemoAccessedEmail",()=>n,"getAdminNewSignupEmail",()=>i,"getAdminVerifiedEmail",()=>d,"sendAdminNotification",()=>r])},87772,e=>{"use strict";e.s(["DEMO_SETTINGS",0,{EXPIRY_DAYS:30,MAX_ACTIVE_DEMOS:50,SAMPLE_CONTACTS_COUNT:150,SAMPLE_DEALS_COUNT:45,SAMPLE_PIPELINES_COUNT:3}])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__33eeed3d._.js.map