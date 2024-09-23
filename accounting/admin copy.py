# admin.py
from django.contrib import admin

from simpleuiApp.widgets import *
from .models import Account, Transaction, JournalEntry
from .actions import *
class DynamicListDisplayAdmin(admin.ModelAdmin):
    def get_list_display(self, request):
        # استرداد جميع أسماء الحقول من النموذج
        fields = [field.name for field in self.model._meta.fields]
        # إزالة الحقل 'id' إذا لم يكن مطلوباً في العرض
        if 'id' in fields:
            fields.remove('id')
        return fields

    def get_actions(self, request):
        actions = super().get_actions(request)
        # إضافة إجراءات مخصصة
        custom_actions = {
            'copy_field': (copy_field, 'copy_field', copy_field.short_description),
            'generate_report_pdf': (generate_report_pdf, 'generate_report_pdf', generate_report_pdf.short_description),
            'export_to_excel': (export_to_excel, 'export_to_excel', export_to_excel.short_description),
            'save_action': (save_action, 'save_action', save_action.short_description),
            'save_and_edit': (save_and_edit, 'save_and_edit', save_and_edit.short_description),
            'save_and_add_another': (save_and_add_another, 'save_and_add_another', save_and_add_another.short_description),
        }
        actions.update(custom_actions)
        return actions

# admin.py

from django.contrib import admin
from .models import Account, Transaction, JournalEntry

class AccountAdmin(DynamicListDisplayAdmin):
    formfield_overrides = {
        models.CharField: {'widget': STextInput},
        models.DecimalField: {'widget': SNumberInput},
        models.TextField: {'widget': STextInput},
        models.DateField: {'widget': SDatePicker},  # Custom widget for DateField
    }

class TransactionAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.ForeignKey: {'widget': admin.widgets.RelatedFieldWidgetWrapper},  # Default related field widget
        models.CharField: {'widget': STextInput},
        models.DecimalField: {'widget': SNumberInput},
        models.DateField: {'widget': SDatePicker},
    }

class JournalEntryAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.DateField: {'widget': SDatePicker},
        models.TextField: {'widget': STextInput},
        models.ManyToManyField: {'widget': admin.widgets.FilteredSelectMultiple},
    }

admin.site.register(Account, AccountAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(JournalEntry, JournalEntryAdmin)


@admin.register(Transaction)
class TransactionAdmin(DynamicListDisplayAdmin):
    search_fields = ['description']

@admin.register(Account)
class AccountAdmin(DynamicListDisplayAdmin):
    search_fields = ['name']

@admin.register(JournalEntry)
class JournalEntryAdmin(DynamicListDisplayAdmin):
    filter_horizontal = ['transactions']
