from django.db import models
from django.contrib.auth.hashers import make_password

class Student(models.Model):
    lastname = models.CharField("Lastname", max_length=240)
    firstname = models.CharField("Firstname", max_length=240)
    group = models.CharField("Group", max_length=20)
    email = models.EmailField()
    password = models.CharField("Password", max_length=50)
    contactInfo = models.CharField("ContactInfo", max_length=500)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)

    def __str__(self):
        return f'{self.firstname} {self.lastname}'