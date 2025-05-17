from rest_framework import serializers
from .models import Student, Teacher, Department, Coursework

class StudentSerializer(serializers.ModelSerializer):
    lastname = serializers.RegexField(regex=r'^[A-Za-zА-ЯЁа-яё\-]+$', max_length=240, required=True)
    firstname = serializers.RegexField(regex=r'^[A-Za-zА-ЯЁа-яё\-]+$', max_length=240, required=True)
    fathername = serializers.RegexField(regex=r'^[A-Za-zА-ЯЁа-яё\-]+$', max_length=240, required=True)
    group = serializers.RegexField(regex=r'^[A-Za-z0-9А-ЯЁа-яё\-\.\/]+$', max_length=20, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(max_length=1000, required=True)
    contactInfo = serializers.CharField(max_length=1000)
    registrationDate = serializers.DateField(read_only=True)

    class Meta:
        model = Student
        fields = '__all__'
        extra_kwargs = {
            'contactInfo': {
                'required': False,
                'allow_blank': True
            },
        }

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
    password = serializers.CharField(max_length=1000, required=True)
    additionalInfo = serializers.CharField(max_length=1000)
    registrationDate = serializers.DateField(read_only=True)

    current_password = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Текущий пароль для подтверждения изменений"
    )

    class Meta:
        model = Teacher
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data.pop('password')
        teacher = Teacher(**validated_data)
        teacher.set_password(password)
        teacher.save()
        return teacher

    def update(self, instance, validated_data):
        current_password = validated_data.get('current_password')
        
        if not instance.check_password(current_password):
            raise serializers.ValidationError({"current_password": "Неверный пароль"})

        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class CourseworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coursework
        fields = '__all__'
        extra_kwargs = {
            'student': {'required': False},
            'main_teacher': {'required': False},
            'backup_teacher': {'required': False},
            'topic': {'required': False},
            'creationDate': {'read_only': True}
        }

class DepartmentSerializer(serializers.ModelSerializer):
    name = serializers.RegexField(regex=r'^[A-Za-zА-ЯЁа-яё\-]+$', max_length=240, required=True)

    class Meta:
        model = Department
        fields = '__all__'

    def create(self, validated_data):
        department = Department(**validated_data)
        department.save()
        return department

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance