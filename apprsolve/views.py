from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.contrib import messages
from django.urls import reverse
import json

# fix deprecation of some aliases from collections.abc into collections in python3.10
# to satisfy import of rubik_solver
import collections.abc
collections.Iterable = collections.abc.Iterable
collections.Mapping = collections.abc.Mapping

from rubik_solver import utils

from apprsolve.rubik_init import register_new_user
from apprsolve.cube import Cube

# Create your views here.

# route /index
def index(request):
    # reset session data
    username = register_new_user(request)
    print('your username is ', username)
    context = {
        "name": username,
        "moves1": ["u", "U", "d", "D", "l", "L", "r", "R", "f", "F", "b", "B"],
        "moves2": ["m", "M", "s", "S", "e", "E", "x", "X", "y", "Y", "z", "Z"]
    }
    return render(request, "apprsolve/cube.html", context)

# route save/
def save(request):
    if request.method == "POST":
        cubed = json.loads(request.POST.get('cubed'))
        newcube = Cube()
        newcube.importCube(cubed)
        request.session['storedcube'] = newcube
        return JsonResponse(True, safe=False)

# route restore/
def restore(request):
    if request.method == "POST":
        try:
            # try to load stored cube
            sc = request.session.get('storedcube')
        except:
            # if error load default cube
            sc = Cube()
        ecube = {"cube": sc.exportCube()}
        return JsonResponse(ecube, safe=False)

# route /default 
# returns default cube
def default(request):
    if request.method == "POST":
        newCube = Cube()
        ecube = {"cube": newCube.exportCube()}
        return JsonResponse(ecube, safe=False)

def importCube(request):
    if request.method == "POST":
        cabeza = json.loads(request.POST.get('cabeza'))
        newCube = Cube()
        newCube.putCabezaNotation(cabeza)
        ecube = {"cube": newCube.exportCube()}
        return JsonResponse(ecube, safe=False)


# route solve
def solve(request):
    if request.method == "POST":
        cubed = json.loads(request.POST.get('cubed'))
        cabeza = Cube().importCube(cubed).getCabezaNotation()
        print("Solve request for cube ", cabeza)
        solution_list = utils.solve(cabeza, "Kociemba")
        print("Solution ", solution_list)
        translated_moves = []
        for move in solution_list:
            if move.double:
                translated_moves.append(move.face.lower())
                translated_moves.append(move.face.lower())
            elif move.clockwise:
                translated_moves.append(move.face.lower())
            else:
                translated_moves.append(move.face.upper())
        print("Solution translation", translated_moves)
        solution = {}
        solution["solution"] = translated_moves
        return JsonResponse(solution, safe=False)

