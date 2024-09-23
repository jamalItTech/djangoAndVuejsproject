# your_app/management/commands/dynamic_initialize.py

from django.core.management.base import BaseCommand
from django.apps import apps
from django.db.models import Model
from faker import Faker
from random import choice, randint

class Command(BaseCommand):
    help = 'Dynamically initialize data for all models'

    def handle(self, *args, **kwargs):
        fake = Faker()

        # استرداد جميع النماذج من التطبيق
        app_models = apps.get_models()

        for model in app_models:
            if not issubclass(model, Model):
                continue

            model_name = model.__name__
            fields = [field for field in model._meta.get_fields() if field.concrete and field.name != 'id']

            if not fields:
                self.stdout.write(self.style.WARNING(f'No concrete fields found for model {model_name}. Skipping.'))
                continue

            for _ in range(10):  # تحديد عدد السجلات التي ترغب في إنشائها
                obj_data = {}
                m2m_fields = []

                for field in fields:
                    field_type = field.get_internal_type()

                    if field_type == 'CharField':
                        obj_data[field.name] = fake.word()
                    elif field_type == 'TextField':
                        obj_data[field.name] = fake.text()
                    elif field_type == 'IntegerField':
                        obj_data[field.name] = fake.random_int(min=0, max=100)
                    elif field_type == 'PositiveIntegerField':
                        obj_data[field.name] = fake.random_int(min=1, max=100)  # قيمة موجبة
                    elif field_type == 'FloatField':
                        obj_data[field.name] = fake.random_number(digits=5, fix_len=False) / 100.0
                    elif field_type == 'DecimalField':
                        obj_data[field.name] = round(fake.pydecimal(left_digits=3, right_digits=2, positive=True), 2)
                    elif field_type == 'DateField':
                        obj_data[field.name] = fake.date_of_birth()
                    elif field_type == 'DateTimeField':
                        obj_data[field.name] = fake.date_time_this_decade()
                    elif field_type == 'TimeField':
                        obj_data[field.name] = fake.time()
                    elif field_type == 'BooleanField':
                        obj_data[field.name] = fake.boolean()
                    elif field_type == 'EmailField':
                        obj_data[field.name] = fake.unique.email()  # التأكد من أن البريد الإلكتروني فريد
                    elif field_type == 'URLField':
                        obj_data[field.name] = fake.url()
                    elif field_type == 'ChoiceField':
                        choices = [choice[0] for choice in field.choices]
                        obj_data[field.name] = choice(choices)
                    elif field_type == 'ManyToManyField':
                        m2m_fields.append(field)
                    elif field_type == 'ForeignKey':
                        related_model = field.related_model
                        related_instance = related_model.objects.first()
                        if related_instance:
                            obj_data[field.name] = related_instance
                    elif field_type == 'OneToOneField':
                        related_model = field.related_model
                        related_instance = related_model.objects.first()
                        if related_instance:
                            obj_data[field.name] = related_instance
                    elif field_type == 'FileField':
                        obj_data[field.name] = 'path/to/file.txt'
                    elif field_type == 'ImageField':
                        obj_data[field.name] = 'path/to/image.jpg'
                    else:
                        self.stdout.write(self.style.WARNING(f'Field type {field_type} not handled for model {model_name}.'))

                # إنشاء الكائن
                try:
                    obj = model.objects.create(**obj_data)
                    # تعيين القيم لعلاقات ManyToManyField
                    for m2m_field in m2m_fields:
                        related_model = m2m_field.related_model
                        related_instances = list(related_model.objects.all())
                        if related_instances:
                            instances = [choice(related_instances) for _ in range(randint(1, 3))]
                            getattr(obj, m2m_field.name).set(instances)
                    
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error creating {model_name} with data {obj_data}: {e}'))

        self.stdout.write(self.style.SUCCESS('Successfully initialized dynamic data for all models'))
