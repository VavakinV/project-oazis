import React, { useState, useEffect } from 'react';
import '../css/TeacherCourseworks.css';
import TeacherProfile from './TeacherProfile';
import StudentProfile from './StudentProfile'; 

const TeacherCourseworks = () => {
    const [courseworks, setCourseworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [showStudentProfile, setShowStudentProfile] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [editForm, setEditForm] = useState({
        status: '',
        grade: '',
        has_application: false
    });
    const [showProfile, setShowProfile] = useState(false);

    const teacherId = sessionStorage.getItem('currentTeacherId');

    const renderStatus = (status) => {
        switch (status) {
            case 0: return 'Отклонено';
            case 1: return 'Ожидание';
            case 2: return 'Одобрено';
            case 3: return 'Защищено';
            default: return 'Неизвестно';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 0: return 'status-rejected';
            case 1: return 'status-pending';
            case 2: return 'status-approved';
            case 3: return 'status-defended';
            default: return '';
        }
    };

    useEffect(() => {
        if (!teacherId) {
            setError('Преподаватель не выбран');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [courseworksRes, studentsRes] = await Promise.all([
                    fetch(`http://127.0.0.1:8000/api/courseworks/`),
                    fetch(`http://127.0.0.1:8000/api/students/`)
                ]);

                if (!courseworksRes.ok || !studentsRes.ok) {
                    throw new Error('Ошибка при загрузке данных');
                }

                const [courseworksData, studentsData] = await Promise.all([
                    courseworksRes.json(),
                    studentsRes.json()
                ]);

                const studentsMap = studentsData.reduce((acc, student) => {
                    acc[student.id] = formatStudentName(student);
                    return acc;
                }, {});

                setStudents(studentsMap);
                
                const teacherCourseworks = courseworksData.filter(
                    cw => cw.main_teacher == teacherId || cw.backup_teacher == teacherId
                );
                
                setCourseworks(teacherCourseworks);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [teacherId]);

    const formatStudentName = (student) => {
        if (!student) return 'Не указано';
        const { lastname = '', firstname = '', fathername = '' } = student;
        const firstInitial = firstname ? `${firstname[0]}.` : '';
        const fatherInitial = fathername ? ` ${fathername[0]}.` : '';
        return `${lastname} ${firstInitial}${fatherInitial}`.trim();
    };

    const handleEdit = (coursework) => {
        setEditingId(coursework.id);
        setEditForm({
            status: coursework.status,
            grade: coursework.grade || '',
            has_application: coursework.has_application
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (id) => {
        try {
            const formData = {
                status: parseInt(editForm.status),
                grade: editForm.grade ? parseInt(editForm.grade) : null,
                has_application: editForm.has_application,
                last_updated_by: teacherId
            };

            // Получение CSRF токена
            const getCsrfToken = () => {
                return document.cookie
                    .split('; ')
                    .find(row => row.startsWith('csrftoken='))
                    ?.split('=')[1] || '';
            };

            const response = await fetch(`http://127.0.0.1:8000/api/courseworks/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(),
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || Object.values(errorData).join(', '));
            }

            // Обновляем состояние
            const updatedData = await response.json();
            setCourseworks(courseworks.map(cw => 
                cw.id === id ? {...cw, ...updatedData} : cw
            ));
            setEditingId(null);
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert(`Ошибка: ${error.message}`);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('currentTeacherId');
        window.location.reload();
    };

    if (loading) return (
        <div className="panel">
            <div className="loading-spinner"></div>
            <p>Загрузка данных...</p>
        </div>
    );

    if (error) return (
        <div className="panel">
            <div className="error-message">
                <h2>Ошибка</h2>
                <p>{error}</p>
                <button className="button" onClick={handleLogout}>Выйти</button>
            </div>
        </div>
    );

    const handleProfileNavigation = () => {
        setShowProfile(true);
    };

    const handleReturnToCourseworks = () => {
        setShowProfile(false);
    };

    const handleStudentClick = (studentId) => {
        setSelectedStudentId(studentId);
        setShowStudentProfile(true);
    };

    const handleBackFromProfile = () => {
        setShowStudentProfile(false);
        setSelectedStudentId(null);
    };

    if (showProfile) {
        return (
            <div className="panel">
                <button 
                    className="button return-button"
                    onClick={handleReturnToCourseworks}
                >
                    ← Вернуться к курсовым работам
                </button>
                <TeacherProfile />
            </div>
        );
    }

    if (showStudentProfile) {
        return (
            <div className="panel">
                <button 
                    className="button back-button"
                    onClick={handleBackFromProfile}
                >
                    ← Назад к списку работ
                </button>
                <StudentProfile id={selectedStudentId} />
            </div>
        );
    }

    return (
        <div className="panel coursework-panel">
            <div className="coursework-header">
                <h2>Курсовые работы под моим руководством</h2>
                <div className="header-buttons">
                    <button 
                        className="button profile-button"
                        onClick={handleProfileNavigation}
                    >
                        Профиль
                    </button>
                    <button 
                        className="button logout-button" 
                        onClick={handleLogout}
                    >
                        Выйти
                    </button>
                </div>
            </div>
            
            {courseworks.length === 0 ? (
                <div className="no-courseworks">
                    <p>У вас нет курсовых работ</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="coursework-table">
                        <thead>
                            <tr>
                                <th className="topic-column">Тема работы</th>
                                <th>Студент</th>
                                <th>Роль</th>
                                <th>Статус</th>
                                <th>Заявление</th>
                                <th>Оценка</th>
                                <th>Дата</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseworks.map(cw => (
                                <tr key={cw.id} className="coursework-row">
                                    <td className="topic-cell" title={cw.topic || 'Тема не указана'}>
                                        {cw.topic || '—'}
                                    </td>
                                    <td>
                                        <span 
                                            className="student-link"
                                            onClick={() => handleStudentClick(cw.student)}
                                        >
                                            {students[cw.student] || '—'}
                                        </span>
                                    </td>
                                    <td>
                                        {cw.main_teacher == teacherId ? 'Основной' : 'Запасной'}
                                    </td>
                                    <td>
                                        {editingId === cw.id ? (
                                            <select
                                                name="status"
                                                value={editForm.status}
                                                onChange={handleInputChange}
                                                className="status-select"
                                            >
                                                <option value="0">Отклонено</option>
                                                <option value="1">Ожидание</option>
                                                <option value="2">Одобрено</option>
                                                <option value="3">Защищено</option>
                                            </select>
                                        ) : (
                                            <span className={`status-badge ${getStatusClass(cw.status)}`}>
                                                {renderStatus(cw.status)}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {editingId === cw.id ? (
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="has_application"
                                                    checked={editForm.has_application}
                                                    onChange={handleInputChange}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        ) : (
                                            <span className={`application-badge ${cw.has_application ? 'submitted' : 'not-submitted'}`}>
                                                {cw.has_application ? '✓' : '✗'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="grade-cell">
                                        {editingId === cw.id ? (
                                            <input
                                                type="number"
                                                name="grade"
                                                min="2"
                                                max="5"
                                                value={editForm.grade}
                                                onChange={handleInputChange}
                                                className="grade-input"
                                            />
                                        ) : (
                                            cw.grade || <span className="no-grade">—</span>
                                        )}
                                    </td>
                                    <td>
                                        {new Date(cw.creationDate).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className="actions-cell">
                                        {editingId === cw.id ? (
                                            <>
                                                <button 
                                                    className="button save-button"
                                                    onClick={() => handleSave(cw.id)}
                                                >
                                                    Сохранить
                                                </button>
                                                <button 
                                                    className="button cancel-button"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Отмена
                                                </button>
                                            </>
                                        ) : (
                                            <button 
                                                className="button edit-button"
                                                onClick={() => handleEdit(cw)}
                                            >
                                                Изменить
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeacherCourseworks;