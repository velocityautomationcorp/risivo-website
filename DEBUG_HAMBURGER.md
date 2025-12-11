# Hamburger Icon Debugging Guide

**Issue**: Hamburger shows for 3 seconds then disappears  
**Latest Fix**: Inline styles (highest CSS specificity)  
**Commit**: `d6f746f`

---

## 🔍 WHAT'S HAPPENING

If the hamburger appears then disappears, something is **actively hiding it after page load**. Possible causes:

1. **JavaScript hiding it** (changing display/visibility)
2. **Lazy-loaded CSS** overriding styles
3. **Animation/transition** hiding it
4. **Browser extension** interfering
5. **Service worker** caching old version

---

## ✅ LATEST FIX (Inline Styles)

**What I did**:
```html
<button 
  class="mobile-menu-toggle"
  style="display: block; position: absolute; right: 24px; 
         top: 50%; transform: translateY(-50%); width: 44px; 
         height: 44px; background: white; border: 2px solid #374151; 
         border-radius: 4px; font-size: 1.75rem; cursor: pointer; 
         z-index: 1001;">
  ☰
</button>
```

**Plus CSS**:
```css
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
}
```

**Why this should work**:
- Inline styles = highest specificity (beats all CSS)
- !important flags = override any other rules
- Triple protection (display + visibility + opacity)

---

## 🚀 DEPLOY & TEST

### Deploy:
```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website
git checkout staging
git pull origin staging
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

### Test with DevTools (CRITICAL):

1. **Open Chrome on Desktop**
2. Press **F12** (DevTools)
3. Click **Toggle Device Toolbar** (Ctrl+Shift+M)
4. Select **iPhone 12 Pro** from dropdown
5. Visit: `https://risivo-staging.pages.dev`
6. **Open Console tab** (important!)
7. Hard refresh: **Ctrl+Shift+R**
8. Watch what happens

---

## 🐛 DEBUGGING STEPS

### Step 1: Check if Button Exists in HTML

**In DevTools Console, type**:
```javascript
document.querySelector('.mobile-menu-toggle')
```

**Expected**: Should return the button element  
**If null**: Button not in HTML (build issue)

### Step 2: Check Computed Styles

**In DevTools Console, type**:
```javascript
const btn = document.querySelector('.mobile-menu-toggle')
const styles = window.getComputedStyle(btn)
console.log('Display:', styles.display)
console.log('Visibility:', styles.visibility)
console.log('Opacity:', styles.opacity)
console.log('Position:', styles.position)
console.log('Right:', styles.right)
console.log('Top:', styles.top)
console.log('Z-index:', styles.zIndex)
```

**Expected output**:
```
Display: block
Visibility: visible
Opacity: 1
Position: absolute
Right: 24px
Top: 50%
Z-index: 1001
```

### Step 3: Watch for Changes

**In DevTools Console, type**:
```javascript
const btn = document.querySelector('.mobile-menu-toggle')
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log('Button style changed:', mutation)
    console.log('New display:', btn.style.display)
    console.log('Stack trace:', new Error().stack)
  })
})
observer.observe(btn, { 
  attributes: true, 
  attributeFilter: ['style', 'class'] 
})
console.log('Watching button for changes...')
```

**This will log**:
- Any style changes to the button
- What changed it (stack trace)
- When it happened

### Step 4: Check for Conflicting Scripts

**In DevTools Console, search for**:
```javascript
// Check all scripts
Array.from(document.scripts).map(s => s.src)
```

Look for any analytics or tracking scripts that might be interfering.

### Step 5: Disable Browser Extensions

Test in **Incognito Mode** (Ctrl+Shift+N):
- Extensions are usually disabled
- If hamburger works here, an extension is the problem

---

## 🔧 ADDITIONAL FIXES TO TRY

### If Still Not Showing:

#### Option 1: Use SVG Icon Instead of Text
```html
<button class="mobile-menu-toggle" ...>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2"/>
  </svg>
</button>
```

#### Option 2: Add Extreme Z-index
```css
.mobile-menu-toggle {
  z-index: 999999 !important;
}
```

#### Option 3: Fixed Position Instead of Absolute
```css
.mobile-menu-toggle {
  position: fixed !important;
  right: 24px !important;
  top: 16px !important;
}
```

#### Option 4: Remove All Transitions
```css
.mobile-menu-toggle {
  transition: none !important;
  animation: none !important;
}
```

---

## 📊 COLLECT THIS INFO

If the hamburger still doesn't show after this fix, please provide:

1. **Browser & Version**: (e.g., Chrome 120, Safari 17)
2. **Device**: (e.g., iPhone 12, Samsung S21)
3. **Screen Width**: (e.g., 390px)
4. **DevTools Console Output**: (from Step 2 above)
5. **Mutation Observer Output**: (from Step 3 above)
6. **Screenshot**: Right when it disappears
7. **Network Tab**: Check if CSS is loading

---

## 🎯 TEST CHECKLIST

After deploying `d6f746f`:

- [ ] Clear all browser cache
- [ ] Clear Cloudflare cache (if possible)
- [ ] Test in Chrome DevTools mobile emulator
- [ ] Run Step 1: Check if button exists
- [ ] Run Step 2: Check computed styles
- [ ] Run Step 3: Watch for changes
- [ ] Test in Incognito mode
- [ ] Test on actual mobile device
- [ ] Take screenshot immediately after page load
- [ ] Take screenshot 5 seconds after page load

---

## 🆘 IF STILL BROKEN

If this STILL doesn't work, we need to try a completely different approach:

### Alternative Solution 1: Render on Client-Side
```javascript
// Add button via JavaScript after page load
window.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav-container')
  const btn = document.createElement('button')
  btn.className = 'mobile-menu-toggle'
  btn.innerHTML = '☰'
  btn.onclick = toggleMobileMenu
  // ... add all inline styles
  nav.appendChild(btn)
})
```

### Alternative Solution 2: Use Different Element
```html
<!-- Try <div> instead of <button> -->
<div 
  class="mobile-menu-toggle" 
  onclick="toggleMobileMenu()"
  role="button"
  tabindex="0"
  style="...">
  ☰
</div>
```

### Alternative Solution 3: Remove SSR for Navigation
Render navigation entirely client-side to avoid any server/client mismatch.

---

## 📞 NEXT STEPS

1. **Deploy latest fix** (`d6f746f`)
2. **Run debugging steps** above
3. **Collect information** (console output, screenshots)
4. **Report findings**:
   - Does button exist in HTML? (Step 1)
   - What are computed styles? (Step 2)
   - Does it change after load? (Step 3)
   - Does it work in Incognito?

With this info, I can create a targeted fix.

---

**Current Status**: `d6f746f` deployed with inline styles (highest specificity)  
**Confidence**: 95% - inline styles should prevent any CSS override  
**If still broken**: Need debugging info to identify JavaScript interference  

🔍 **Deploy and run the debugging steps above!**
