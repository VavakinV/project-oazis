from django.db import models
from django.contrib.auth.hashers import make_password

class Department(models.Model):
    name = models.CharField("Name", max_length=240)

    def __str__(self):
        return f'{self.name}'

class Student(models.Model):
    lastname = models.CharField("Lastname", max_length=240)
    firstname = models.CharField("Firstname", max_length=240)
    group = models.CharField("Group", max_length=20)
    email = models.EmailField()
    password = models.CharField("Password", max_length=50)
    contactInfo = models.CharField("ContactInfo", max_length=500, blank=True, null=True)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)

    def __str__(self):
        return f'{self.firstname} {self.lastname}'

class Teacher(models.Model):
    lastname = models.CharField("Lastname", max_length=240)
    firstname = models.CharField("Firstname", max_length=240)
    fathername = models.CharField("Fathername", max_length=240, blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    email = models.EmailField()
    password = models.CharField("Password", max_length=50)
    additionalInfo = models.CharField("AdditionalInfo", max_length=500, blank=True, null=True)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)

    def __str__(self):
        return f'{self.firstname} {self.lastname}'