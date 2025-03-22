"""
URL configuration for oazis_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from oazis import views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^api/students/$', views.students_list),
    re_path(r'^api/students/([0-9])$', views.students_detail),
    re_path(r'^api/teachers/$', views.teachers_list),
    re_path(r'^api/teachers/([0-9])$', views.teachers_detail),
    re_path(r'^api/departments/$', views.departments_list),
    re_path(r'^api/departments/([0-9])$', views.departments_detail),
    re_path(r'api/courseworks/$', views.courseworks_list),
    re_path(r'api/courseworks/([0-9])$', views.courseworks_detail)
]