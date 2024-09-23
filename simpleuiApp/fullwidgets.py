import typing
import copy
import datetime
import re
import warnings
from collections import defaultdict, OrderedDict
from itertools import chain

from django.conf import settings
from django.forms.renderers import get_default_renderer
from django.forms.utils import to_current_timezone
from django.forms.widgets import media_property
from django.templatetags.static import static
from django.utils import formats
from django.utils.datastructures import OrderedSet  # Keep this if it's used
from django.utils.dates import MONTHS  # Check if this is needed
from django.utils.formats import get_format
from django.utils.html import format_html
from django.utils.safestring import mark_safe

from django.utils.translation import gettext_lazy as _

class MediaDefiningClass(type):
    def __new__(mcs, name, bases, attrs):
        new_class = super(MediaDefiningClass, mcs).__new__(mcs, name, bases, attrs)

        if 'media' not in attrs:
            new_class.media = media_property(new_class)

        return new_class

class CWidget(metaclass=MediaDefiningClass):
    needs_multipart_form = False
    is_localized = False
    is_required = False
    supports_microseconds = True
    bind_attr = {}
    
    def __init__(self, attrs=None):
        self.attrs = {} if attrs is None else attrs.copy()

    def __deepcopy__(self, memo):
        obj = copy.copy(self)
        obj.attrs = self.attrs.copy()
        memo[id(self)] = obj
        return obj

    @property
    def is_hidden(self):
        return self.input_type == 'hidden' if hasattr(self, 'input_type') else False

    def subwidgets(self, name, value, attrs=None):
        context = self.get_context(name, value, attrs)
        yield context['widget']

    def format_value(self, value):
        if value == '' or value is None:
            return None
        if self.is_localized:
            return formats.localize_input(value)
        return str(value)

    def get_context(self, name, value, attrs):
        context = {}
        context['widget'] = {
            'name': name,
            'is_hidden': self.is_hidden,
            'required': self.is_required,
            'value': self.format_value(value),
            'attrs': self.build_attrs(self.attrs, attrs),
            'template_name': self.template_name,
        }
        return context

    def render(self, name, value, attrs=None, renderer=None):
        context = self.get_context(name, value, attrs)
        return self._render(self.template_name, context, renderer)

    def _render(self, template_name, context, renderer=None):
        if renderer is None:
            renderer = get_default_renderer()
        return mark_safe(renderer.render(template_name, context))

    def build_attrs(self, base_attrs, extra_attrs=None):
        return {**base_attrs, **(extra_attrs or {})}

    def value_from_datadict(self, data, files, name):
        return data.get(name)

    def value_omitted_from_data(self, data, files, name):
        return name not in data

    def id_for_label(self, id_):
        return id_

    def use_required_attribute(self, initial):
        return not self.is_hidden

    def get_bind_attr(self, attrs=None):
        if not attrs:
            self.bind_attr = {}
            return
        for key, value in attrs.items():
            if key[0] == ":":
                if isinstance(value, str):
                    self.bind_attr[value] = ''
                elif isinstance(value, dict):
                    for a, b in value.items():
                        self.bind_attr[a] = b
                else:
                    continue

class SDateTimePicker(CWidget):
    template_name = 'admin/widgets/datepicker.html'
    input_type = None  # Subclasses must define this.
    flag = False
    def __init__(self, attrs=None, picker_type='datetime', default_time=None):
        self.picker_type = picker_type
        self.default_time = default_time or ['00:00:00', '23:59:59']
        if attrs is None:
            attrs = {}
        attrs['type'] = picker_type
        attrs['default-time'] = self.default_time

        attrs.setdefault('v-model', '')
        attrs.setdefault('readonly', False)
        attrs.setdefault('disabled', False)
        attrs.setdefault('editable', True)
        attrs.setdefault('clearable', True)
        attrs.setdefault('size', 'medium')
        attrs.setdefault('placeholder', 'Select date and time')
        attrs.setdefault('start-placeholder', 'Start date and time')
        attrs.setdefault('end-placeholder', 'End date and time')
        attrs.setdefault('arrow-control', False)
        attrs.setdefault('format', 'yyyy-MM-dd HH:mm:ss')
        attrs.setdefault('popper-class', '')
        attrs.setdefault('range-separator', 'to')
        attrs.setdefault('default-value', None)
        attrs.setdefault('value-format', None)
        attrs.setdefault('date-format', None)
        attrs.setdefault('time-format', None)
        attrs.setdefault('id', '')

        super().__init__(attrs)

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        context['widget']['picker_type'] = self.picker_type
        context['widget']['default_time'] = self.default_time
        return context

class SDatePicker(CWidget):
    template_name = 'admin/widgets/datepicker.html'

    def __init__(self, attrs=None, picker_type='date', icon=None):
        self.picker_type = picker_type
        self.icon = icon
        if attrs is None:
            attrs = {}
        attrs['type'] = picker_type
        if icon:
            attrs['prefix-icon'] = icon
        super().__init__(attrs)

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        context['widget']['picker_type'] = self.picker_type
        context['widget']['icon'] = self.icon
        return context
