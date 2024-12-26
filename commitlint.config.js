module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'body-max-line-length': [2, 'always', 100],
      'subject-case': [2, 'always', 'lower-case'],
      'type-enum': [
        2,
        'always',
        [
          'feat',    // ميزة جديدة
          'fix',     // إصلاح خطأ
          'docs',    // توثيق
          'style',   // تنسيق، مثل الفواصل المنقوطة المفقودة، إلخ
          'refactor',// تغيير في الكود لا يصلح خطأً ولا يضيف ميزة
          'test',    // إضافة اختبارات
          'chore',   // مهام صيانة
          'revert',  // إعادة التغييرات
          'perf',    // تحسينات في الأداء
          'ci'       // تغييرات متعلقة بـ CI/CD
        ]
      ]
    }
  };
  