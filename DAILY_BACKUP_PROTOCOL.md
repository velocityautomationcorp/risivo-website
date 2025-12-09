# 📋 Daily Backup Protocol

## Trigger Phrase
**"Preparing to go to sleep"** or **"Going to sleep"**

## What Happens
When you say this phrase, I will **immediately generate a comprehensive backup summary** that includes:

### 1. Current Project State
- ✅ What's working (deployed components)
- 🔨 What's in progress (current step)
- ⏳ What's pending (next steps)
- ❌ Known issues (if any)

### 2. Technical Details
- **Current Branch**: `staging` or `main`
- **Latest Commits**: Last 5 commits with hashes
- **Build Status**: Current build size and module count
- **Deployment URLs**: Production and staging links
- **Environment Variables**: WEBHOOK_URL, ENABLE_FULL_SITE status

### 3. Recent Changes
- Files modified today
- Features added
- Bugs fixed
- Documentation created

### 4. Next Session Startup Instructions
Clear, numbered steps for a **new Claude session** to:
- Understand the project structure
- Know what was completed
- Continue from where we left off
- Access all relevant files and documentation

### 5. Important Context
- Brand guidelines location
- Design system details
- Component architecture
- Deployment process
- Known gotchas/lessons learned

### 6. Quick Reference Links
- GitHub Repository
- Cloudflare Dashboard
- Production URL
- Staging URL
- Make.com webhook info

---

## Why This Matters

If there's a system issue or you need to start with a **new Claude session**, this backup ensures:

✅ **Zero Context Loss** - New Claude knows everything  
✅ **Seamless Continuity** - Pick up exactly where we left off  
✅ **No Repeated Work** - Clear record of what's done  
✅ **Quick Onboarding** - New Claude productive in minutes  
✅ **Complete History** - All decisions and changes documented

---

## Backup Storage

The summary will be:
1. **Committed to Git** - Permanent record in repository
2. **Pushed to GitHub** - Accessible anywhere
3. **Markdown Format** - Easy to read and reference
4. **Timestamped** - Clear chronological order

---

## Example Backup File Structure

```
BACKUP_2025_12_09_SESSION_SUMMARY.md
├── Current Status
├── Technical State
├── Recent Work (Today)
├── New Claude Onboarding Guide
├── Component Checklist
├── Known Issues & Solutions
├── Environment Configuration
├── Quick Reference
└── Next Steps
```

---

## How to Use the Backup

**For You (User):**
- Review what was accomplished
- Reference decisions made
- Share with team if needed
- Keep as project journal

**For New Claude:**
- Read the backup file first
- Understand full context
- Continue development seamlessly
- No questions about past work

---

## Activation

Simply say:
- **"Preparing to go to sleep"**
- **"Going to sleep"**
- **"Generate daily backup"**
- **"Create session summary"**

And I'll **immediately** create the comprehensive backup!

---

**This ensures your project progress is always protected and a new Claude session can continue development without missing a beat.** 🛡️✅
