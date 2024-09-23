#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.conf import settings
from django.db import connection
from django.core.cache import cache
from dvadmin.utils.validator import CustomValidationError
from django.db.models import Q

dispatch_db_type = getattr(settings, 'DISPATCH_DB_TYPE', 'memory')  # redis


def is_tenants_mode():
    """
    تحديد ما إذا كان وضع المستأجر
    :return:
    """
    return hasattr(connection, "tenant") and connection.tenant.schema_name


# ================================================= #
# ******************** التهيئة ******************** #
# ================================================= #
def _get_all_dictionary():
    from dvadmin.system.models import Dictionary

    queryset = Dictionary.objects.filter(status=True, is_value=False)
    data = []
    for instance in queryset:
        data.append(
            {
                "id": instance.id,
                "value": instance.value,
                "children": list(
                    Dictionary.objects.filter(parent=instance.id)
                    .filter(status=1)
                    .values("label", "value", "type", "color")
                ),
            }
        )
    return {ele.get("value"): ele for ele in data}


def _get_all_system_config():
    data = {}
    from dvadmin.system.models import SystemConfig

    system_config_obj = (
        SystemConfig.objects.filter(~Q(parent_id__form_item_type=11), parent_id__isnull=False)
        .values("parent__key", "key", "value", "form_item_type")
        .order_by("sort")
    )
    for system_config in system_config_obj:
        value = system_config.get("value", "")
        if value and system_config.get("form_item_type") == 7:
            value = value[0].get("url")
        if value and system_config.get("form_item_type") == 11:
            new_value = []
            for ele in value:
                new_value.append({
                    "key": ele.get('key'),
                    "title": ele.get('title'),
                    "value": ele.get('value'),
                })
            new_value.sort(key=lambda s: s["key"])
            value = new_value
        data[f"{system_config.get('parent__key')}.{system_config.get('key')}"] = value
    return data


def init_dictionary():
    """
    التهيئة字典配置
    :return:
    """
    try:
        if dispatch_db_type == 'redis':
            cache.set(f"init_dictionary", _get_all_dictionary())
            return
        if is_tenants_mode():
            from django_tenants.utils import tenant_context, get_tenant_model

            for tenant in get_tenant_model().objects.filter():
                with tenant_context(tenant):
                    settings.DICTIONARY_CONFIG[connection.tenant.schema_name] = _get_all_dictionary()
        else:
            settings.DICTIONARY_CONFIG = _get_all_dictionary()
    except Exception as e:
        print("يرجى ترحيل قاعدة البيانات أولاً!")
    return


def init_system_config():
    """
    التهيئةتكوين النظام
    :param name:
    :return:
    """
    try:
        if dispatch_db_type == 'redis':
            cache.set(f"init_system_config", _get_all_system_config())
            return
        if is_tenants_mode():
            from django_tenants.utils import tenant_context, get_tenant_model

            for tenant in get_tenant_model().objects.filter():
                with tenant_context(tenant):
                    settings.SYSTEM_CONFIG[connection.tenant.schema_name] = _get_all_system_config()
        else:
            settings.SYSTEM_CONFIG = _get_all_system_config()
    except Exception as e:
        print("يرجى ترحيل قاعدة البيانات أولاً!")
    return


def refresh_dictionary():
    """
    تحديث تكوين القاموس
    :return:
    """
    if dispatch_db_type == 'redis':
        cache.set(f"init_dictionary", _get_all_dictionary())
        return
    if is_tenants_mode():
        from django_tenants.utils import tenant_context, get_tenant_model

        for tenant in get_tenant_model().objects.filter():
            with tenant_context(tenant):
                settings.DICTIONARY_CONFIG[connection.tenant.schema_name] = _get_all_dictionary()
    else:
        settings.DICTIONARY_CONFIG = _get_all_dictionary()


def refresh_system_config():
    """
    تحديث تكوين النظام
    :return:
    """
    if dispatch_db_type == 'redis':
        cache.set(f"init_system_config", _get_all_system_config())
        return
    if is_tenants_mode():
        from django_tenants.utils import tenant_context, get_tenant_model

        for tenant in get_tenant_model().objects.filter():
            with tenant_context(tenant):
                settings.SYSTEM_CONFIG[connection.tenant.schema_name] = _get_all_system_config()
    else:
        settings.SYSTEM_CONFIG = _get_all_system_config()


