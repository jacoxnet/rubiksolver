from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render
from django.contrib import messages
from django.urls import reverse

from apprsolve.rubik_init import register_new_user

# Create your views here.

# route /cube
def cube(request):
    if request.method == "GET":
        # reset session data
        username = register_new_user(request)
        print('your username is ', username)
        context = {
            "name": username
        }
        return render(request, "apprsolve/cube.html", context)