# Dark Mode Implementation

## تغییرات اعمال شده برای پشتیبانی از Dark Mode

### 1. Hook تشخیص Dark Mode

- فایل جدید: `src/hooks/useDarkMode.js`
- تشخیص خودکار تنظیمات Dark Mode مرورگر
- اعمال کلاس `dark` به document به صورت خودکار

### 2. تغییرات هدر اصلی (App.jsx)

- پس‌زمینه هدر: `bg-[#EDDCD9] dark:bg-gray-800`
- متن هدر: `text-gray-900 dark:text-gray-100`
- دکمه همبرگر موبایل: `text-black dark:text-white`

### 3. تغییرات منوی موبایل

- پس‌زمینه منو: `bg-pink-100 dark:bg-gray-800`
- متن‌های منو: `text-gray-900 dark:text-gray-100`
- دکمه‌های منو: رنگ‌بندی مناسب برای Dark Mode
- آیکون‌های شبکه‌های اجتماعی: `text-gray-900 dark:text-gray-100`

### 4. تغییرات ناوبری پایین موبایل (MobileBottomNav.jsx)

- پس‌زمینه: `bg-white dark:bg-gray-800`
- حاشیه: `border-gray-200 dark:border-gray-700`
- لینک‌های ناوبری: `text-gray-500 dark:text-gray-400`
- جعبه جستجو: `bg-white dark:bg-gray-800`
- فیلد جستجو: `bg-gray-50 dark:bg-gray-700`

### 5. بهبودهای CSS (index.css)

- تنظیم `color-scheme: dark` برای مرورگر
- بهبود کنتراست متن‌ها در Dark Mode
- تنظیم روشنایی تصاویر در Dark Mode

## نحوه کارکرد

1. **تشخیص خودکار**: Hook `useDarkMode` تنظیمات Dark Mode مرورگر را بررسی می‌کند
2. **اعمال کلاس**: کلاس `dark` به `document.documentElement` اضافه می‌شود
3. **استایل‌های Tailwind**: کلاس‌های `dark:` برای حالت تیره استفاده می‌شوند
4. **پاسخگویی**: تغییرات به صورت خودکار با تغییر تنظیمات مرورگر اعمال می‌شوند

## تست

برای تست Dark Mode:

1. مرورگر را در حالت Dark Mode قرار دهید
2. وبسایت را در نسخه موبایل باز کنید
3. بررسی کنید که:
   - هدر پس‌زمینه تیره دارد
   - منوی موبایل پس‌زمینه تیره دارد
   - ناوبری پایین پس‌زمینه تیره دارد
   - متن‌ها خوانا هستند
   - کنتراست مناسب است

## سازگاری

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ مرورگرهای موبایل اندروید و iOS
