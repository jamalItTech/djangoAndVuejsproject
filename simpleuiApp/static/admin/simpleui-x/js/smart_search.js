// دالة لحساب Levenshtein Distance للمقارنة التقريبية
function levenshteinDistance(a, b) {
  const matrix = [];

  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1
          ) // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// الدالة الرئيسية للبحث الذكي
function globalFilterSmart(data, targetUrl) {
  // إزالة البرامترات من الـ URL
  const cleanUrl = targetUrl.split('?')[0];

  let result = null;
  let suggestions = [];
  let bestMatch = null;
  let bestMatchScore = Infinity;

  const recursiveSearch = (items, path = []) => {
    items.forEach(item => {
      if (item.url) {
        const itemUrl = item.url.split('?')[0];

        // تطابق دقيق مع الرابط
        if (itemUrl === cleanUrl) {
          result = { path: [...path, item], result: item };
        } else {
          // مقارنة تقريبية
          const distance = levenshteinDistance(itemUrl, cleanUrl);
          if (distance < bestMatchScore) {
            bestMatchScore = distance;
            bestMatch = { path: [...path, item], result: item, distance };
          }

          // حفظ المقارنات المشابهة
          if (distance <= 5) {
            // عتبة المسافة للتشابه
            suggestions.push({ path: [...path, item], result: item, distance });
          }
        }
      }

      // البحث في الوحدات المتداخلة (الموديولز والشاشات)
      if (item.moduls) {
        recursiveSearch(item.moduls, [...path, item]);
      }

      if (item.screens) {
        recursiveSearch(item.screens, [...path, item]);
      }
    });
  };

  recursiveSearch(data);

  // إذا لم يتم العثور على تطابق دقيق
  if (!result) {
    if (bestMatch) {
      console.log(`تم العثور على تطابق قريب: ${bestMatch.result.url}`);
    }

    if (suggestions.length > 0) {
      console.log('روابط مشابهة محتملة:');
      suggestions.forEach(s => console.log(s.result.url));
    }
  }

  return result
    ? result
    : { message: 'لم يتم العثور على تطابق دقيق', suggestions };
}

// مثال استخدام
const data = [
  {
    name: 'Groups',
    icon: 'fas fa-users-cog',
    url: '/admin/auth/group/',
    moduls: [
      {
        name: 'المشتريات',
        icon: 'fas fa-box',
        screens: [
          {
            name: 'المنتجات',
            icon: 'fas fa-box',
            url: '/admin/product/',
          },
          {
            name: 'فاتورة المشتريات',
            icon: 'fas fa-receipt',
            url: '/admin/invoice/',
          },
          {
            name: 'إدارة الموردين',
            icon: 'fas fa-truck',
            url: '/admin/suppliers/',
          },
        ],
      },
      {
        name: 'المبيعات',
        icon: 'fas fa-shopping-cart',
        screens: [
          {
            name: 'الطلبات',
            icon: 'fas fa-list',
            url: '/admin/orders/',
          },
          {
            name: 'إدارة العملاء',
            icon: 'fas fa-users',
            url: '/admin/customers/',
          },
        ],
      },
    ],
  },
  {
    name: 'Inventory',
    icon: 'fas fa-warehouse',
    url: '/admin/inventory/',
    moduls: [
      {
        name: 'المخازن',
        icon: 'fas fa-warehouse',
        screens: [
          {
            name: 'المخزون الحالي',
            icon: 'fas fa-boxes',
            url: '/admin/current-stock/',
          },
          {
            name: 'إدارة الواردات',
            icon: 'fas fa-truck-loading',
            url: '/admin/imports/',
          },
          {
            name: 'إدارة الصادرات',
            icon: 'fas fa-truck-moving',
            url: '/admin/exports/',
          },
        ],
      },
      {
        name: 'إدارة المخزون',
        icon: 'fas fa-box-open',
        screens: [
          {
            name: 'التقارير',
            icon: 'fas fa-chart-line',
            url: '/admin/inventory-reports/',
          },
          {
            name: 'طلبات الجرد',
            icon: 'fas fa-file-alt',
            url: '/admin/stock-requests/',
          },
        ],
      },
    ],
  },
  {
    name: 'HR',
    icon: 'fas fa-user-tie',
    url: '/admin/hr/',
    moduls: [
      {
        name: 'الموظفين',
        icon: 'fas fa-users',
        screens: [
          {
            name: 'قائمة الموظفين',
            icon: 'fas fa-user-friends',
            url: '/admin/employees/',
          },
          {
            name: 'سجل الرواتب',
            icon: 'fas fa-money-check-alt',
            url: '/admin/salaries/',
          },
          {
            name: 'إجازات الموظفين',
            icon: 'fas fa-calendar-alt',
            url: '/admin/leaves/',
          },
        ],
      },
      {
        name: 'إدارة الحضور',
        icon: 'fas fa-clock',
        screens: [
          {
            name: 'سجل الحضور',
            icon: 'fas fa-clipboard-list',
            url: '/admin/attendance/',
          },
          {
            name: 'تقارير الحضور',
            icon: 'fas fa-chart-pie',
            url: '/admin/attendance-reports/',
          },
        ],
      },
    ],
  },
  {
    name: 'Finance',
    icon: 'fas fa-coins',
    url: '/admin/finance/',
    moduls: [
      {
        name: 'المحاسبة',
        icon: 'fas fa-calculator',
        screens: [
          {
            name: 'الدفتر العام',
            icon: 'fas fa-book',
            url: '/admin/general-ledger/',
          },
          {
            name: 'إدارة الضرائب',
            icon: 'fas fa-file-invoice-dollar',
            url: '/admin/taxes/',
          },
          {
            name: 'التقارير المالية',
            icon: 'fas fa-file-alt',
            url: '/admin/financial-reports/',
          },
        ],
      },
      {
        name: 'الميزانية',
        icon: 'fas fa-balance-scale',
        screens: [
          {
            name: 'التقارير السنوية',
            icon: 'fas fa-calendar',
            url: '/admin/annual-reports/',
          },
          {
            name: 'إعداد الميزانية',
            icon: 'fas fa-edit',
            url: '/admin/budget-setup/',
          },
        ],
      },
    ],
  },
];
const targetUrl = '/adsmgin/invoe/?id=123&otherParam=value';

const result = globalFilterSmart(data, targetUrl);
console.log(result);
