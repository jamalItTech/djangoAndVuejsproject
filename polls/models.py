# models.py

from django.db import models

# 1. Basic Model with Common Fields
class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

# 2. Model with ForeignKey Relationship
class Author(models.Model):
    name = models.CharField(max_length=100)
    birthdate = models.DateField()

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    published_date = models.DateField()
    isbn = models.CharField(max_length=13, unique=True)

    def __str__(self):
        return self.title

# 3. Model with Many-to-Many Relationship
class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.title

class Student(models.Model):
    name = models.CharField(max_length=100)
    enrolled_courses = models.ManyToManyField(Course)

    def __str__(self):
        return self.name

# 4. Model with One-to-One Relationship
class Profile(models.Model):
    user = models.OneToOneField('Person', on_delete=models.CASCADE)
    bio = models.TextField()
    birthdate = models.DateField()

    def __str__(self):
        return self.user.first_name

# 5. Model with Custom Methods
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()

    def is_in_stock(self):
        return self.stock > 0

    def __str__(self):
        return self.name

# 6. Model with Choices Field
class Order(models.Model):
    STATUS_CHOICES = [
        ('P', 'Pending'),
        ('S', 'Shipped'),
        ('D', 'Delivered'),
    ]
    
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.get_status_display()}"

# 7. Model with FileField
class Document(models.Model):
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# 8. Model with AutoField and DateTimeField
class Event(models.Model):
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return self.title

# 9. Model with Abstract Base Class
class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class BlogPost(BaseModel):
    title = models.CharField(max_length=255)
    content = models.TextField()

    def __str__(self):
        return self.title

# 10. Model with JSONField (Django 3.1+)
class Config(models.Model):
    settings = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.settings)
