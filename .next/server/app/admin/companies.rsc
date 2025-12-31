1:"$Sreact.fragment"
8:I[68027,[],"default"]
:HL["/_next/static/chunks/32f766bffffe634a.css","style"]
:HL["/_next/static/chunks/d568f45abacfff76.css","style"]
:HL["/_next/static/media/47fe1b7cd6e6ed85-s.p.855a563b.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/media/797e433ab948586e-s.p.dbea232f.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/media/8e6fa89aa22d24ec-s.p.3aec397d.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/media/a218039a3287bcfd-s.p.4a23d71b.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/media/caa3a2e1cccd8315-s.p.853070df.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/media/e2334d715941921e-s.p.d82a9aff.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css","style",{"crossOrigin":"anonymous"}]
2:Tc87,
(function() {
  try {
    // Find any cached theme (check common sub-account IDs)
    var subAccountIds = ['sub-001']; // Add more as needed
    var CACHE_TTL = 3600000; // 1 hour
    var themeApplied = false;
    
    for (var i = 0; i < subAccountIds.length; i++) {
      var id = subAccountIds[i];
      var cacheKey = 'risivo_theme_' + id;
      var timestampKey = cacheKey + '_timestamp';
      var cached = localStorage.getItem(cacheKey);
      var timestamp = localStorage.getItem(timestampKey);
      
      if (cached && timestamp && (Date.now() - parseInt(timestamp)) < CACHE_TTL) {
        var theme = JSON.parse(cached);
        var root = document.documentElement;
        
        // Apply critical CSS variables immediately
        var props = {
          '--theme-sidebar-bg': theme.sidebarBg,
          '--theme-sidebar-text': theme.sidebarText,
          '--theme-sidebar-hover': theme.sidebarHover,
          '--theme-sidebar-active': theme.sidebarActive,
          '--theme-sidebar-active-foreground': theme.sidebarActiveForeground,
          '--theme-primary': theme.primaryColor,
          '--theme-primary-hover': theme.primaryHover,
          '--theme-primary-foreground': theme.primaryForeground,
          '--theme-secondary': theme.secondaryColor,
          '--theme-secondary-hover': theme.secondaryHover,
          '--theme-button-primary-bg': theme.buttonPrimaryBg,
          '--theme-button-primary-text': theme.buttonPrimaryText,
          '--theme-background': theme.backgroundColor,
          '--theme-surface': theme.surfaceColor,
          '--theme-text-primary': theme.textPrimary,
          '--theme-text-secondary': theme.textSecondary,
          '--theme-text-muted': theme.textMuted,
          '--theme-border': theme.borderColor,
          '--theme-header-bg': theme.headerBg,
          '--theme-header-text': theme.headerText,
          '--theme-header-border': theme.headerBorder,
          '--theme-input-bg': theme.inputBg,
          '--theme-input-border': theme.inputBorder,
          '--theme-input-focus': theme.inputFocus,
          '--theme-input-text': theme.inputText,
          '--theme-success': theme.successColor,
          '--theme-warning': theme.warningColor,
          '--theme-error': theme.errorColor,
          '--theme-info': theme.infoColor
        };
        
        for (var prop in props) {
          if (props[prop]) root.style.setProperty(prop, props[prop]);
        }
        
        // Store for components and update loader logo
        window.__RISIVO_CACHED_THEME__ = theme;
        window.__RISIVO_THEME_APPLIED__ = true;
        themeApplied = true;
        
        // Update loader with cached theme colors and logo
        setTimeout(function() {
          var loader = document.getElementById('risivo-initial-loader');
          if (loader && theme.logoUrl) {
            var logoImg = loader.querySelector('.loader-logo');
            if (logoImg) logoImg.src = theme.logoUrl;
          }
        }, 0);
        
        break;
      }
    }
    
    // If theme was cached, hide loader faster (theme already applied)
    if (themeApplied) {
      window.__RISIVO_HIDE_LOADER_FAST__ = true;
    }
  } catch (e) {}
})();
0:{"P":null,"b":"gk1-My7-LaAa1o5mURp_y","c":["","admin","companies"],"q":"","i":false,"f":[[["",{"children":["admin",{"children":["companies",{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",true],[["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/32f766bffffe634a.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","link","1",{"rel":"stylesheet","href":"/_next/static/chunks/d568f45abacfff76.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","script","script-0",{"src":"/_next/static/chunks/b1823f6d1bbacfff.js","async":true,"nonce":"$undefined"}]],["$","html",null,{"lang":"en","suppressHydrationWarning":true,"children":[["$","head",null,{"children":[["$","link",null,{"rel":"preload","href":"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css","as":"style","crossOrigin":"anonymous"}],["$","link",null,{"href":"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css","rel":"stylesheet","crossOrigin":"anonymous"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$2"}}]]}],"$L3"]}]]}],{"children":["$L4",{"children":["$L5",{"children":["$L6",{},null,false,false]},null,false,false]},null,false,false]},null,false,false],"$L7",false]],"m":"$undefined","G":["$8",[]],"S":true}
9:I[96923,["/_next/static/chunks/b1823f6d1bbacfff.js"],"Providers"]
a:I[39756,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/cf60cc4eb01bbf47.js"],"default"]
b:I[37457,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/cf60cc4eb01bbf47.js"],"default"]
d:I[92825,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/cf60cc4eb01bbf47.js"],"ClientSegmentRoot"]
e:I[8374,["/_next/static/chunks/b1823f6d1bbacfff.js","/_next/static/chunks/76372ca902f39ac9.js"],"default"]
10:I[47257,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/cf60cc4eb01bbf47.js"],"ClientPageRoot"]
11:I[22876,["/_next/static/chunks/b1823f6d1bbacfff.js","/_next/static/chunks/76372ca902f39ac9.js","/_next/static/chunks/e33b7336345ae9bc.js"],"default"]
14:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/cf60cc4eb01bbf47.js"],"OutletBoundary"]
15:"$Sreact.suspense"
17:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/cf60cc4eb01bbf47.js"],"ViewportBoundary"]
19:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/cf60cc4eb01bbf47.js"],"MetadataBoundary"]
:HL["/risivo-logo-white.png","image"]
c:T4f3,
(function() {
  function hideLoader() {
    var loader = document.getElementById('risivo-initial-loader');
    if (!loader) return;
    
    function fadeAndHide() {
      // Use inline styles instead of classes to avoid hydration mismatch
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(function() {
        loader.style.display = 'none';
      }, 300);
    }
    
    // If theme was cached, hide immediately
    if (window.__RISIVO_HIDE_LOADER_FAST__) {
      fadeAndHide();
      return;
    }
    
    // Otherwise wait for theme to be applied by React
    // Maximum wait time of 2 seconds
    var maxWait = 2000;
    var startTime = Date.now();
    
    function checkTheme() {
      if (window.__RISIVO_THEME_APPLIED__ || Date.now() - startTime > maxWait) {
        fadeAndHide();
      } else {
        requestAnimationFrame(checkTheme);
      }
    }
    
    // Start checking once DOM is interactive
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(checkTheme, 100);
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(checkTheme, 100);
      });
    }
  }
  
  // Start hiding process
  hideLoader();
})();
3:["$","body",null,{"className":"geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable poppins_39de20a3-module__8LurOG__variable antialiased","children":[["$","div",null,{"id":"risivo-initial-loader","suppressHydrationWarning":true,"children":[["$","img",null,{"src":"/risivo-logo-white.png","alt":"Loading...","className":"loader-logo","suppressHydrationWarning":true}],["$","div",null,{"className":"loader-dots","suppressHydrationWarning":true,"children":[["$","div",null,{"className":"loader-dot"}],["$","div",null,{"className":"loader-dot"}],["$","div",null,{"className":"loader-dot"}]]}],["$","p",null,{"className":"loader-text","suppressHydrationWarning":true,"children":"Loading..."}]]}],["$","$L9",null,{"children":["$","$La",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$Lb",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$c"}}]]}]
4:["$","$1","c",{"children":[[["$","script","script-0",{"src":"/_next/static/chunks/76372ca902f39ac9.js","async":true,"nonce":"$undefined"}]],["$","$Ld",null,{"Component":"$e","slots":{"children":["$","$La",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$Lb",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]},"serverProvidedParams":{"params":{},"promises":["$@f"]}}]]}]
5:["$","$1","c",{"children":[null,["$","$La",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$Lb",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}]
6:["$","$1","c",{"children":[["$","$L10",null,{"Component":"$11","serverProvidedParams":{"searchParams":{},"params":"$4:props:children:1:props:serverProvidedParams:params","promises":["$@12","$@13"]}}],[["$","script","script-0",{"src":"/_next/static/chunks/e33b7336345ae9bc.js","async":true,"nonce":"$undefined"}]],["$","$L14",null,{"children":["$","$15",null,{"name":"Next.MetadataOutlet","children":"$@16"}]}]]}]
7:["$","$1","h",{"children":[null,["$","$L17",null,{"children":"$L18"}],["$","div",null,{"hidden":true,"children":["$","$L19",null,{"children":["$","$15",null,{"name":"Next.Metadata","children":"$L1a"}]}]}],["$","meta",null,{"name":"next-size-adjust","content":""}]]}]
f:"$4:props:children:1:props:serverProvidedParams:params"
12:{}
13:"$4:props:children:1:props:serverProvidedParams:params"
18:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
1b:I[27201,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/cf60cc4eb01bbf47.js"],"IconMark"]
16:null
1a:[["$","title","0",{"children":"RISIVO CRM - The Full AI-Powered CRM"}],["$","meta","1",{"name":"description","content":"AI-powered multi-tenant SaaS CRM for modern agencies"}],["$","link","2",{"rel":"manifest","href":"/site.webmanifest","crossOrigin":"$undefined"}],["$","link","3",{"rel":"icon","href":"/favicon.ico?favicon.2c428369.ico","sizes":"48x48","type":"image/x-icon"}],["$","link","4",{"rel":"icon","href":"/favicon.ico","sizes":"any"}],["$","link","5",{"rel":"icon","href":"/favicon-16x16.png","sizes":"16x16","type":"image/png"}],["$","link","6",{"rel":"icon","href":"/favicon-32x32.png","sizes":"32x32","type":"image/png"}],["$","link","7",{"rel":"apple-touch-icon","href":"/apple-touch-icon.png","sizes":"180x180","type":"image/png"}],["$","link","8",{"rel":"android-chrome-192x192","href":"/android-chrome-192x192.png"}],["$","link","9",{"rel":"android-chrome-512x512","href":"/android-chrome-512x512.png"}],["$","$L1b","10",{}]]
