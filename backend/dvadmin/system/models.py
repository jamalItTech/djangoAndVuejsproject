import hashlib
import os
from pathlib import PurePosixPath

from django.contrib.auth.models import AbstractUser
from django.core.files.base import File
from django.db import models

from application import dispatch
from application.settings import BASE_DIR
from dvadmin.utils.models import CoreModel, table_prefix

STATUS_CHOICES = (
    (0, "إبطال"),
    (1, "فتح"),
)


class Users(CoreModel, AbstractUser):
    username = models.CharField(max_length=150, unique=True, db_index=True, verbose_name="حساب المستخدم",
                                help_text="حساب المستخدم")
    employee_no = models.CharField(max_length=150, unique=True, db_index=True, null=True, blank=True,
                                   verbose_name="رقم العمل", help_text="رقم العمل")
    email = models.EmailField(max_length=255, verbose_name="بريد", null=True, blank=True, help_text="بريد")
    mobile = models.CharField(max_length=255, verbose_name="الهاتف", null=True, blank=True, help_text="الهاتف")
    avatar = models.CharField(max_length=255, verbose_name="الصورة الرمزية", null=True, blank=True, help_text="الصورة الرمزية")
    name = models.CharField(max_length=40, verbose_name="اسم", help_text="اسم")
    GENDER_CHOICES = (
        (0, "مجهول"),
        (1, "ذكر"),
        (2, "أنثى"),
    )
    gender = models.IntegerField(
        choices=GENDER_CHOICES, default=0, verbose_name="جنس", null=True, blank=True, help_text="جنس"
    )
    USER_TYPE = (
        (0, "مستخدمي الخلفية"),
        (1, "مستخدمي مكتب الاستقبال"),
    )
    user_type = models.IntegerField(
        choices=USER_TYPE, default=0, verbose_name="نوع المستخدم", null=True, blank=True, help_text="نوع المستخدم"
    )
    post = models.ManyToManyField(to="Post", blank=True, verbose_name="الموقف المرتبط", db_constraint=False,
                                  help_text="الموقف المرتبط")
    role = models.ManyToManyField(to="Role", blank=True, verbose_name="الدور المرتبط", db_constraint=False,
                                  help_text="الدور المرتبط")
    dept = models.ForeignKey(
        to="Dept",
        verbose_name="قسم تابع",
        on_delete=models.PROTECT,
        db_constraint=False,
        null=True,
        blank=True,
        help_text="الإدارات ذات الصلة",
    )
    last_token = models.CharField(max_length=255, null=True, blank=True, verbose_name="تسجيل الدخول الأخيرToken",
                                  help_text="تسجيل الدخول الأخيرToken")

    def set_password(self, raw_password):
        super().set_password(hashlib.md5(raw_password.encode(encoding="UTF-8")).hexdigest())

    class Meta:
        db_table = table_prefix + "system_users"
        verbose_name = "ساعة المستخدم"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class Post(CoreModel):
    name = models.CharField(null=False, max_length=64, verbose_name="اسم الوظيفة", help_text="اسم الوظيفة")
    code = models.CharField(max_length=32, verbose_name="رمز الوظيفة", help_text="رمز الوظيفة")
    sort = models.IntegerField(default=1, verbose_name="أمر عمل", help_text="أمر عمل")
    STATUS_CHOICES = (
        (0, "يترك"),
        (1, "عمل"),
    )
    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name="حالة الموقف", help_text="حالة الموقف")

    class Meta:
        db_table = table_prefix + "system_post"
        verbose_name = "جدول الموضع"
        verbose_name_plural = verbose_name
        ordering = ("sort",)


