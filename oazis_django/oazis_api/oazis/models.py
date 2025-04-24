from django.db import models
from django.contrib.auth.hashers import make_password

class Department(models.Model):
    name = models.CharField("Name", max_length=240)

    def __str__(self):
        return f'{self.name}'

class Student(models.Model):
    lastname = models.CharField("Lastname", max_length=240)
    firstname = models.CharField("Firstname", max_length=240)
    fathername = models.CharField("Fathername", max_length=240, blank=True, null=True)
    group = models.CharField("Group", max_length=20)
    email = models.EmailField(blank=True, null=True)
    password = models.CharField("Password", max_length=50, blank=True, null=True)
    contactInfo = models.CharField("ContactInfo", max_length=500, blank=True, null=True)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)

    def __str__(self):
        return f'{self.lastname} {self.firstname} {self.fathername}'

class Teacher(models.Model):
    lastname = models.CharField("Lastname", max_length=240)
    firstname = models.CharField("Firstname", max_length=240)
    fathername = models.CharField("Fathername", max_length=240, blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    password = models.CharField("Password", max_length=50)
    additionalInfo = models.CharField("AdditionalInfo", max_length=500, blank=True, null=True)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)
    
    def get_short_name(self):
        lastname = self.lastname.strip() if self.lastname else ''
        firstname = self.firstname.strip() if self.firstname else ''
        fathername = self.fathername.strip() if self.fathername else ''
        
        formatted_firstname = f"{firstname[0]}." if firstname else ''
        formatted_fathername = f" {fathername[0]}." if fathername else ''
        
        short_name = f"{lastname} {formatted_firstname}{formatted_fathername}".strip()
        return short_name

    def __str__(self):
        return f'{self.lastname} {self.firstname} {self.fathername}'

class Coursework(models.Model):
    STATUS_CHOICES = [
        (0, 'Отклонено'),
        (1, 'Ожидание'),
        (2, 'Одобрено'),
        (3, 'Защищено'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='courseworks', verbose_name='Студент')
    main_teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='main_courseworks', verbose_name='Основной преподаватель')
    backup_teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True, related_name='backup_courseworks', verbose_name='Запасной преподаватель')
    topic = models.CharField("Topic", max_length=500, blank=True, null=True)
    status = models.IntegerField("Status", choices=STATUS_CHOICES, default=1)
    has_application = models.BooleanField("Application signed", default=False)
    grade = models.IntegerField("Grade", blank=True, null=True)
    creationDate = models.DateField("Creation Date", auto_now_add=True)

    def __str__(self):
        return f'Курсовая работа студента {self.student} (Статус: {self.get_status_display()})'