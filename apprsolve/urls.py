from django.urls import path

from . import views

urlpatterns = [
    path("cube/", views.cube, name='cube')
]