class Role(CoreModel):
    name = models.CharField(max_length=64, verbose_name="اسم الشخصية", help_text="اسم الشخصية")
    key = models.CharField(max_length=64, unique=True, verbose_name="طابع متساهل", help_text="طابع متساهل")
    sort = models.IntegerField(default=1, verbose_name="ترتيب الأدوار", help_text="ترتيب الأدوار")
    status = models.BooleanField(default=True, verbose_name="حالة الشخصية", help_text="حالة الشخصية")
    admin = models.BooleanField(default=False, verbose_name="سواء كان ذلكadmin", help_text="سواء كان ذلكadmin")
    DATASCOPE_CHOICES = (
        (0, "فقط أذونات البيانات"),
        (1, "أذونات البيانات لهذا القسم وأقل"),
        (2, "أذونات البيانات من المقر"),
        (3, "جميع أذونات البيانات"),
        (4, "أذونات بيانات الائتمان"),
    )
    data_range = models.IntegerField(default=0, choices=DATASCOPE_CHOICES, verbose_name="نطاق أذونات البيانات",
                                     help_text="نطاق أذونات البيانات")
    remark = models.TextField(verbose_name="ملاحظة", help_text="ملاحظة", null=True, blank=True)
    dept = models.ManyToManyField(to="Dept", verbose_name="أذونات البيانات-الإدارات ذات الصلة", db_constraint=False,
                                  help_text="أذونات البيانات-الإدارات ذات الصلة")
    menu = models.ManyToManyField(to="Menu", verbose_name="القائمة ذات الصلة", db_constraint=False, help_text="القائمة ذات الصلة")
    permission = models.ManyToManyField(
        to="MenuButton", verbose_name="القائمة ذات الصلة的接口按钮", db_constraint=False, help_text="القائمة ذات الصلة的接口按钮"
    )

    class Meta:
        db_table = table_prefix + "system_role"
        verbose_name = "جدول الأحرف"
        verbose_name_plural = verbose_name
        ordering = ("sort",)


class Dept(CoreModel):
    name = models.CharField(max_length=64, verbose_name="اسم القسم", help_text="اسم القسم")
    key = models.CharField(max_length=64, unique=True, null=True, blank=True, verbose_name="الشخصية المرتبطة",
                           help_text="الشخصية المرتبطة")
    sort = models.IntegerField(default=1, verbose_name="عرض الفرز", help_text="عرض الفرز")
    owner = models.CharField(max_length=32, verbose_name="الشخص المسؤول", null=True, blank=True, help_text="الشخص المسؤول")
    phone = models.CharField(max_length=32, verbose_name="联系الهاتف", null=True, blank=True, help_text="联系الهاتف")
    email = models.EmailField(max_length=32, verbose_name="بريد", null=True, blank=True, help_text="بريد")
    status = models.BooleanField(default=True, verbose_name="حالة الإدارات", null=True, blank=True, help_text="حالة الإدارات")
    parent = models.ForeignKey(
        to="Dept",
        on_delete=models.CASCADE,
        default=None,
        verbose_name="قسم متفوق",
        db_constraint=False,
        null=True,
        blank=True,
        help_text="قسم متفوق",
        db_index=True
    )

    @classmethod
    def recursion_dept_info(cls, dept_id: int, dept_all_list=None, dept_list=None):
        """
        الحصول على جميع الإدارات التابعة في القسم بشكل متكرر
        :param dept_id: يجب الحصول عليهاid
        :param dept_all_list: جميع القوائم
        :param dept_list: عودةlist
        :return:
        """
        if not dept_all_list:
            dept_all_list = Dept.objects.values("id", "parent")
        if dept_list is None:
            dept_list = [dept_id]
        for ele in dept_all_list:
            if ele.get("parent") == dept_id:
                dept_list.append(ele.get("id"))
                cls.recursion_dept_info(ele.get("id"), dept_all_list, dept_list)
        return list(set(dept_list))

    class Meta:
        db_table = table_prefix + "system_dept"
        verbose_name = "جدول القسم"
        verbose_name_plural = verbose_name
        ordering = ("sort",)


