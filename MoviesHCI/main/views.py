from django.shortcuts import render

def home(request):
    return render(request, 'main/home.html', {'user': request.user})

# Удалены все функции, связанные с чатботом