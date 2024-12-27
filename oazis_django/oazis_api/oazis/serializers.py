from rest_framework import serializers
from .models import Student, Teacher, Department

class StudentSerializer(serializers.ModelSerializer):
    lastname = serializers.RegexField(regex=r'^[A-Za-zА-ЯЁа-яё\-]+$', max_length=240, required=True)
    firstname = serializers.RegexField(regex=r'^[A-Za-zА-ЯЁа-яё\-]+$', max_length=240, required=True)
    group = serializers.RegexField(regex=r'^[A-Za-z0-9А-ЯЁа-яё\-\.\/]+$', max_length=20, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(max_length=50, required=True)
    contactInfo = serializers.CharField(max_length=500)
    registrationDate = serializers.DateField(read_only=True)

    class Meta:
        model = Student
        fields = ('pk', 'lastname', 'firstname', 'group', 'email', 'password', 'contactInfo', 'registrationDate')

    def create(self, validated_data):
        password = validated_data.pop('password')
        student = Student(**validated_data)
        student.set_password(password)
        student.save()
        return student

    def update(self, instance, validated_data):
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    

class TeacherSerializer(serializers.ModelSerializer):
    lastname = serializers.RegexField(regex=r'^[A-Za-zА-ЯЁа-яё\-]+$', max_length=240, required=True)
    firstname = serializers.RegexField(regex=r'^[A-Za-zА-ЯЁа-яё\-]+$', max_length=240, required=True)
    fathername = serializers.RegexField(regex=r'^[A-Za-zА-ЯЁа-яё\-]+$', max_length=240)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(max_length=50, required=True)
    additionalInfo = serializers.CharField(max_length=500)
    registrationDate = serializers.DateField(read_only=True)

    class Meta:
        model = Teacher
        fields = ('pk', 'lastname', 'firstname', 'fathername', 'department', 'email', 'password', 'additionalInfo', 'registrationDate')

    def create(self, validated_data):
        password = validated_data.pop('password')
        teacher = Teacher(**validated_data)
        teacher.set_password(password)
        teacher.save()
        return teacher

    def update(self, instance, validated_data):
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class DepartmentSerializer(serializers.ModelSerializer):
    name = serializers.RegexField(regex=r'^[A-Za-zА-ЯЁа-яё\-]+$', max_length=240, required=True)

    class Meta:
        model = Teacher
        fields = ('pk', 'name')

    def create(self, validated_data):
        department = Department(**validated_data)
        department.save()
        return department

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance