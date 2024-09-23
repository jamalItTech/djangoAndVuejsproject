إذا كنت تريد استخدام `globalFilter` للبحث في جميع مستويات البيانات بدون معرفة مفصلة للمفاتيح المتداخلة مثل `['subMenus']`, يمكنك تعديل الخوارزمية بحيث تبحث في جميع الطبقات المتداخلة بشكل تلقائي. هذا يعني أنك لن تحتاج إلى تحديد المفاتيح المتداخلة بشكل مسبق.

إليك كيف يمكنك تعديل `globalFilter` لتعمل بشكل ديناميكي:

### **تعديل خوارزمية `globalFilter`**

1. **إزالة المتغير `nestedKeys`**: بدلاً من تمرير المفاتيح المتداخلة، سيتم التعامل مع البيانات المتداخلة بشكل تلقائي.

2. **بحث تلقائي في جميع الطبقات**: تحديث الخوارزمية لتتعامل مع جميع الطبقات المتداخلة بدون الحاجة إلى تحديد المفاتيح المتداخلة.

```javascript
globalFilter(data, filterFunction, returnKey) {
  // تابع بحث تكراري داخل البيانات المتداخلة
  function recursiveSearch(items) {
    for (const item of items) {
      // استخدام دالة الفلترة المخصصة إذا تم توفيرها
      const matchesFilters = filterFunction(item);
      if (matchesFilters) {
        if (returnKey && item[returnKey]) {
          return item[returnKey]; // إرجاع أول تطابق فقط
        }
      }

      // التحقق من التداخل الديناميكي
      for (const key in item) {
        if (item.hasOwnProperty(key) && Array.isArray(item[key])) {
          const nestedItems = item[key];
          const result = recursiveSearch(nestedItems);
          if (result) {
            return result; // إرجاع أول تطابق فقط
          }
        }
      }
    }

    return null; // إذا لم يتم العثور على تطابق
  }

  return recursiveSearch(data);
}
```

### **استخدام `globalFilter`**

لتطبيق هذا التعديل، يمكنك استخدام `globalFilter` للبحث في جميع مستويات البيانات كما يلي:

```javascript
methods: {
  mapPathToData(path) {
    // تعريف الفلتر الذي يبحث عن العنصر بناءً على المسار
    const filterFunction = (item) => item.url === path;
    
    // استخدام الفلتر الجلوبل للعثور على العنصر المناسب
    const result = this.globalFilter(this.menus, filterFunction, 'data');

    if (result) {
      return {
        currentPage: { name: result.name, url: result.url },
        additionalPages: result.additionalPages || [] // أضف صفحات إضافية إن وجدت
      };
    } else {
      return {
        currentPage: { name: 'غير معروف', url: path },
        additionalPages: []
      };
    }
  }
}
```

### **توضيح العملية**

1. **بحث تكراري**: دالة `recursiveSearch` تقوم بالبحث تكرارياً عبر جميع الطبقات المتداخلة في البيانات.
2. **التعامل مع المفاتيح المتداخلة**: بدلاً من معرفة المفاتيح المتداخلة مسبقاً، يتم البحث عبر جميع المفاتيح التي تحتوي على مصفوفات في العناصر.
3. **النتيجة**: تعيد الخوارزمية أول تطابق بناءً على الفلتر المحدد. 

بهذا الشكل، لن تحتاج إلى معرفة المفاتيح المتداخلة مسبقاً، ويمكنك البحث في البيانات بطريقة أكثر ديناميكية.