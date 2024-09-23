from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

class Person(models.Model):
    last_name = models.TextField()
    first_name = models.TextField()
    courses = models.ManyToManyField("Course", blank=True,related_name="courses_related")
    def __str__(self):
        return f"{self.last_name}, {self.first_name}"

    class Meta:
        verbose_name_plural = "People"
        ordering = ("last_name", "first_name")


class Course(models.Model):
    name = models.TextField()
    year = models.IntegerField()
    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name_plural = "Course"
        unique_together = ("name", "year", )

class Grade(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    grade = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)])
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    
    
    def __str__(self):
        return f"{self.grade}, {self.person}, {self.course}"