class Menu(CoreModel):
    parent = models.ForeignKey(
        to="Menu",
        on_delete=models.CASCADE,
        verbose_name="قائمة متفوقة",
        null=True,
        blank=True,
        db_constraint=False,
        help_text="قائمة متفوقة",
    )
    icon = models.CharField(max_length=64, verbose_name="أيقونة القائمة", null=True, blank=True, help_text="أيقونة القائمة")
    name = models.CharField(max_length=64, verbose_name="اسم القائمة", help_text="اسم القائمة")
    sort = models.IntegerField(default=1, verbose_name="عرض الفرز", null=True, blank=True, help_text="عرض الفرز")
    ISLINK_CHOICES = (
        (0, "لا"),
        (1, "نعم"),
    )
    is_link = models.BooleanField(default=False, verbose_name="نعملا外链", help_text="نعملا外链")
    is_catalog = models.BooleanField(default=False, verbose_name="نعملا目录", help_text="نعملا目录")
    web_path = models.CharField(max_length=128, verbose_name="عنوان التوجيه", null=True, blank=True, help_text="عنوان التوجيه")
    component = models.CharField(max_length=128, verbose_name="عنوان المكون", null=True, blank=True, help_text="عنوان المكون")
    component_name = models.CharField(max_length=50, verbose_name="اسم المكون", null=True, blank=True,
                                      help_text="اسم المكون")
    status = models.BooleanField(default=True, blank=True, verbose_name="حالة القائمة", help_text="حالة القائمة")
    frame_out = models.BooleanField(default=False, blank=True, verbose_name="نعملا主框架外", help_text="نعملا主框架外")
    cache = models.BooleanField(default=False, blank=True, verbose_name="نعملا页面缓存", help_text="نعملا页面缓存")
    visible = models.BooleanField(default=True, blank=True, verbose_name="侧边栏وسطنعملا显示",
                                  help_text="侧边栏وسطنعملا显示")

    class Meta:
        db_table = table_prefix + "system_menu"
        verbose_name = "جدول القائمة"
        verbose_name_plural = verbose_name
        ordering = ("sort",)


class MenuButton(CoreModel):
    menu = models.ForeignKey(
        to="Menu",
        db_constraint=False,
        related_name="menuPermission",
        on_delete=models.PROTECT,
        verbose_name="القائمة ذات الصلة",
        help_text="القائمة ذات الصلة",
    )
    name = models.CharField(max_length=64, verbose_name="اسم", help_text="اسم")
    value = models.CharField(max_length=64, verbose_name="سلطة", help_text="سلطة")
    api = models.CharField(max_length=200, verbose_name="عنوان الواجهة", help_text="عنوان الواجهة")
    METHOD_CHOICES = (
        (0, "GET"),
        (1, "POST"),
        (2, "PUT"),
        (3, "DELETE"),
    )
    method = models.IntegerField(default=0, verbose_name="طريقة طلب الواجهة", null=True, blank=True,
                                 help_text="طريقة طلب الواجهة")

    class Meta:
        db_table = table_prefix + "system_menu_button"
        verbose_name = "طاولة إذن المواد"
        verbose_name_plural = verbose_name
        ordering = ("-name",)


