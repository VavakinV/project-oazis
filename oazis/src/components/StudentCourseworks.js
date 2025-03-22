import React, { useState, useEffect } from 'react';

const StudentCourseworks = () => {
    const [courseworks, setCourseworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const studentId = sessionStorage.getItem('currentStudentId');

    // Загрузка курсовых работ студента
    useEffect(() => {
        if (!studentId) {
            setError('Студент не выбран');
            setLoading(false);
            return;
        }

        const fetchCourseworks = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/courseworks/`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных');
                }
                const data = await response.json();

                // Фильтруем курсовые работы по ID студента
                const studentCourseworks = data.filter(cw => cw.student == studentId);
                setCourseworks(studentCourseworks);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseworks();
    }, [studentId]);

    // Отображение статуса курсовой работы
    const renderStatus = (status) => {
        switch (status) {
            case 0:
                return 'Отклонено';
            case 1:
                return 'Ожидание';
            case 2:
                return 'Одобрено';
            case 3:
                return 'Защищено';
            default:
                return 'Неизвестно';
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <div className="panel">
            <h2>Мои курсовые работы</h2>
            {courseworks.length === 0 ? (
                <p>У вас нет курсовых работ.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Тема</th>
                            <th>Основной преподаватель</th>
                            <th>Запасной преподаватель</th>
                            <th>Статус</th>
                            <th>Заявление</th>
                            <th>Оценка</th>
                            <th>Дата создания</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseworks.map(cw => (
                            <tr key={cw.id}>
                                <td>{cw.topic || 'Не указано'}</td>
                                <td>{cw.main_teacher}</td>
                                <td>{cw.backup_teacher || 'Не указано'}</td>
                                <td>{renderStatus(cw.status)}</td>
                                <td>{cw.has_application ? 'Да' : 'Нет'}</td>
                                <td>{cw.grade || 'Не оценено'}</td>
                                <td>{new Date(cw.creationDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentCourseworks;