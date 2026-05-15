## Using tools
Ths lesson is dedicated to using ESlint, Prettier, Husky.


## 📖 **Explanation: ESLint, Prettier, and Husky**

### **1. ESLint** (Code Quality)

**What is it?**
ESLint is like a "code reviewer" that automatically checks your code for problems. Think of it as a safety net that catches issues before you run your code.

**What it does:**
- ✅ Finds bugs and errors
- ✅ Enforces consistent code style
- ✅ Warns about potential problems
- ✅ Helps you write better code

**Example:**
```javascript
// ❌ ESLint will warn about this
var count = 0
if (count < 10) console.log('test')

// ✅ ESLint approves this
let count = 0;
if (count < 10) {
  console.log('test');
}
```

**In your project:**
- `npm run lint` - Check for issues
- `npm run lint:fix` - Auto-fix simple issues

---

### **2. Prettier** (Code Formatting)

**What is it?**
Prettier is an "automatic formatter" that makes your code look nice without you having to think about it. It's like an auto-correct for code style.

**What it does:**
- ✅ Automatically formats your code
- ✅ Consistent indentation
- ✅ Line breaks in the right places
- ✅ Consistent quotes (single or double)

**Example:**
```javascript
// Before Prettier
function add ( a , b ) { return a + b; }

// After Prettier (automatic)
function add(a, b) {
  return a + b;
}
```

**In your project:**
- `npm run format` - Format all your code

---

### **3. Husky** (Git Hooks)

**What is it?**
Husky helps you run commands automatically when you use Git. It's like a "pre-flight check" before you commit code.

**What it does:**
- ✅ Runs checks before you commit
- ✅ Prevents bad code from being committed
- ✅ Ensures code quality

**Example:**
```
You try to commit a file...
  ↓
Husky runs: "npm run lint:fix"
  ↓
- If code is clean → ✅ Commit succeeds
- If code has errors → ❌ Commit blocked
```

**In your project:**
- `npm run prepare` (runs on first commit) - Sets up Husky
- Every `git commit` now auto-runs linting first

---

### **🎯 Why This Matters for Vue Development**

| Tool | Benefit |
|------|---------|
| **ESLint** | Catches bugs, enforces best practices |
| **Prettier** | Consistent code style, less friction |
| **Husky** | Quality control before sharing code |

**Together they create:**
- 💪 Better code quality
- 🤝 Easier team collaboration
- 🐛 Fewer bugs in production
- ⚡ Faster development workflow

---

### **📝 Commands You Can Use**

```bash
# Check your code for issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Format your code
npm run format
```
