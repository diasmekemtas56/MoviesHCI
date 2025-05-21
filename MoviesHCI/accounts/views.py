from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import RegisterForm, LoginForm
from django.contrib import messages

# Регистрация
def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            login(request, user)
            messages.success(request, "Регистрация прошла успешно!")
            return redirect('home')  # Перенаправление на главную страницу
    else:
        form = RegisterForm()
    return render(request, 'accounts/register.html', {'form': form})

# Вход
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, "Вы успешно вошли!")
                return redirect('home')
            else:
                messages.error(request, "Неверное имя пользователя или пароль.")
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form})

# Выход
def logout_view(request):
    logout(request)
    messages.success(request, "Вы вышли из системы.")
    return redirect('login')

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import ProfileSettingsForm

@login_required
def profile_settings_view(request):
    if request.method == 'POST':
        form = ProfileSettingsForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Настройки профиля обновлены!")
            return redirect('home')
    else:
        form = ProfileSettingsForm(instance=request.user)
    return render(request, 'accounts/profile_settings.html', {'form': form})


