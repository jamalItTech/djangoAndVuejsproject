from django.contrib import admin
from django.db import models

from simpleuiApp.widgets import (
    SDateTimeRangeInput,
    SDateInput,
    SDateRangeInput,
    SDateTimeInput,
    SMonthInput,
    SMonthRangeInput,
    SYearRangeInput,
    SDateInputWithIcon
)
from .models import *
from .actions import (
    copy_field,
    generate_report_pdf,
    export_to_excel,
    save_action,
    save_and_edit,
    save_and_add_another,
)
from django.utils.safestring import mark_safe

class DynamicListDisplayAdmin(admin.ModelAdmin):
    def get_fieldset_data(self, request, obj=None):
        field_lines = self.get_field_lines()
        return {
            'name': 'Fieldset Name',
            'description': 'Fieldset Description',
            'lines': field_lines
        }

    def get_field_lines(self):
        model_fields = [field for field in self.model._meta.fields if field.name != 'id']
        lines = []
        for field in model_fields:
            field_data = {
                'name': field.name,
                'label': field.verbose_name.capitalize(),
                'help_text': field.help_text,
                'type': field.get_internal_type(),
                'is_checkbox': isinstance(field, models.BooleanField) or isinstance(field, models.NullBooleanField)
            }
            lines.append({'fields': [field_data]})
        return lines

    def get_formsets_with_inlines(self, request, obj=None):
        formsets = super().get_formsets_with_inlines(request, obj)
        for formset in formsets:
            for form in formset.forms:
                for field_name, field in form.fields.items():
                    field.widget.attrs['data-fieldset'] = mark_safe(self.get_fieldset_data(request, obj))
        return formsets
    def get_list_display(self, request):
        # Retrieve all field names from the model
        fields = [field.name for field in self.model._meta.fields]
        # Remove the 'id' field if not required
        if 'id' in fields:
            fields.remove('id')
            
            
        return fields

    def get_actions(self, request):
        actions = super().get_actions(request)
        # Add custom actions
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
@admin.register(Transaction)
class TransactionAdmin(DynamicListDisplayAdmin):
    search_fields = ['description']

@admin.register(Account)
class AccountAdmin(DynamicListDisplayAdmin):
    search_fields = ['name']

@admin.register(JournalEntry)
class JournalEntryAdmin(DynamicListDisplayAdmin):
    filter_horizontal = ['transactions']

@admin.register(Event)
class EventAdmin(DynamicListDisplayAdmin):
 
    formfield_overrides = {
        models.DateTimeField: {'widget': SDateTimeRangeInput},  # Use custom DateTimeInput
    }

@admin.register(Invoice)
class InvoiceAdmin(DynamicListDisplayAdmin):
    formfield_overrides = {
        models.DateTimeField: {'widget': SDateTimeInput},
    }

@admin.register(Reservation)
class ReservationAdmin(DynamicListDisplayAdmin):
    formfield_overrides = {
        models.DateField: {'widget': SDateRangeInput},  # Use custom DateRangeInput
    }
