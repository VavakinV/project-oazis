import { useState, useEffect } from 'react';
import '../css/StudentCourseworks.css';
import CourseworkApplicationForm from './CourseworkApplicationForm';
import StudentProfile from './StudentProfile';
import TeacherProfile from './TeacherProfile';

const StudentCourseworks = () => {
    const [courseworks, setCourseworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teachers, setTeachers] = useState({});
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showTeacherProfile, setShowTeacherProfile] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);

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

    const fetchCourseworks = async () => {
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

    useEffect(() => {
        if (!studentId) {
            setError('Студент не выбран');
            setLoading(false);
            return;
        }
        fetchCourseworks();
    }, [studentId]);

    const formatTeacherName = (teacher) => {
        if (!teacher) return 'Не указано';
        const { lastname = '', firstname = '', fathername = '' } = teacher;
        const firstInitial = firstname ? `${firstname[0]}.` : '';
        const fatherInitial = fathername ? ` ${fathername[0]}.` : '';
        return `${lastname} ${firstInitial}${fatherInitial}`.trim();
    };

    const handleNewApplication = () => {
        setShowApplicationForm(true);
    };

    const handleApplicationSubmitted = () => {
        setShowApplicationForm(false);
        fetchCourseworks();
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

    if (showApplicationForm) {
        return <CourseworkApplicationForm 
            studentId={studentId}
            onCancel={() => setShowApplicationForm(false)}
            onSuccess={handleApplicationSubmitted}
        />;
    }

    const handleProfileNavigation = () => {
        setShowProfile(true);
    };

    const handleReturnToCourseworks = () => {
        setShowProfile(false);
        setShowApplicationForm(false);
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
                <StudentProfile />
            </div>
        );
    }

    if (showApplicationForm) {
        return <CourseworkApplicationForm 
            studentId={studentId}
            onCancel={() => setShowApplicationForm(false)}
            onSuccess={handleApplicationSubmitted}
        />;
    }
    const handleTeacherClick = (teacherId) => {
        setSelectedTeacherId(teacherId);
        setShowTeacherProfile(true);
    };

    const handleBackFromProfile = () => {
        setShowTeacherProfile(false);
        setSelectedTeacherId(null);
    };

    if (showTeacherProfile) {
        return (
            <div className="panel">
                <button 
                    className="button back-button"
                    onClick={handleBackFromProfile}
                >
                    ← Назад к моим работам
                </button>
                <TeacherProfile id={selectedTeacherId} />
            </div>
        );
    }

    return (
        <div className="panel coursework-panel">
            <div className="coursework-header">
                <h2>Мои курсовые работы</h2>
                <div className="header-buttons">
                    <div className="action-buttons">
                        <button 
                            className="button profile-button"
                            onClick={handleProfileNavigation}
                        >
                            Профиль
                        </button>
                        <button 
                            className="button new-application-button"
                            onClick={handleNewApplication}
                        >
                            Подать новую заявку
                        </button>
                        <button 
                            className="button logout-button" 
                            onClick={handleLogout}
                        >
                            Выйти
                        </button>
                    </div>
                </div>
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
                                    <td>
                                        {cw.main_teacher && (
                                            <span 
                                                className="teacher-link"
                                                onClick={() => handleTeacherClick(cw.main_teacher)}
                                            >
                                                {teachers[cw.main_teacher] || '—'}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {cw.backup_teacher && (
                                            <span 
                                                className="teacher-link"
                                                onClick={() => handleTeacherClick(cw.backup_teacher)}
                                            >
                                                {teachers[cw.backup_teacher] || '—'}
                                            </span>
                                        )}
                                    </td>
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