class Dictionary(CoreModel):
    TYPE_LIST = (
        (0, "text"),
        (1, "number"),
        (2, "date"),
        (3, "datetime"),
        (4, "time"),
        (5, "files"),
        (6, "boolean"),
        (7, "images"),
    )
    label = models.CharField(max_length=100, blank=True, null=True, verbose_name="字典اسم", help_text="字典اسم")
    value = models.CharField(max_length=200, blank=True, null=True, verbose_name="رقم القاموس",
                             help_text="رقم القاموس/القيمة الفعلية")
    parent = models.ForeignKey(
        to="self",
        related_name="sublist",
        db_constraint=False,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        verbose_name="الوالد -المستوى",
        help_text="الوالد -المستوى",
    )
    type = models.IntegerField(choices=TYPE_LIST, default=0, verbose_name="نوع البيانات", help_text="نوع البيانات")
    color = models.CharField(max_length=20, blank=True, null=True, verbose_name="لون", help_text="لون")
    is_value = models.BooleanField(default=False, verbose_name="سواء كان ذلكvalueقيمة",
                                   help_text="سواء كان ذلكvalueقيمة,用来做具体قيمة存放")
    status = models.BooleanField(default=True, verbose_name="ولاية", help_text="ولاية")
    sort = models.IntegerField(default=1, verbose_name="عرض الفرز", null=True, blank=True, help_text="عرض الفرز")
    remark = models.CharField(max_length=2000, blank=True, null=True, verbose_name="ملاحظة", help_text="ملاحظة")

    class Meta:
        db_table = table_prefix + "system_dictionary"
        verbose_name = "قاموس"
        verbose_name_plural = verbose_name
        ordering = ("sort",)

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        super().save(force_insert, force_update, using, update_fields)
        dispatch.refresh_dictionary()  # تحديث تكوين القاموس مع التحديثات

    def delete(self, using=None, keep_parents=False):
        res = super().delete(using, keep_parents)
        dispatch.refresh_dictionary()
        return res


class OperationLog(CoreModel):
    request_modular = models.CharField(max_length=64, verbose_name="طلب وحدة", null=True, blank=True,
                                       help_text="طلب وحدة")
    request_path = models.CharField(max_length=400, verbose_name="طلب عنوان", null=True, blank=True,
                                    help_text="طلب عنوان")
    request_body = models.TextField(verbose_name="طلب المعلمات", null=True, blank=True, help_text="طلب المعلمات")
    request_method = models.CharField(max_length=8, verbose_name="طريقة طلب", null=True, blank=True,
                                      help_text="طريقة طلب")
    request_msg = models.TextField(verbose_name="وصف التشغيل", null=True, blank=True, help_text="وصف التشغيل")
    request_ip = models.CharField(max_length=32, verbose_name="بسألipعنوان", null=True, blank=True,
                                  help_text="بسألipعنوان")
    request_browser = models.CharField(max_length=64, verbose_name="بسأل浏览器", null=True, blank=True,
                                       help_text="بسأل浏览器")
    response_code = models.CharField(max_length=32, verbose_name="响应ولاية码", null=True, blank=True,
                                     help_text="响应ولاية码")
    request_os = models.CharField(max_length=64, verbose_name="نظام التشغيل", null=True, blank=True, help_text="نظام التشغيل")
    json_result = models.TextField(verbose_name="إرجاع المعلومات", null=True, blank=True, help_text="إرجاع المعلومات")
    status = models.BooleanField(default=False, verbose_name="响应ولاية", help_text="响应ولاية")

    class Meta:
        db_table = table_prefix + "system_operation_log"
        verbose_name = "سجل التشغيل"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


def media_file_name(instance, filename):
    h = instance.md5sum
    basename, ext = os.path.splitext(filename)
    return PurePosixPath("files", h[:1], h[1:2], h + ext.lower())


