import React, { useState, useEffect } from 'react';
import '../css/TeacherProfile.css';

const TeacherProfile = ({ id }) => {
    const teacherId = id || sessionStorage.getItem('currentTeacherId');

    const [teacherData, setTeacherData] = useState(null);
    const [department, setDepartment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!teacherId) return;
        const fetchData = async () => {
            try {
                const teacherResponse = await fetch(`http://127.0.0.1:8000/api/teachers/${teacherId}/`);
                if (!teacherResponse.ok) throw new Error('Ошибка загрузки данных преподавателя');
                const teacher = await teacherResponse.json();

                if (teacher.department) {
                    const departmentResponse = await fetch(`http://127.0.0.1:8000/api/departments/${teacher.department}/`);
                    if (!departmentResponse.ok) throw new Error('Ошибка загрузки данных кафедры');
                    const departmentData = await departmentResponse.json();
                    setDepartment(departmentData.name);
                }

                setTeacherData(teacher);
                setEditedData({
                    additionalInfo: teacher.additionalInfo
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (teacherId) fetchData();
    }, [teacherId]);

    const handleLogout = () => {
        sessionStorage.removeItem('currentTeacherId');
        window.location.reload();
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({
            additionalInfo: teacherData.additionalInfo
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            if (!password) {
                throw new Error('Введите пароль для подтверждения изменений');
            }

            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1] || '';

            const body = {
                additionalInfo: editedData.additionalInfo,
                current_password: password
            };

            const response = await fetch(`http://127.0.0.1:8000/api/teachers/${teacherId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || Object.values(errorData).join(', '));
            }

            const updatedData = await response.json();
            setTeacherData(updatedData);
            setIsEditing(false);
            setPassword('');
            alert('Изменения успешно сохранены!');
        } catch (err) {
            console.error('Ошибка сохранения:', err);
            alert(`Ошибка: ${err.message}`);
        }
    };

    if (loading) return <div className="loading">Загрузка профиля...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;

    return (
        <div className="teacher-profile">
            <div className="profile-header">
                <h2>Профиль преподавателя</h2>
                <div className="header-buttons">
                    {!isEditing && (
                        <button className="button edit-button" onClick={handleEditClick}>
                            Редактировать
                        </button>
                    )}
                    <button className="button logout-button" onClick={handleLogout}>
                        Выйти
                    </button>
                </div>
            </div>

            <div className="profile-content">
                <div className="personal-info">
                    <h3>{teacherData.lastname} {teacherData.firstname} {teacherData.fathername || ''}</h3>
                    <p><strong>Кафедра:</strong> {department}</p>
                    <p><strong>Дата регистрации: </strong> 
                        {new Date(teacherData.registrationDate).toLocaleDateString('ru-RU')}
                    </p>
                </div>

                <div className="additional-info">
                    <h3>Дополнительная информация</h3>
                    {isEditing ? (
                        <>
                            <textarea
                                name="additionalInfo"
                                value={editedData.additionalInfo || ''}
                                onChange={handleInputChange}
                                className="edit-textarea"
                                placeholder="Введите дополнительную информацию..."
                            />
                            <div className="password-check">
                                <input
                                    type="password"
                                    placeholder="Текущий пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="password-input"
                                />
                            </div>
                            <div className="edit-buttons">
                                <button className="button save-button" onClick={handleSave}>
                                    Сохранить
                                </button>
                                <button className="button cancel-button" onClick={handleCancel}>
                                    Отмена
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>{teacherData.additionalInfo || 'Информация отсутствует'}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;