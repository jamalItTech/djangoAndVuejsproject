from faker import Faker
import random
import datetime
import uuid
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import IntegrityError

fake = Faker()

class Command(BaseCommand):
    help = "Generate 100 initial records for all models in the crispyapp"

    def handle(self, *args, **options):
        models = list(apps.get_app_config('accounting').get_models())

        # Sorting models so that parents come before their related models
        models.sort(key=lambda model: len(model._meta.related_objects))

        for model in models:
            model_name = model.__name__
            self.stdout.write(f"Generating 100 records for {model_name} model...")

            for _ in range(20):  # Generating 100 records per model
                field_values = self.generate_random_data(model)

                # Try to get an existing record, or create if not exists
                if not self.record_exists(model, field_values):
                    try:
                        instance = model.objects.create(**field_values)
                        self.stdout.write(f"Created {model_name} instance: {instance}")
                    except IntegrityError as e:
                        self.stderr.write(f"Error creating {model_name} instance: {e}")
                        continue

        self.stdout.write(self.style.SUCCESS("Successfully generated initial records for all models in the crispyapp."))

    def generate_random_data(self, model):
        field_values = {}
        email_set = set()  # Set to track unique emails

        for field in model._meta.fields:
            field_name = field.name
            if field_name == 'id':
                continue

            field_type = field.get_internal_type()
            if field_type == 'CharField':
                if field.choices:
                    field_values[field_name] = self.get_random_choice(field.choices)
                else:
                    max_length = field.max_length if field.max_length else 100
                    field_values[field_name] = fake.word()[:max_length]
            elif field_type == 'TextField':
                field_values[field_name] = fake.text(max_nb_chars=200)
            elif field_type == 'EmailField':
                email = fake.email()
                while email in email_set:
                    email = fake.email()
                email_set.add(email)
                field_values[field_name] = email
            elif field_type == 'URLField':
                field_values[field_name] = fake.url()
            elif field_type == 'IntegerField':
                min_value = getattr(field, 'min_value', 0)
                max_value = getattr(field, 'max_value', 100)
                field_values[field_name] = random.randint(int(min_value), int(max_value))
            elif field_type == 'PositiveIntegerField':
                min_value = getattr(field, 'min_value', 0)
                max_value = getattr(field, 'max_value', 2 ** 31 - 1)
                field_values[field_name] = random.randint(int(min_value), int(max_value))
            elif field_type == 'DateField':
                start_date = datetime.date(2023, 1, 1)
                end_date = datetime.date(2024, 12, 31)
                random_date = start_date + datetime.timedelta(seconds=random.randint(0, int((end_date - start_date).total_seconds())))
                field_values[field_name] = random_date
            elif field_type == 'DateTimeField':
                start_datetime = datetime.datetime(2023, 1, 1, 0, 0, 0)
                end_datetime = datetime.datetime(2024, 12, 31, 23, 59, 59)
                random_datetime = start_datetime + datetime.timedelta(seconds=random.randint(0, int((end_datetime - start_datetime).total_seconds())))
                field_values[field_name] = random_datetime
            elif field_type == 'DecimalField':
                max_digits = field.max_digits if field.max_digits else 10
                decimal_places = field.decimal_places if field.decimal_places else 2
                min_value = getattr(field, 'min_value', Decimal('-999.99'))
                max_value = getattr(field, 'max_value', Decimal('999.99'))
                min_int = int(min_value * (10 ** decimal_places))
                max_int = int(max_value * (10 ** decimal_places))
                field_values[field_name] = Decimal(random.randint(min_int, max_int)) / (10 ** decimal_places)
            elif field_type == 'FloatField':
                min_value = getattr(field, 'min_value', -3.402823e38)
                max_value = getattr(field, 'max_value', 3.402823e38)
                field_values[field_name] = random.uniform(min_value, max_value)
            elif field_type == 'SlugField':
                max_length = field.max_length if field.max_length else 50
                field_values[field_name] = fake.slug()[:max_length]
            elif field_type == 'UUIDField':
                field_values[field_name] = str(uuid.uuid4())
            elif field_type == 'BooleanField':
                field_values[field_name] = fake.boolean()
            elif field_type == 'ManyToManyField':
                related_model = field.related_model
                related_instances = related_model.objects.all()
                if related_instances:
                    field_values[field_name] = random.sample(list(related_instances), min(3, len(related_instances)))
            elif field_type == 'FileField' or field_type == 'ImageField':
                field_values[field_name] = fake.file_name(extension='jpg')
            elif field_type == 'JSONField':
                field_values[field_name] = fake.pydict()
            elif field_type == 'GenericIPAddressField':
                field_values[field_name] = fake.ipv4()
            elif field_type == 'TimeField':
                field_values[field_name] = fake.time_object()
            elif field_type == 'DurationField':
                field_values[field_name] = fake.time_delta()
            elif field_type == 'XMLField':
                field_values[field_name] = fake.text()
            elif field_type == 'ForeignKey':
                related_model = field.related_model
                related_instances = related_model.objects.all()
                if related_instances:
                    field_values[field_name] = random.choice(related_instances)
                else:
                    related_instance_values = self.generate_random_data(related_model)
                    related_instance = related_model.objects.create(**related_instance_values)
                    field_values[field_name] = related_instance
        return field_values

    def get_random_choice(self, choices):
        return random.choice(choices)[0]

    def record_exists(self, model, field_values):
        """Check if a record with the given field values already exists."""
        filters = {}
        for field_name, value in field_values.items():
            if value:
                filters[field_name] = value
        return model.objects.filter(**filters).exists()