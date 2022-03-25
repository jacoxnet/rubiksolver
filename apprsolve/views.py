from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.contrib import messages
from django.urls import reverse
import json

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

# route /info
def info(request):
    if request.method == "POST":
        cubed = json.loads(request.POST.get('cubed'))
        print (cubed)
        return JsonResponse(cubed, safe=False)
 
# route /restore
def restore(request):
    if request.method == "POST":
        cubed = {'cubed': {'FLU': ['red', 'green', 'white'], 
                            'FU': ['orange', 'yellow'], 
                            'FRU': ['white', 'blue', 'orange'], 
                            'FL': ['blue', 'yellow'], 
                            'F': ['red'], 
                            'FR': ['green', 'white'], 
                            'FLD': ['yellow', 'green', 'orange'], 
                            'FD': ['white', 'red'], 
                            'FRD': ['red', 'yellow', 'green'], 
                            'L': ['blue'], 
                            'BL': ['green', 'red'], 
                            'BLD': ['orange', 'blue', 'yellow'], 
                            'LU': ['yellow', 'green'], 
                            'LD': ['green', 'orange'], 
                            'BLU': ['green', 'white', 'orange'], 
                            'U': ['yellow'], 
                            'BU': ['orange', 'white'], 
                            'RU': ['blue', 'orange'], 
                            'BRU': ['white', 'red', 'blue'], 
                            'B': ['orange'], 
                            'BR': ['red', 'green'], 
                            'BD': ['white', 'blue'], 
                            'BRD': ['blue', 'red', 'yellow'], 
                            'R': ['green'], 
                            'RD': ['blue', 'red'], 
                            'D': ['white']
                        }
                }
        return JsonResponse(cubed, safe=False)