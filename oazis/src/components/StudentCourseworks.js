import React, { useState, useEffect } from 'react';
import '../css/StudentCourseworks.css';

const StudentCourseworks = () => {
    const [courseworks, setCourseworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teachers, setTeachers] = useState({});

    const studentId = sessionStorage.getItem('currentStudentId');
    
    // Функция для отображения статуса текстом
    const renderStatus = (status) => {
        switch (status) {
            case 0: return 'Отклонено';
            case 1: return 'Ожидание';
            case 2: return 'Одобрено';
            case 3: return 'Защищено';
            default: return 'Неизвестно';
        }
    };

    useEffect(() => {
        if (!studentId) {
            setError('Студент не выбран');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [courseworksRes, teachersRes] = await Promise.all([
                    fetch(`http://127.0.0.1:8000/api/courseworks/`),
                    fetch(`http://127.0.0.1:8000/api/teachers/`)
                ]);

                if (!courseworksRes.ok || !teachersRes.ok) {
                    throw new Error('Ошибка при загрузке данных');
                }

                const [courseworksData, teachersData] = await Promise.all([
                    courseworksRes.json(),
                    teachersRes.json()
                ]);

                const teachersMap = teachersData.reduce((acc, teacher) => {
                    acc[teacher.id] = formatTeacherName(teacher);
                    return acc;
                }, {});

                setTeachers(teachersMap);
                setCourseworks(courseworksData.filter(cw => cw.student == studentId));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    const formatTeacherName = (teacher) => {
        if (!teacher) return 'Не указано';
        const { lastname = '', firstname = '', fathername = '' } = teacher;
        const firstInitial = firstname ? `${firstname[0]}.` : '';
        const fatherInitial = fathername ? ` ${fathername[0]}.` : '';
        return `${lastname} ${firstInitial}${fatherInitial}`.trim();
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

    const handleLogout = () => {
        sessionStorage.removeItem('currentStudentId');
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

    return (
        <div className="panel coursework-panel">
            <div className="coursework-header">
                <h2>Мои курсовые работы</h2>
                <button className="button logout-button" onClick={handleLogout}>
                    Выйти
                </button>
            </div>
            
            {courseworks.length === 0 ? (
                <div className="no-courseworks">
                    <p>У вас нет активных курсовых работ</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="coursework-table">
                        <thead>
                            <tr>
                                <th className="topic-column">Тема работы</th>
                                <th>Руководитель</th>
                                <th>Запасной руководитель</th>
                                <th>Статус</th>
                                <th>Заявление</th>
                                <th>Оценка</th>
                                <th>Дата</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseworks.map(cw => (
                                <tr key={cw.id} className="coursework-row">
                                    <td className="topic-cell" title={cw.topic || 'Тема не указана'}>
                                        {cw.topic || '—'}
                                    </td>
                                    <td>{teachers[cw.main_teacher] || '—'}</td>
                                    <td>{cw.backup_teacher ? (teachers[cw.backup_teacher] || '—') : '—'}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(cw.status)}`}>
                                            {renderStatus(cw.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`application-badge ${cw.has_application ? 'submitted' : 'not-submitted'}`}>
                                            {cw.has_application ? '✓' : '✗'}
                                        </span>
                                    </td>
                                    <td className="grade-cell">
                                        {cw.grade || (
                                            <span className="no-grade">—</span>
                                        )}
                                    </td>
                                    <td>
                                        {new Date(cw.creationDate).toLocaleDateString('ru-RU')}
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

export default StudentCourseworks;