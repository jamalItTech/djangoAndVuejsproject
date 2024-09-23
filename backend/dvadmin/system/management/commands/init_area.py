# الرابط الحضري
"""
إلى مستوى البلدة يستخدم
1. https://www.npmjs.com/package/china-division تنزيل البيانات，مُتَجَانِسjsonوضع في الدليل المقابل
2. تعديل المراسلات في هذا الملفjsonاسم
3. الحق -click لتنفيذ هذاpyتهيئة الملف
"""
import json
import os

import django
import pypinyin
from django.core.management import BaseCommand
from django.db import connection

from application import dispatch

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'application.settings')
django.setup()
from application.settings import BASE_DIR
from dvadmin.system.models import Area

area_code_list = []


def area_list(code_list, pcode=None, depth=1):
    """
    الحصول على جميع القوائم بشكل متكرر
    """
    for code_dict in code_list:
        code = code_dict.get('code', None)
        name = code_dict.get('name', None)
        children = code_dict.get('children', None)
        pinyin = ''.join([''.join(i) for i in pypinyin.pinyin(name, style=pypinyin.NORMAL)])
        area_code_list.append(
            {
                "name": name,
                "code": code,
                "level": depth,
                "pinyin": pinyin,
                "initials": pinyin[0].upper() if pinyin else "#",
                "pcode_id": pcode,
            }
        )
        if children:
            area_list(code_list=children, pcode=code, depth=depth + 1)


def main():
    with open(os.path.join(BASE_DIR, 'dvadmin', 'system', 'util', 'pca-code.json'), 'r', encoding="utf-8") as load_f:
        code_list = json.load(load_f)
    area_list(code_list)
    if Area.objects.count() == 0:
        Area.objects.bulk_create([Area(**ele) for ele in area_code_list])
    else:
        for ele in area_code_list:
            code = ele.pop("code")
            Area.objects.update_or_create(code=code, defaults=ele)


class Command(BaseCommand):
    """
    أمر تهيئة المشروع: python manage.py init
    """

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):

        print(f"إعداد بيانات المقاطعة...")

        if dispatch.is_tenants_mode():
            from django_tenants.utils import get_tenant_model
            from django_tenants.utils import tenant_context
            for tenant in get_tenant_model().objects.exclude(schema_name='public'):
                with tenant_context(tenant):
                    print(f"مستأجر[{connection.tenant.schema_name}]تبدأ بيانات التهيئة...")
                    main()
                    print(f"مستأجر[{connection.tenant.schema_name}]بيانات التهيئة كاملة！")
        else:
            main()
        print("省份数据بيانات التهيئة كاملة！")
