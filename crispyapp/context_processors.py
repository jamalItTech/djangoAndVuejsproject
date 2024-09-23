# context_processors.py

from django.contrib import admin

def admin_apps(request):
    """
    Custom context processor to provide the list of registered admin apps.
    """
    app_list = admin.site.get_app_list(request)
    return {'admin_app_list': app_list}
