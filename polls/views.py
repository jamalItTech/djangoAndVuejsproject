from django.shortcuts import render


def index(request):
    return render(request, 'polls/index.html')

from django.http import JsonResponse
from django_select2 import forms as s2forms
from .models import Author

class AuthorAutocompleteView(s2forms.ModelSelect2View):
    model = Author
    search_fields = ['name__icontains']