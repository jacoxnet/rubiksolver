from django.contrib.auth.models import User

def register_new_user(request):
    newusername = 'user' + str(User.objects.all().count())
    user = User.objects.create_user(newusername)
    user.save()
    request.session['user'] = user
    return newusername
