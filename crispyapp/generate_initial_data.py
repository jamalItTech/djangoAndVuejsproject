import random
import string
from django.core.management.base import BaseCommand
from crispyapp.models import Person, Course, Grade

class Command(BaseCommand):
    help = "Generate 100 initial records for Person, Course, and Grade models"

    def handle(self, *args, **options):
        # Generate 100 Person records
        for _ in range(500):
            last_name = ''.join(random.choices(string.ascii_uppercase, k=random.randint(5, 15)))
            first_name = ''.join(random.choices(string.ascii_uppercase, k=random.randint(5, 15)))
            person = Person.objects.create(last_name=last_name, first_name=first_name)
            self.stdout.write(f"Created Person: {person}")

        # Generate 100 Course records
        for _ in range(500):
            name = ''.join(random.choices(string.ascii_uppercase, k=random.randint(5, 20)))
            year = random.randint(2000, 2023)
            course = Course.objects.create(name=name, year=year)
            self.stdout.write(f"Created Course: {course}")

        # Generate 100 Grade records
        for _ in range(500):
            person = random.choice(Person.objects.all())
            course = random.choice(Course.objects.all())
            grade = random.randint(0, 100)
            grade_obj = Grade.objects.create(person=person, course=course, grade=grade)
            self.stdout.write(f"Created Grade: {grade_obj}")

        self.stdout.write(self.style.SUCCESS("Successfully generated 100 initial records for each model."))