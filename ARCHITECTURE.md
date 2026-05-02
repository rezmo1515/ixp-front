# IXP Tracker - نسخه ایرانی

## معماری و ساختار پروژه

این سند توضیح جامعی در مورد معماری پروژه IXP Tracker (نسخه ایرانی) و نحوه استفاده از آن را ارائه می‌دهد.

---

## 📋 فهرست محتویات

1. [معماری کلی](#معماری-کلی)
2. [سیستم احراز هویت و مجوزها](#سیستم-احراز-هویت-و-مجوزها)
3. [ساختار فایل‌ها](#ساختار-فایل‌ها)
4. [راهنمای توسعه ماژول‌های جدید](#راهنمای-توسعه-ماژول‌های-جدید)
5. [نکات مهم](#نکات-مهم)

---

## معماری کلی

### 🎯 اصول طراحی

- **Modular**: هر ماژول مستقل و قابل توسعه است
- **Scalable**: معماری آماده برای اضافه کردن ماژول‌های جدید
- **Permission-Based**: تمام عملیات بر اساس مجوزها کنترل می‌شوند
- **RTL Support**: پشتیبانی کامل برای فارسی

### 📊 نمودار فلو احراز هویت

```
کاربر → صفحه Login/Register → API پشتیبان
    ↓
Token + User + ACL → LocalStorage
    ↓
useAuth Hook → تمام صفحات
    ↓
Permission Check → نمایش/مخفی کردن عناصر
```

---

## سیستم احراز هویت و مجوزها

### 1. سیستم ورود و ثبت نام

**فایل:** `src/pages/Login.tsx`

#### قابلیت‌های پشتیبانی شده:
- ✅ ورود با رمز عبور
- ✅ ورود با کد OTP
- ✅ ثبت نام کاربر جدید
- ✅ طراحی Responsive و جذاب

#### مثال ورود:
```typescript
const { login, register, sendOtp, verifyOtp } = useAuth()

// ورود با رمز عبور
await login('09123456789', 'password123')

// ثبت نام
await register({
  first_name: 'علی',
  last_name: 'احمدی',
  mobile: '09123456789',
  email: 'ali@example.com',
  password: 'pass123',
  password_confirmation: 'pass123'
})

// ورود با OTP
await sendOtp('09123456789')
await verifyOtp('09123456789', '123456')
```

### 2. سیستم مجوزها (ACL)

**فایل:** `src/hooks/useAuth.ts`

```typescript
const { hasPermission } = useAuth()

// بررسی مجوز
if (hasPermission('roles.manage')) {
  // نمایش بخش مدیریت نقش‌ها
}

if (hasPermission('messages.send')) {
  // نمایش بخش ارسال پیام
}
```

#### مجوزهای سیستم:
- `ping.run` - اجرای تست Ping
- `dns.check` - بررسی DNS
- `whois.lookup` - جستجوی WHOIS
- `messages.send` - ارسال پیام
- `messages.broadcast` - ارسال پخش‌شده
- `roles.manage` - مدیریت نقش‌ها
- `users.manage` - مدیریت کاربران
- `logs.view` - مشاهده گزارش‌ها

### 3. سیستم نقش‌ها

**فایل:** `src/pages/Roles.tsx`

#### ویژگی‌های سیستم نقش‌ها:
- ✅ ایجاد نقش‌های جدید
- ✅ ویرایش نقش‌های موجود
- ✅ حذف نقش‌ها
- ✅ تخصیص مجوزها به نقش‌ها
- ✅ نمایش تعداد کاربران با هر نقش

#### مثال استفاده:
```typescript
// سیستم نقش‌ها به صورت خودکار نقش‌های سیستمی را نمایش می‌دهد
// و امکان ایجاد نقش‌های جدید را فراهم می‌کند

const roles = [
  {
    id: 1,
    name: 'admin',
    display_name: 'مدیر سیستم',
    permissions: ['ping.run', 'dns.check', 'whois.lookup', 'messages.send', 'roles.manage'],
    users_count: 2
  },
  {
    id: 2,
    name: 'user',
    display_name: 'کاربر عادی',
    permissions: ['ping.run', 'dns.check', 'whois.lookup'],
    users_count: 45
  }
]
```

---

## ساختار فایل‌ها

### 📁 ساختار دایرکتوری

```
src/
├── api/
│   ├── client.ts          # Axios client configuration
│   ├── index.ts           # API exports
│   └── services.ts        # API service methods
│
├── components/
│   ├── layout/
│   │   ├── Layout.tsx     # Main layout with sidebar
│   │   ├── Breadcrumb.tsx # Breadcrumb navigation
│   │   └── AppLayout.tsx  # App layout container
│   ├── modules/           # ماژول‌های کمپوننت
│   └── ui/                # UI components (Logo, Spinner, etc)
│
├── hooks/
│   └── useAuth.ts         # Authentication context & methods
│
├── pages/
│   ├── Login.tsx          # ورود/ثبت نام
│   ├── Ping.tsx           # تست Ping
│   ├── Dns.tsx            # بررسی DNS
│   ├── Whois.tsx          # جستجوی WHOIS
│   ├── Messages.tsx       # سیستم پیام‌رسانی
│   ├── Roles.tsx          # مدیریت نقش‌ها
│   └── Dashboard.tsx      # داشبورد (اگر وجود داشته باشد)
│
├── store/
│   └── auth.ts            # Zustand auth store (اگر مورد نیاز باشد)
│
├── types/
│   ├── index.ts           # تعریف‌های اصلی
│   └── message.types.ts   # تعریف‌های مربوط به پیام‌ها
│
├── App.tsx                # Router & Protected Routes
├── main.tsx               # App entry point
└── index.css              # Global styles
```

### 🔧 فایل‌های کنفیگ

```
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
├── eslint.config.js       # ESLint config
└── package.json           # Dependencies
```

---

## راهنمای توسعه ماژول‌های جدید

### ✅ مراحل اضافه کردن ماژول جدید

#### مرحله 1: ایجاد صفحه جدید

**مثال:** اضافه کردن صفحه "Traceroute"

```typescript
// src/pages/Traceroute.tsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Network } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Traceroute() {
  const { hasPermission } = useAuth()
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  // بررسی مجوز
  if (!hasPermission('traceroute.run')) {
    return (
      <div className="p-6">
        <div className="card text-center py-12">
          <Network size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-lg font-bold mb-2">دسترسی رد شد</h2>
          <p style={{ color: 'var(--muted)' }}>شما اجازه دسترسی ندارید</p>
        </div>
      </div>
    )
  }

  const run = async () => {
    if (!target.trim()) {
      return toast.error('لطفاً هدف را وارد کنید')
    }

    setLoading(true)
    try {
      // API call here
      toast.success('Traceroute انجام شد')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'خطا')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg" 
          style={{ background: 'var(--red)', opacity: 0.1 }}>
          <Network size={18} style={{ color: 'var(--red)' }} />
        </div>
        <h1 className="text-2xl font-bold">تتبع مسیر</h1>
      </div>

      <div className="card">
        <input
          className="field"
          placeholder="IP یا دامنه"
          value={target}
          onChange={e => setTarget(e.target.value)}
        />
        <button 
          className="btn btn-red mt-4"
          onClick={run}
          disabled={loading}
        >
          {loading ? 'درحال اجرا…' : 'اجرا'}
        </button>
      </div>

      {/* نمایش نتایج */}
    </div>
  )
}
```

#### مرحله 2: اضافه کردن API Service

```typescript
// در src/api/services.ts

export const tracerouteApi = {
  run: (target: string, maxHops = 30) =>
    client.post<ApiResponse<TracerouteResult>>('/traceroute', { 
      target, 
      max_hops: maxHops 
    }),

  history: (target: string) =>
    client.get<ApiResponse<TracerouteResult[]>>('/traceroute/history', { 
      params: { target } 
    }),
}
```

#### مرحله 3: اضافه کردن Route

```typescript
// در src/App.tsx

import Traceroute from './pages/Traceroute'

export default function App() {
  return (
    <Routes>
      {/* ... routes ... */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* ... existing routes ... */}
        <Route path="/traceroute" element={<Traceroute />} />
      </Route>
    </Routes>
  )
}
```

#### مرحله 4: اضافه کردن Menu Item

```typescript
// در src/components/layout/Layout.tsx

const allNav = [
  { to: '/ping',      label: 'تست Ping',     icon: Activity,        permission: null },
  { to: '/dns',       label: 'بررسی DNS',     icon: Search,          permission: null },
  { to: '/whois',     label: 'WHOIS',         icon: Globe,           permission: null },
  { to: '/traceroute',label: 'تتبع مسیر',    icon: Network,         permission: 'traceroute.run' },
  { to: '/messages',  label: 'پیام‌ها',        icon: MessageSquare,   permission: 'messages.send' },
  { to: '/roles',     label: 'نقش‌ها',        icon: Shield,          permission: 'roles.manage' },
]
```

#### مرحله 5: اضافه کردن Breadcrumb

```typescript
// در src/components/layout/Breadcrumb.tsx

const breadcrumbMap: Record<string, string> = {
  '/ping': 'تست Ping',
  '/dns': 'بررسی DNS',
  '/whois': 'WHOIS',
  '/traceroute': 'تتبع مسیر',
  '/messages': 'پیام‌ها',
  '/roles': 'نقش‌ها و اختیارات',
}
```

#### مرحله 6: اضافه کردن مجوز به سیستم

```typescript
// در src/pages/Roles.tsx

const availablePermissions = [
  // ... existing permissions ...
  { id: 'traceroute.run', label: 'اجرای تتبع مسیر' },
]
```

---

## نکات مهم

### ⚙️ نکات کنفیگ‌های مهم

#### 1. سبک‌های CSS

سبک‌های پایه در `src/index.css` تعریف شده‌اند:

```css
:root {
  --bg: #0d0d0f;        /* رنگ پس‌زمینه اصلی */
  --bg2: #131317;       /* رنگ پس‌زمینه ثانویه */
  --text: #ffffff;      /* رنگ متن */
  --text2: #a1a1a8;     /* رنگ متن ثانویه */
  --muted: #72727a;     /* رنگ متن خاموش */
  --border: #202026;    /* رنگ حاشیه */
  --red: #dc2626;       /* رنگ قرمز */
}
```

#### 2. Tailwind Utilities

```html
<!-- Buttons -->
<button class="btn btn-red">دکمه قرمز</button>
<button class="btn btn-ghost">دکمه شفاف</button>

<!-- Input Fields -->
<input class="field" placeholder="..." />
<textarea class="field">...</textarea>

<!-- Cards -->
<div class="card">محتوا</div>

<!-- Badges -->
<span class="badge">نشان</span>
```

### 🔒 نکات امنیتی

1. **Token Management**: توکن در LocalStorage ذخیره می‌شود (برای پروژه‌های بزرگ از SecureStorage استفاده کنید)

2. **Permission Checks**: همیشه مجوز را در Frontend بررسی کنید و **همیشه** در Backend نیز بررسی کنید

3. **API Security**: از CORS و HTTPS استفاده کنید

### 📝 قوانین Coding

1. **نام‌گذاری**: از کاملک استفاده کنید (`myFunction`، `MyComponent`)
2. **Type Safety**: تمام props را Type کنید
3. **Error Handling**: همیشه try-catch استفاده کنید
4. **Comments**: کد پیچیده را کامنت کنید
5. **RTL Support**: تمام عناصر RTL را بررسی کنید

### 🚀 Performance Tips

1. **Code Splitting**: Route‌ها را lazy load کنید
2. **Caching**: نتایج API را cache کنید
3. **Pagination**: داده‌های بزرگ را paginate کنید
4. **Debouncing**: search input‌ها را debounce کنید

---

## 📦 Dependencies

```json
{
  "axios": "HTTP client",
  "react": "UI library",
  "react-router-dom": "Routing",
  "react-hot-toast": "Notifications",
  "lucide-react": "Icons",
  "zustand": "State management (optional)",
  "tailwindcss": "CSS framework",
  "typescript": "Type safety"
}
```

---

## 🎯 خلاصه

معماری جدید IXP Tracker طوری طراحی شده‌است که:

✅ **آسان توسعه‌پذیر** - اضافه کردن ماژول جدید ساده است  
✅ **امن** - سیستم مجوزها کاملاً통합شده است  
✅ **جذاب** - طراحی حرفه‌ای و فارسی‌پذیر  
✅ **مقیاس‌پذیر** - برای پروژه‌های بزرگ آماده است  
✅ **نگهداری‌پذیر** - کد تمیز و سازمان‌یافته  

---

## 📞 پشتیبانی و راهنمایی

برای سوالات و راهنمایی بیشتر، به مستندات رسمی React، React Router و Tailwind CSS مراجعه کنید.

Happy Coding! 🚀
