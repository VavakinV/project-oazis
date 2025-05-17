from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.shortcuts import get_object_or_404

from .models import Student, Teacher, Department, Coursework
from .serializers import StudentSerializer, TeacherSerializer, DepartmentSerializer, CourseworkSerializer

def handle_list(request, model, serializer_class):
    if request.method == 'GET':
        data = model.objects.all()
        serializer = serializer_class(data, context={'request': request}, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def handle_detail(request, model, serializer_class, pk):
    try:
        instance = model.objects.get(pk=pk)
    except model.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = serializer_class(instance)
        return Response(serializer.data)

    if request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = serializer_class(
            instance, 
            data=request.data, 
            context={'request': request}, 
            partial=partial
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def students_list(request):
    return handle_list(request, Student, StudentSerializer)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def students_detail(request, pk):
    return handle_detail(request, Student, StudentSerializer, pk)

@api_view(['GET', 'POST'])
def teachers_list(request):
    return handle_list(request, Teacher, TeacherSerializer)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def teachers_detail(request, pk):
    return handle_detail(request, Teacher, TeacherSerializer, pk)

@api_view(['GET', 'POST'])
def departments_list(request):
    return handle_list(request, Department, DepartmentSerializer)

@api_view(['GET', 'PUT', 'DELETE'])
def departments_detail(request, pk):
    return handle_detail(request, Department, DepartmentSerializer, pk)

@api_view(['GET', 'POST'])
def courseworks_list(request):
    return handle_list(request, Coursework, CourseworkSerializer)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def courseworks_detail(request, pk):
    return handle_detail(request, Coursework, CourseworkSerializer, pk)

@api_view(['POST'])
def teacher_login(request):
    try:
        teacher_id = request.data.get('teacher_id')
        password = request.data.get('password')
        
        if not teacher_id or not password:
            return Response(
                {'message': 'Требуется teacher_id и пароль'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        teacher = get_object_or_404(Teacher, pk=teacher_id)
        
        if not teacher.check_password(password):
            return Response(
                {'message': 'Неверный пароль'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        serializer = TeacherSerializer(teacher)
        return Response({
            'message': 'Успешный вход',
            'teacher': serializer.data
        })
        
    except Exception as e:
        return Response(
            {'message': f'Ошибка сервера: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

