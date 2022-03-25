from django.urls import path

from . import views

urlpatterns = [
    path("cube/", views.cube, name='cube'),
    path("info/", views.info, name="info"),
    path("restore/", views.restore, name="restore")
]