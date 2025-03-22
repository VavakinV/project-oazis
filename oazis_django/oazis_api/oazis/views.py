from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

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

    if request.method == 'PUT':
        serializer = serializer_class(instance, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def students_list(request):
    return handle_list(request, Student, StudentSerializer)

@api_view(['PUT', 'DELETE'])
def students_detail(request, pk):
    return handle_detail(request, Student, StudentSerializer, pk)

@api_view(['GET', 'POST'])
def teachers_list(request):
    return handle_list(request, Teacher, TeacherSerializer)

@api_view(['PUT', 'DELETE'])
def teachers_detail(request, pk):
    return handle_detail(request, Teacher, TeacherSerializer, pk)

@api_view(['GET', 'POST'])
def departments_list(request):
    return handle_list(request, Department, DepartmentSerializer)

@api_view(['PUT', 'DELETE'])
def departments_detail(request, pk):
    return handle_detail(request, Department, DepartmentSerializer, pk)

@api_view(['GET', 'POST'])
def courseworks_list(request):
    return handle_list(request, Coursework, CourseworkSerializer)

@api_view(['PUT', 'DELETE'])
def courseworks_detail(request, pk):
    return handle_detail(request, Coursework, CourseworkSerializer, pk)
