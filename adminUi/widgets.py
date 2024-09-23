# -*- encoding: utf-8 -*-
"""
@File    : widgets.py
@Time    : 2020/1/3 11:22
@Author  : chise
@Email   : chise123@live.com
@Software: PyCharm
@info    :小部件
"""
import typing
import copy
import datetime
import re
import warnings
from collections import defaultdict
from itertools import chain

from django.conf import settings
from django.forms.renderers import get_default_renderer
from django.forms.utils import to_current_timezone
from django.forms.widgets import media_property
from django.templatetags.static import static
from django.utils.datastructures import OrderedSet
from django.utils.dates import MONTHS
from django.utils.formats import get_format
from django.utils.html import format_html, html_safe
from django.utils.safestring import mark_safe

from django.utils.translation import gettext_lazy as _

from simpleuiApp.fullwidgets import *

__all__ = ('STextInput', 'SPasswordInput',
           'SURLInput', 'SEmailInput', 'SNumberInput','SDateTimeRangeInput')



class SDateTimeRangeInput(SDateTimePicker):
    def __init__(self, attrs=None, default_time=['00:00:00', '23:59:59']):
        super().__init__(attrs, picker_type='datetimerange', default_time=default_time)


class SDateInput(SDatePicker):
    def __init__(self, attrs=None):
        super().__init__(attrs, picker_type='date')



class SDateTimeInput(SDateTimePicker):
    def __init__(self, attrs=None):
        super().__init__(attrs, picker_type='datetime')


class SDateTimeRangeInput(SDateTimePicker):
    def __init__(self, attrs=None):
        super().__init__(attrs, picker_type='datetimerange')


class SMonthInput(SDatePicker):
    def __init__(self, attrs=None):
        super().__init__(attrs, picker_type='month')

class SDateRangeInput(SDatePicker):
    def __init__(self, attrs=None):
        super().__init__(attrs, picker_type='daterange')
class SMonthRangeInput(SDatePicker):
    def __init__(self, attrs=None):
        super().__init__(attrs, picker_type='monthrange')
class SYearRangeInput(SDatePicker):
    def __init__(self, attrs=None):
        super().__init__(attrs, picker_type='yearrange')
class SDateInputWithIcon(SDatePicker):
    def __init__(self, attrs=None, icon='el-icon-date'):
        super().__init__(attrs, picker_type='date', icon=icon)


class CInput(CWidget):
    """
    Base class for all <input> widgets.
    """
    input_type = None  # Subclasses must define this.
    template_name = 'django/forms/widgets/input.html'
    flag = False

    def __init__(self, attrs=None):
        if attrs is not None:
            attrs = attrs.copy()
            self.input_type = attrs.pop('type', self.input_type)
        super().__init__(attrs)

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        context['widget']['flag'] = self.flag
        context['widget']['type'] = self.input_type
        return context

class STextInput(CInput):
    input_type = "text"
    template_name = 'django/forms/widgets/text.html'

    def __init__(self, attrs: typing.Union[typing.Dict[str, str], None] = None):
        self.get_bind_attr(attrs)
        if not  attrs :
            attrs = {}
            attrs['style'] = "width:180px"
        else:
            if not attrs.get('style'):
                attrs['style'] = "width:180px "
        super().__init__(attrs)


class SNumberInput(CInput):
    input_type = 'number'
    template_name = 'django/forms/widgets/number.html'
    def __init__(self, attrs: typing.Union[typing.Dict[str, str], None] = None):
        self.get_bind_attr(attrs)
        if not attrs:
            attrs = {}
            attrs['style'] = "width:180px"
        else:
            if not attrs.get('style'):
                attrs['style'] = "width:180px "
        super().__init__(attrs)


class SEmailInput(CInput):
    input_type = 'email'
    template_name = 'django/forms/widgets/email.html'
    def __init__(self, attrs: typing.Union[typing.Dict[str, str], None] = None):
        self.get_bind_attr(attrs)
        if not attrs:
            attrs = {}
            attrs['style'] = "width:180px "
        else:
            if not attrs.get('style'):
                attrs['style'] = "width:180px "
        super().__init__(attrs)

class SURLInput(CInput):
    input_type = 'url'
    template_name = 'django/forms/widgets/url.html'
    def __init__(self, attrs: typing.Union[typing.Dict[str, str], None] = None):
        self.get_bind_attr(attrs)
        if not attrs:
            attrs = {}
            attrs['style'] = "width:180px"
        else:
            if not attrs.get('style'):
                attrs['style'] = "width:180px "
        super().__init__(attrs)

class SPasswordInput(CInput):
    input_type = 'password'
    template_name = 'django/forms/widgets/password.html'

    def __init__(self, attrs: typing.Union[typing.Dict[str, str], None] = None,render_value=False):
        self.get_bind_attr(attrs)
        if not attrs:
            attrs = {}
            attrs['style'] = "width:180px"
        else:
            if not attrs.get('style'):
                attrs['style'] = "width:180px "
        super().__init__(attrs)
        self.render_value = render_value
    def get_context(self, name, value, attrs):
        if not self.render_value:
            value = None
        return super().get_context(name, value, attrs)
# Defined at module level so that CheckboxInput is picklable (#17976)
def boolean_check(v):
    return not (v is False or v is None or v == '')

class SCheckboxInput(CInput):
 
    input_type = 'checkbox'
    template_name = 'django/forms/widgets/checkbox.html'

    def __init__(self, attrs=None, check_test=None):
        super().__init__(attrs)
        # check_test是一个可调用的函数，它接受一个值，如果复选框被选中，它将返回True。
        self.check_test = boolean_check if check_test is None else check_test

    def format_value(self, value):
        if value is True or value is False or value is None or value == '':
            return
        return str(value)

    def get_context(self, name, value, attrs):
        if self.check_test(value):
            attrs = {**(attrs or {}), 'checked': True}
        return super().get_context(name, value, attrs)

    def value_from_datadict(self, data, files, name):
        if name not in data:
            # A missing value means False because HTML form submission does not
            # send results for unselected checkboxes.
            return False
        value = data.get(name)
        # Translate true and false strings to boolean values.
        values = {'true': True, 'false': False}
        if isinstance(value, str):
            value = values.get(value.lower(), value)
        return bool(value)

    def value_omitted_from_data(self, data, files, name):
        return False