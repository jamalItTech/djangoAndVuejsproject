from django.http import HttpResponse
import csv
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import openpyxl
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.html import format_html

def save_action(modeladmin, request, queryset):
    """Save the selected objects."""
    for obj in queryset:
        obj.save()
    modeladmin.message_user(request, "Selected records have been saved.")
save_action.short_description = format_html('<i class="fa fa-save"></i> Save Selected')

def save_and_edit(modeladmin, request, queryset):
    """Save the selected objects and redirect to edit page."""
    for obj in queryset:
        obj.save()
    if queryset:
        # Redirect to the edit page of the first object in the queryset
        obj = queryset[0]
        url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), 
                      args=[obj.pk])
        return HttpResponseRedirect(url)
    modeladmin.message_user(request, "Selected records have been saved and redirected to edit page.")
save_and_edit.short_description = format_html('<i class="fa fa-edit"></i> Save and Edit')

def save_and_add_another(modeladmin, request, queryset):
    """Save the selected objects and redirect to add another page."""
    for obj in queryset:
        obj.save()
    if queryset:
        # Redirect to the add page of the model
        url = reverse('admin:%s_%s_add' % (queryset.model._meta.app_label, queryset.model._meta.model_name))
        return HttpResponseRedirect(url)
    modeladmin.message_user(request, "Selected records have been saved and redirected to add another.")
save_and_add_another.short_description = format_html('<i class="fa fa-plus"></i> Save and Add Another')

import openpyxl
from django.http import HttpResponse
from django.utils.html import format_html

def export_to_excel(modeladmin, request, queryset):
    """تصدير البيانات المحددة إلى ملف Excel باستخدام openpyxl."""
    # إنشاء مصنف جديد
    workbook = openpyxl.Workbook()
    sheet = workbook.active
    sheet.title = 'Report'

    # إعداد رؤوس الأعمدة
    headers = [field.name for field in queryset.model._meta.fields]
    sheet.append(headers)

    # إضافة البيانات
    for obj in queryset:
        row = []
        for field in headers:
            value = getattr(obj, field)
            # معالجة الحالات الخاصة مثل الكائنات المرتبطة
            if isinstance(value, str):
                row.append(value)
            elif hasattr(value, '__str__'):
                row.append(str(value))
            else:
                row.append('')  # إضافة قيمة فارغة إذا لم يكن هناك تحويل مناسب
        sheet.append(row)

    # إعداد الاستجابة
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=report.xlsx'
    
    # حفظ المصنف إلى الاستجابة
    workbook.save(response)
    
    return response

export_to_excel.short_description = format_html('<i class="fa fa-file-excel"></i> Export to Excel')

def copy_field(modeladmin, request, queryset):
    """نسخ قيمة حقل إلى حقل آخر."""
    for obj in queryset:
        if hasattr(obj, 'source_field') and hasattr(obj, 'target_field'):
            setattr(obj, 'target_field', getattr(obj, 'source_field'))
            obj.save()
    modeladmin.message_user(request, "Copy field value to target field")

copy_field.short_description = format_html('<i class="fa fa-copy"></i> Copy Selected')
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.http import HttpResponse
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.http import HttpResponse

def generate_report_pdf(modeladmin, request, queryset):
    """إنشاء تقرير PDF للبيانات المحددة."""
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    p.drawString(100, height - 100, "Data Report")
    y = height - 150

    # إعداد العناوين
    headers = [field.name for field in queryset.model._meta.fields]
    header_x_positions = [100 + i * 100 for i in range(len(headers))]
    
    for idx, header in enumerate(headers):
        p.drawString(header_x_positions[idx], y, header)
    
    y -= 20

    # إضافة البيانات
    for obj in queryset:
        for idx, field in enumerate(headers):
            field_value = getattr(obj, field, 'N/A')
            p.drawString(header_x_positions[idx], y, str(field_value))
        y -= 20
        
        # تحقق من تجاوز الصفحة
        if y < 100:
            p.showPage()
            p.setPageSize(letter)
            y = height - 100
            # إعادة إعداد العناوين على الصفحة الجديدة
            for idx, header in enumerate(headers):
                p.drawString(header_x_positions[idx], y, header)
            y -= 20

    p.showPage()
    p.save()
    buffer.seek(0)
    return HttpResponse(buffer, content_type='application/pdf')



generate_report_pdf.short_description = format_html('<i class="fa fa-file-pdf"></i> Export to PDF')