class FileList(CoreModel):
    name = models.CharField(max_length=200, null=True, blank=True, verbose_name="اسم", help_text="اسم")
    url = models.FileField(upload_to=media_file_name, null=True, blank=True, )
    file_url = models.CharField(max_length=255, blank=True, verbose_name="وثيقةعنوان", help_text="وثيقةعنوان")
    engine = models.CharField(max_length=100, default='local', blank=True, verbose_name="محرك", help_text="محرك")
    mime_type = models.CharField(max_length=100, blank=True, verbose_name="Mimeيكتب", help_text="Mimeيكتب")
    size = models.BigIntegerField(default=0, blank=True, verbose_name="حجم الملف", help_text="حجم الملف")
    md5sum = models.CharField(max_length=36, blank=True, verbose_name="وثيقةmd5", help_text="وثيقةmd5")

    @classmethod
    def save_file(cls, request, file_path, file_name, mime_type):
        # يحفظFile modelوسط
        instance = FileList()
        instance.name = file_name
        instance.engine = dispatch.get_system_config_values("file_storage.file_engine") or 'local'
        instance.file_url = os.path.join(file_path, file_name)
        instance.mime_type = mime_type
        instance.creator = request.user
        instance.modifier = request.user.id
        instance.dept_belong_id = request.user.dept_id

        file_backup = dispatch.get_system_config_values("file_storage.file_backup")
        file_engine = dispatch.get_system_config_values("file_storage.file_engine") or 'local'
        if file_backup:
            instance.url = os.path.join(file_path.replace('media/', ''), file_name)
        if file_engine == 'oss':
            from dvadmin_cloud_storage.views.aliyun import ali_oss_upload
            with open(os.path.join(BASE_DIR, file_path, file_name), 'rb') as file:
                file_path = ali_oss_upload(file, file_name=os.path.join(file_path.replace('media/', ''), file_name))
                if file_path:
                    instance.file_url = file_path
                else:
                    raise ValueError("فشل التحميل")
        elif file_engine == 'cos':
            from dvadmin_cloud_storage.views.tencent import tencent_cos_upload
            with open(os.path.join(BASE_DIR, file_path, file_name), 'rb') as file:
                file_path = tencent_cos_upload(file, file_name=os.path.join(file_path.replace('media/', ''), file_name))
                if file_path:
                    instance.file_url = file_path
                else:
                    raise ValueError("فشل التحميل")
        else:
            instance.url = os.path.join(file_path.replace('media/', ''), file_name)
        instance.save()
        return instance

    def save(self, *args, **kwargs):
        if not self.md5sum and self.url:  # file is new
            md5 = hashlib.md5()
            for chunk in self.url.chunks():
                md5.update(chunk)
            self.md5sum = md5.hexdigest()
        if not self.size and self.url:
            self.size = self.url.size
        if not self.file_url:
            url = media_file_name(self, self.name)
            self.file_url = f'media/{url}'
        super(FileList, self).save(*args, **kwargs)

    class Meta:
        db_table = table_prefix + "system_file_list"
        verbose_name = "وثيقة管理"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class Area(CoreModel):
    name = models.CharField(max_length=100, verbose_name="اسم", help_text="اسم")
    code = models.CharField(max_length=20, verbose_name="الترميز الإقليمي", help_text="الترميز الإقليمي", unique=True, db_index=True)
    level = models.BigIntegerField(verbose_name="المستوى الإقليمي(1مقاطعة 2مدينة 3المقاطعة والمقاطعة 4مستوى البلدة)",
                                   help_text="المستوى الإقليمي(1مقاطعة 2مدينة 3المقاطعة والمقاطعة 4مستوى البلدة)")
    pinyin = models.CharField(max_length=255, verbose_name="بينين", help_text="بينين")
    initials = models.CharField(max_length=20, verbose_name="الرسالة الأولى", help_text="الرسالة الأولى")
    enable = models.BooleanField(default=True, verbose_name="نعملافتح", help_text="نعملافتح")
    pcode = models.ForeignKey(
        to="self",
        verbose_name="父الترميز الإقليمي",
        to_field="code",
        on_delete=models.PROTECT,
        db_constraint=False,
        null=True,
        blank=True,
        help_text="父الترميز الإقليمي",
    )

    class Meta:
        db_table = table_prefix + "system_area"
        verbose_name = "الجدول الإقليمي"
        verbose_name_plural = verbose_name
        ordering = ("code",)

    def __str__(self):
        return f"{self.name}"


