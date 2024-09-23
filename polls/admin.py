# your_app/admin.py

from django.contrib import admin
from .models import Person, Author, Book, Course, Student, Profile, Product, Order, Document, Event, BlogPost, Config

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'date_of_birth')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('date_of_birth',)
    ordering = ('last_name', 'first_name')

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'birthdate')
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'published_date', 'isbn')
    search_fields = ('title', 'author__name', 'isbn')
    list_filter = ('published_date', 'author')
    ordering = ('published_date', 'title')
    

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')
    search_fields = ('title',)
    ordering = ('title',)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    filter_horizontal = ('enrolled_courses',)  # For ManyToManyField
    ordering = ('name',)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio', 'birthdate')
    search_fields = ('user__username', 'bio')
    list_filter = ('birthdate',)
    ordering = ('user',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'is_in_stock')
    search_fields = ('name',)
    list_filter = ('price', 'stock')
    ordering = ('name',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'total_amount', 'order_date')
    search_fields = ('id',)
    list_filter = ('status', 'order_date')
    ordering = ('order_date',)

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'file', 'uploaded_at')
    search_fields = ('title',)
    list_filter = ('uploaded_at',)
    ordering = ('-uploaded_at',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'start_time', 'end_time')
    search_fields = ('title', 'location')
    list_filter = ('start_time', 'end_time')
    ordering = ('start_time',)

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at')
    search_fields = ('title', 'content')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)

@admin.register(Config)
class ConfigAdmin(admin.ModelAdmin):
    list_display = ('settings', 'updated_at')
    search_fields = ('settings',)
    ordering = ('-updated_at',)
