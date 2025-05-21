from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User

# Форма регистрации
class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

# Форма входа
class LoginForm(AuthenticationForm):
    username = forms.CharField(label="Имя пользователя")
    password = forms.CharField(label="Пароль", widget=forms.PasswordInput)


from django import forms
from django.contrib.auth.models import User

class ProfileSettingsForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email']  # Позволяем редактировать только email
        labels = {
            'email': 'Email',
        }