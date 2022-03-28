from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name='index'),
    path("save/", views.save, name="save"),
    path("default/", views.default, name="default"),
    path("solve/", views.solve, name="solve")
]