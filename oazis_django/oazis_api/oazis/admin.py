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

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'firstname', 'lastname', 'fathername', 'department', 'email', 'additionalInfo', 'registrationDate')  # Поля для отображения
    search_fields = ('lastname', 'firstname', 'fathername', 'email', 'department__name')                    # Поля для поиска
    list_filter = ('department', 'registrationDate')                                                       # Фильтры по департаменту и дате
    ordering = ('lastname', 'firstname', 'fathername')                                                     # Сортировка
    fieldsets = (                                                                                          # Группировка полей
        ('Основная информация', {
            'fields': ('lastname', 'firstname', 'fathername', 'department', 'email', 'additionalInfo')
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

@admin.register(Coursework)
class CourseworkAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'main_teacher', 'status', 'has_application', 'grade', 'creationDate')
    list_filter = ('status', 'has_application')
    search_fields = ('student__lastname', 'student__firstname', 'main_teacher', 'topic')
    ordering = ('student', 'main_teacher')
    readonly_fields = ('creationDate',) 

