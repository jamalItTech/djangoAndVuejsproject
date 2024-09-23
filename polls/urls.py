from django.urls import path

from . import views
from .views import AuthorAutocompleteView

app_name = 'polls'
urlpatterns = [
    path('', views.index, name='index'),
    path('author-autocomplete/', AuthorAutocompleteView.as_view(), name='author-autocomplete'),

]