from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.contrib import messages
from django.urls import reverse
import json

from apprsolve.rubik_init import register_new_user
from apprsolve.cube import Cube

# Create your views here.

# route /index
def index(request):
    if request.method == "GET":
        # reset session data
        username = register_new_user(request)
        print('your username is ', username)
        context = {
            "name": username
        }
        return render(request, "apprsolve/cube.html", context)

# route /save
def save(request):
    if request.method == "POST":
        cubed = json.loads(request.POST.get('cubed'))
        print("printing cubed", cubed)
        newCube = Cube().importCube(cubed)
        print('printing newcube', newCube)
        return JsonResponse(cubed, safe=False)
 
# route /default 
# returns default cube
def default(request):
    if request.method == "POST":
        newCube = Cube()
        cubed = {}
        cubed['cubed'] = newCube.exportCube
        return JsonResponse(cubed, safe=False)

def solve(request):
    if request.method == "POST":
        cubed = json.loads(request.POST.get('cubed'))

