from django import forms
from django_select2 import forms as s2forms
from .models import Author, Book

class AuthorSelect2Widget(s2forms.ModelSelect2Widget):
    search_fields = ['name__icontains']

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'author','published_date','isbn']
        widgets = {
            'author': AuthorSelect2Widget(url='author-autocomplete')
        }
