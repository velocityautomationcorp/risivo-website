module.exports=[89578,a=>{a.v({className:"geist_a71539c9-module__T19VSG__className",variable:"geist_a71539c9-module__T19VSG__variable"})},35214,a=>{a.v({className:"geist_mono_8d43a2aa-module__8Li5zG__className",variable:"geist_mono_8d43a2aa-module__8Li5zG__variable"})},41823,a=>{a.v({className:"poppins_39de20a3-module__8LurOG__className",variable:"poppins_39de20a3-module__8LurOG__variable"})},37257,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call Providers() from the server but Providers is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/app/providers.tsx <module evaluation>","Providers");a.s(["Providers",0,b])},4568,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call Providers() from the server but Providers is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/app/providers.tsx","Providers");a.s(["Providers",0,b])},88725,a=>{"use strict";a.i(37257);var b=a.i(4568);a.n(b)},33290,a=>{"use strict";var b=a.i(7997),c=a.i(89578);let d={className:c.default.className,style:{fontFamily:"'Geist', 'Geist Fallback'",fontStyle:"normal"}};null!=c.default.variable&&(d.variable=c.default.variable);var e=a.i(35214);let f={className:e.default.className,style:{fontFamily:"'Geist Mono', 'Geist Mono Fallback'",fontStyle:"normal"}};null!=e.default.variable&&(f.variable=e.default.variable);var g=a.i(41823);let h={className:g.default.className,style:{fontFamily:"'Poppins', 'Poppins Fallback'",fontStyle:"normal"}};null!=g.default.variable&&(h.variable=g.default.variable);var i=a.i(88725);let j=`
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
`,k=`
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
`;function l({children:a}){return(0,b.jsxs)("html",{lang:"en",suppressHydrationWarning:!0,children:[(0,b.jsxs)("head",{children:[(0,b.jsx)("link",{rel:"preload",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",as:"style",crossOrigin:"anonymous"}),(0,b.jsx)("link",{href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",rel:"stylesheet",crossOrigin:"anonymous"}),(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:j}})]}),(0,b.jsxs)("body",{className:`${d.variable} ${f.variable} ${h.variable} antialiased`,children:[(0,b.jsxs)("div",{id:"risivo-initial-loader",suppressHydrationWarning:!0,children:[(0,b.jsx)("img",{src:"/risivo-logo-white.png",alt:"Loading...",className:"loader-logo",suppressHydrationWarning:!0}),(0,b.jsxs)("div",{className:"loader-dots",suppressHydrationWarning:!0,children:[(0,b.jsx)("div",{className:"loader-dot"}),(0,b.jsx)("div",{className:"loader-dot"}),(0,b.jsx)("div",{className:"loader-dot"})]}),(0,b.jsx)("p",{className:"loader-text",suppressHydrationWarning:!0,children:"Loading..."})]}),(0,b.jsx)(i.Providers,{children:a}),(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:k}})]})]})}a.s(["default",()=>l,"metadata",0,{title:"RISIVO CRM - The Full AI-Powered CRM",description:"AI-powered multi-tenant SaaS CRM for modern agencies",icons:{icon:[{url:"/favicon.ico",sizes:"any"},{url:"/favicon-16x16.png",sizes:"16x16",type:"image/png"},{url:"/favicon-32x32.png",sizes:"32x32",type:"image/png"}],apple:[{url:"/apple-touch-icon.png",sizes:"180x180",type:"image/png"}],other:[{rel:"android-chrome-192x192",url:"/android-chrome-192x192.png"},{rel:"android-chrome-512x512",url:"/android-chrome-512x512.png"}]},manifest:"/site.webmanifest"}],33290)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__b437d2f9._.js.map