class ApiWhiteList(CoreModel):
    url = models.CharField(max_length=200, help_text="urlعنوان", verbose_name="url")
    METHOD_CHOICES = (
        (0, "GET"),
        (1, "POST"),
        (2, "PUT"),
        (3, "DELETE"),
    )
    method = models.IntegerField(default=0, verbose_name="طريقة طلب الواجهة", null=True, blank=True,
                                 help_text="طريقة طلب الواجهة")
    enable_datasource = models.BooleanField(default=True, verbose_name="激活أذونات البيانات", help_text="激活أذونات البيانات",
                                            blank=True)

    class Meta:
        db_table = table_prefix + "api_white_list"
        verbose_name = "قائمة تبييض الواجهة"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class SystemConfig(CoreModel):
    parent = models.ForeignKey(
        to="self",
        verbose_name="الوالد -المستوى",
        on_delete=models.PROTECT,
        db_constraint=False,
        null=True,
        blank=True,
        help_text="الوالد -المستوى",
    )
    title = models.CharField(max_length=50, verbose_name="عنوان", help_text="عنوان")
    key = models.CharField(max_length=200, verbose_name="مفتاح", help_text="مفتاح", db_index=True)
    value = models.JSONField(max_length=500, verbose_name="قيمة", help_text="قيمة", null=True, blank=True)
    sort = models.IntegerField(default=0, verbose_name="نوع", help_text="نوع", blank=True)
    status = models.BooleanField(default=True, verbose_name="فتحولاية", help_text="فتحولاية")
    data_options = models.JSONField(verbose_name="بياناتoptions", help_text="بياناتoptions", null=True, blank=True)
    FORM_ITEM_TYPE_LIST = (
        (0, "text"),
        (1, "datetime"),
        (2, "date"),
        (3, "textarea"),
        (4, "select"),
        (5, "checkbox"),
        (6, "radio"),
        (7, "img"),
        (8, "file"),
        (9, "switch"),
        (10, "number"),
        (11, "array"),
        (12, "imgs"),
        (13, "foreignkey"),
        (14, "manytomany"),
        (15, "time"),
    )
    form_item_type = models.IntegerField(
        choices=FORM_ITEM_TYPE_LIST, verbose_name="表单يكتب", help_text="表单يكتب", default=0, blank=True
    )
    rule = models.JSONField(null=True, blank=True, verbose_name="قواعد التحقق", help_text="قواعد التحقق")
    placeholder = models.CharField(max_length=100, null=True, blank=True, verbose_name="معلومات سريعة", help_text="معلومات سريعة")
    setting = models.JSONField(null=True, blank=True, verbose_name="إعدادات", help_text="إعدادات")

    class Meta:
        db_table = table_prefix + "system_config"
        verbose_name = "系统إعدادات表"
        verbose_name_plural = verbose_name
        ordering = ("sort",)
        unique_together = (("key", "parent_id"),)

    def __str__(self):
        return f"{self.title}"

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        # from application.websocketConfig import websocket_push
        # websocket_push("dvadmin", message={"sender": 'system', "contentType": 'SYSTEM',
        #                                    "content": '系统إعدادات有变化~', "systemConfig": True})

        super().save(force_insert, force_update, using, update_fields)
        dispatch.refresh_system_config()  # 有更新则刷新系统إعدادات

    def delete(self, using=None, keep_parents=False):
        res = super().delete(using, keep_parents)
        dispatch.refresh_system_config()
        from application.websocketConfig import websocket_push
        websocket_push("dvadmin", message={"sender": 'system', "contentType": 'SYSTEM',
                                           "content": '系统إعدادات有变化~', "systemConfig": True})

        return res