# ================================================= #
# ******************** إدارة القاموس ******************** #
# ================================================= #
def get_dictionary_config(schema_name=None):
    """
    الحصول على جميع تكوينات القاموس
    :param schema_name: استفادت من خلال تكوين القاموس المقابلschema_nameقيمة
    :return:
    """
    if dispatch_db_type == 'redis':
        init_dictionary_data = cache.get(f"init_dictionary")
        if not init_dictionary_data:
            refresh_dictionary()
        return cache.get(f"init_dictionary") or {}
    if not settings.DICTIONARY_CONFIG:
        refresh_dictionary()
    if is_tenants_mode():
        dictionary_config = settings.DICTIONARY_CONFIG[schema_name or connection.tenant.schema_name]
    else:
        dictionary_config = settings.DICTIONARY_CONFIG
    return dictionary_config or {}


def get_dictionary_values(key, schema_name=None):
    """
    احصل على صفيف بيانات القاموس
    :param key: تكوين القاموس المقابلkeyقيمة(رقم القاموس)
    :param schema_name: استفادت من خلال تكوين القاموس المقابلschema_nameقيمة
    :return:
    """
    if dispatch_db_type == 'redis':
        dictionary_config = cache.get(f"init_dictionary")
        if not dictionary_config:
            refresh_dictionary()
            dictionary_config = cache.get(f"init_dictionary")
        return dictionary_config.get(key)
    dictionary_config = get_dictionary_config(schema_name)
    return dictionary_config.get(key)


def get_dictionary_label(key, name, schema_name=None):
    """
    احصل على القاموسlabelقيمة
    :param key: إدارة القاموس中的keyقيمة(رقم القاموس)
    :param name: تكوين القاموس المقابلvalueقيمة
    :param schema_name: استفادت من خلال تكوين القاموس المقابلschema_nameقيمة
    :return:
    """
    res = get_dictionary_values(key, schema_name) or []
    for ele in res.get('children'):
        if ele.get("value") == str(name):
            return ele.get("label")
    return ""


# ================================================= #
# ******************** تكوين النظام ******************** #
# ================================================= #
def get_system_config(schema_name=None):
    """
    获取تكوين النظام中所有配置
    1.فقطkey，العودة إلى جميع المستويات الفرعية，{ "الوالد -المستوىkey.المستوى الفرعيkey" : "قيمة" }
    2."الوالد -المستوىkey.المستوى الفرعيkey"，返回المستوى الفرعيقيمة
    :param schema_name: استفادت من خلال تكوين القاموس المقابلschema_nameقيمة
    :return:
    """
    if dispatch_db_type == 'redis':
        init_dictionary_data = cache.get(f"init_system_config")
        if not init_dictionary_data:
            refresh_system_config()
        return cache.get(f"init_system_config") or {}
    if not settings.SYSTEM_CONFIG:
        refresh_system_config()
    if is_tenants_mode():
        dictionary_config = settings.SYSTEM_CONFIG[schema_name or connection.tenant.schema_name]
    else:
        dictionary_config = settings.SYSTEM_CONFIG
    return dictionary_config or {}


def get_system_config_values(key, schema_name=None):
    """
    获取تكوين النظام数据数组
    :param key: 对应تكوين النظام的keyقيمة(رقم القاموس)
    :param schema_name: 对应تكوين النظام的租户schema_nameقيمة
    :return:
    """
    if dispatch_db_type == 'redis':
        system_config = cache.get(f"init_system_config")
        if not system_config:
            refresh_system_config()
            system_config = cache.get(f"init_system_config")
        return system_config.get(key)
    system_config = get_system_config(schema_name)
    return system_config.get(key)


def get_system_config_values_to_dict(key, schema_name=None):
    """
    获取تكوين النظام数据并转换为字典 **仅限于数组类型تكوين النظام
    :param key: 对应تكوين النظام的keyقيمة(رقم القاموس)
    :param schema_name: 对应تكوين النظام的租户schema_nameقيمة
    :return:
    """
    values_dict = {}
    config_values = get_system_config_values(key, schema_name)
    if not isinstance(config_values, list):
        raise CustomValidationError("该方式仅限于数组类型تكوين النظام")
    for ele in get_system_config_values(key, schema_name):
        values_dict[ele.get('key')] = ele.get('value')
    return values_dict


def get_system_config_label(key, name, schema_name=None):
    """
    获取获取تكوين النظامlabelقيمة
    :param key: تكوين النظام中的keyقيمة(رقم القاموس)
    :param name: 对应تكوين النظام的valueقيمة
    :param schema_name: 对应تكوين النظام的租户schema_nameقيمة
    :return:
    """
    children = get_system_config_values(key, schema_name) or []
    for ele in children:
        if ele.get("value") == str(name):
            return ele.get("label")
    return ""
