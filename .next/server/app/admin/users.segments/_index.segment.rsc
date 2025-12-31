1:"$Sreact.fragment"
4:I[96923,["/_next/static/chunks/b1823f6d1bbacfff.js"],"Providers"]
5:I[39756,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/cf60cc4eb01bbf47.js"],"default"]
6:I[37457,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/cf60cc4eb01bbf47.js"],"default"]
:HL["/_next/static/chunks/32f766bffffe634a.css","style"]
:HL["/_next/static/chunks/d568f45abacfff76.css","style"]
:HL["https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css","style",{"crossOrigin":"anonymous"}]
:HL["/risivo-logo-white.png","image"]
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
0:{"buildId":"gk1-My7-LaAa1o5mURp_y","rsc":["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/32f766bffffe634a.css","precedence":"next"}],["$","link","1",{"rel":"stylesheet","href":"/_next/static/chunks/d568f45abacfff76.css","precedence":"next"}],["$","script","script-0",{"src":"/_next/static/chunks/b1823f6d1bbacfff.js","async":true}]],["$","html",null,{"lang":"en","suppressHydrationWarning":true,"children":[["$","head",null,{"children":[["$","link",null,{"rel":"preload","href":"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css","as":"style","crossOrigin":"anonymous"}],["$","link",null,{"href":"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css","rel":"stylesheet","crossOrigin":"anonymous"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$2"}}]]}],"$L3"]}]]}],"loading":null,"isPartial":false}
7:T4f3,
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
3:["$","body",null,{"className":"geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable poppins_39de20a3-module__8LurOG__variable antialiased","children":[["$","div",null,{"id":"risivo-initial-loader","suppressHydrationWarning":true,"children":[["$","img",null,{"src":"/risivo-logo-white.png","alt":"Loading...","className":"loader-logo","suppressHydrationWarning":true}],["$","div",null,{"className":"loader-dots","suppressHydrationWarning":true,"children":[["$","div",null,{"className":"loader-dot"}],["$","div",null,{"className":"loader-dot"}],["$","div",null,{"className":"loader-dot"}]]}],["$","p",null,{"className":"loader-text","suppressHydrationWarning":true,"children":"Loading..."}]]}],["$","$L4",null,{"children":["$","$L5",null,{"parallelRouterKey":"children","template":["$","$L6",null,{}],"notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]]}]}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$7"}}]]}]
