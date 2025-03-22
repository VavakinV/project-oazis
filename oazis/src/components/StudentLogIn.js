import { useState, useEffect } from 'react';
import Select from 'react-select';
import StudentCourseworks from './StudentCourseworks';

const StudentLogin = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/students/');
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных');
                }
                const data = await response.json();

                const formattedStudents = data.map(student => ({
                    value: student.id,
                    label: `${student.lastname} ${student.firstname} ${student.fathername}`,
                }));
                setStudents(formattedStudents);
            } catch (error) {
                console.error('Ошибка при загрузке студентов:', error);
            }
        };

        fetchStudents();
    }, []);

    const handleStudentChange = (selectedOption) => {
        setSelectedStudent(selectedOption);
    };

    const handleLogin = () => {
        if (selectedStudent) {
            sessionStorage.setItem('currentStudentId', selectedStudent.value);
            console.log('Выбранный студент:', selectedStudent.value);
            setIsLoggedIn(true);
        } else {
            alert('Пожалуйста, выберите студента');
        }
    };

    if (isLoggedIn) {
        return <StudentCourseworks />;
    }

    return (
        <div className="panel">
            <h2>Вход</h2>
            <div className="formField">
                <label>Выберите ваш ФИО из списка:</label>
                <Select
                    options={students}
                    value={selectedStudent}
                    onChange={handleStudentChange}
                    placeholder="Начинайте вводить ФИО..."
                    isSearchable
                    noOptionsMessage={() => "Студент не найден"}
                />
            </div>
            <button className="button" onClick={handleLogin}>Войти</button>
        </div>
    );
};

export default StudentLogin;