class LoginLog(CoreModel):
    LOGIN_TYPE_CHOICES = (
        (1, "تسجيل الدخول العادي"),
        (2, "تسجيل الدخول إلى رمز المسح العادي"),
        (3, "تسجيل دخول WeChat Scan Code"),
        (4, "تسجيل الدخول إلى رمز مسح الكتب الطائرة"),
        (5, "تسجيل دخول رمز تسمير"),
        (6, "تسجيل الدخول عبر الرسائل القصيرة")
    )
    username = models.CharField(max_length=150, verbose_name="تسجيل الدخول اسم المستخدم", null=True, blank=True,
                                help_text="تسجيل الدخول اسم المستخدم")
    ip = models.CharField(max_length=32, verbose_name="تسجيل الدخولip", null=True, blank=True, help_text="تسجيل الدخولip")
    agent = models.TextField(verbose_name="agentمعلومة", null=True, blank=True, help_text="agentمعلومة")
    browser = models.CharField(max_length=200, verbose_name="اسم المتصفح", null=True, blank=True, help_text="اسم المتصفح")
    os = models.CharField(max_length=200, verbose_name="نظام التشغيل", null=True, blank=True, help_text="نظام التشغيل")
    continent = models.CharField(max_length=50, verbose_name="ولاية", null=True, blank=True, help_text="ولاية")
    country = models.CharField(max_length=50, verbose_name="أمة", null=True, blank=True, help_text="أمة")
    province = models.CharField(max_length=50, verbose_name="مقاطعة", null=True, blank=True, help_text="مقاطعة")
    city = models.CharField(max_length=50, verbose_name="مدينة", null=True, blank=True, help_text="مدينة")
    district = models.CharField(max_length=50, verbose_name="مقاطعة", null=True, blank=True, help_text="مقاطعة")
    isp = models.CharField(max_length=50, verbose_name="المشغل", null=True, blank=True, help_text="المشغل")
    area_code = models.CharField(max_length=50, verbose_name="الكود الإقليمي", null=True, blank=True, help_text="الكود الإقليمي")
    country_english = models.CharField(max_length=50, verbose_name="الاسم الإنجليزي الكامل", null=True, blank=True,
                                       help_text="الاسم الإنجليزي الكامل")
    country_code = models.CharField(max_length=50, verbose_name="اختصار", null=True, blank=True, help_text="اختصار")
    longitude = models.CharField(max_length=50, verbose_name="خط الطول", null=True, blank=True, help_text="خط الطول")
    latitude = models.CharField(max_length=50, verbose_name="خط العرض", null=True, blank=True, help_text="خط العرض")
    login_type = models.IntegerField(default=1, choices=LOGIN_TYPE_CHOICES, verbose_name="تسجيل الدخوليكتب",
                                     help_text="تسجيل الدخوليكتب")

    class Meta:
        db_table = table_prefix + "system_login_log"
        verbose_name = "تسجيل الدخول日志"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class MessageCenter(CoreModel):
    title = models.CharField(max_length=100, verbose_name="عنوان", help_text="عنوان")
    content = models.TextField(verbose_name="محتوى", help_text="محتوى")
    target_type = models.IntegerField(default=0, verbose_name="目标يكتب", help_text="目标يكتب")
    target_user = models.ManyToManyField(to=Users, related_name='user', through='MessageCenterTargetUser',
                                         through_fields=('messagecenter', 'users'), blank=True, verbose_name="المستخدم المستهدف",
                                         help_text="المستخدم المستهدف")
    target_dept = models.ManyToManyField(to=Dept, blank=True, db_constraint=False,
                                         verbose_name="قسم الهدف", help_text="قسم الهدف")
    target_role = models.ManyToManyField(to=Role, blank=True, db_constraint=False,
                                         verbose_name="دور الهدف", help_text="دور الهدف")

    class Meta:
        db_table = table_prefix + "message_center"
        verbose_name = "消息وسط心"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class MessageCenterTargetUser(CoreModel):
    users = models.ForeignKey(Users, related_name="target_user", on_delete=models.CASCADE, db_constraint=False,
                              verbose_name="关联ساعة المستخدم", help_text="关联ساعة المستخدم")
    messagecenter = models.ForeignKey(MessageCenter, on_delete=models.CASCADE, db_constraint=False,
                                      verbose_name="关联消息وسط心表", help_text="关联消息وسط心表")
    is_read = models.BooleanField(default=False, blank=True, null=True, verbose_name="نعملا已读", help_text="نعملا已读")

    class Meta:
        db_table = table_prefix + "message_center_target_user"
        verbose_name = "消息وسط心目标ساعة المستخدم"
        verbose_name_plural = verbose_name
