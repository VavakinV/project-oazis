from django import forms
from django.contrib import admin
from .models import Department, Student, Teacher, Coursework

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  # Поля для отображения в списке
    search_fields = ('name',)      # Поля для поиска
    ordering = ('name',)           # Сортировка по имени

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'firstname', 'lastname', 'fathername', 'group', 'email', 'contactInfo','registrationDate')  # Поля для отображения
    search_fields = ('lastname', 'firstname', 'fathername', 'email', 'group')                          # Поля для поиска
    list_filter = ('group', 'registrationDate')                                         # Фильтры по группе и дате
    ordering = ('lastname', 'firstname', 'fathername')                                               # Сортировка по ФИО
    fieldsets = (                                                                      # Группировка полей в форме
        ('Основная информация', {
            'fields': ('lastname', 'firstname', 'fathername', 'group', 'email', 'contactInfo')
        }),
        ('Пароль', {
            'fields': ('password',),
            'classes': ('collapse',),  # Скрыть раздел, раскрывается по клику
        }),
        ('Дополнительно', {
            'fields': ('registrationDate',),
        }),
    )
    readonly_fields = ('registrationDate',)  # Поля только для чтения

class TeacherAdminForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(render_value=True),
        required=False
    )
    
    class Meta:
        model = Teacher
        fields = '__all__'
    
    def save(self, commit=True):
        teacher = super().save(commit=False)
        password = self.cleaned_data.get('password')
        if password:
            teacher.set_password(password)
        if commit:
            teacher.save()
        return teacher

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'firstname', 'lastname', 'fathername', 'department', 'additionalInfo', 'registrationDate')  # Поля для отображения
    search_fields = ('lastname', 'firstname', 'fathername', 'department__name')                    # Поля для поиска
    list_filter = ('department', 'registrationDate')                                                       # Фильтры по департаменту и дате
    ordering = ('lastname', 'firstname', 'fathername')                                                     # Сортировка
    fieldsets = (                                                                                          # Группировка полей
        ('Основная информация', {
            'fields': ('lastname', 'firstname', 'fathername', 'department', 'additionalInfo')
        }),
        ('Пароль', {
            'fields': ('password',),
            'classes': ('collapse',),  # Скрыть раздел
        }),
        ('Дополнительно', {
            'fields': ('registrationDate',),
        }),
    )
    readonly_fields = ('registrationDate',)  # Поля только для чтения

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # Для существующего объекта скрываем текущий пароль
        if obj:
            form.base_fields['password'].help_text = "Оставьте пустым, чтобы сохранить текущий пароль"
        return form

@admin.register(Coursework)
class CourseworkAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'main_teacher', 'status', 'has_application', 'grade', 'creationDate')
    list_filter = ('status', 'has_application')
    search_fields = ('student__lastname', 'student__firstname', 'main_teacher', 'topic')
    ordering = ('student', 'main_teacher')
    readonly_fields = ('creationDate',) 

