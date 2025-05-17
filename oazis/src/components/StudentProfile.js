import React, { useState, useEffect } from 'react';
import '../css/StudentProfile.css';

const StudentProfile = ({ id }) => {
    const studentId = id || sessionStorage.getItem('currentStudentId');

    const [studentData, setStudentData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!studentId) return;
        const fetchStudentData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/students/${studentId}/`);
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                const data = await response.json();
                setStudentData(data);
                setEditedData({
                    email: data.email,
                    contactInfo: data.contactInfo
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (studentId) fetchStudentData();
    }, [studentId]);

    const handleLogout = () => {
        sessionStorage.removeItem('currentStudentId');
        window.location.reload();
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({
            email: studentData.email,
            contactInfo: studentData.contactInfo
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
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1] || '';

            const response = await fetch(`http://127.0.0.1:8000/api/students/${studentId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    ...studentData,
                    ...editedData
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || Object.values(errorData).join(', '));
            }

            const updatedData = await response.json();
            setStudentData(updatedData);
            setIsEditing(false);
            alert('Изменения успешно сохранены!');
        } catch (err) {
            console.error('Ошибка сохранения:', err);
            alert(`Ошибка сохранения: ${err.message}`);
        }
    };

    if (loading) return <div className="loading">Загрузка профиля...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;

    return (
        <div className="student-profile">
            <div className="profile-header">
                <h2>Профиль студента</h2>
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
                    <h3>{studentData.lastname} {studentData.firstname} {studentData.fathername || ''}</h3>
                    <p><strong>Группа:</strong> {studentData.group}</p>
                    <p><strong>Дата регистрации:</strong> 
                        {new Date(studentData.registrationDate).toLocaleDateString('ru-RU')}
                    </p>
                </div>

                <div className="contact-info">
                    <h3>Контактная информация</h3>
                    {isEditing ? (
                        <>
                            <div className="form-field">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editedData.email || ''}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                    />
                            </div>
                            <div className="form-field">
                                <label>Контактные данные:</label>
                                <textarea
                                    name="contactInfo"
                                    value={editedData.contactInfo || ''}
                                    onChange={handleInputChange}
                                    className="edit-textarea"
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
                        <>
                            <p><strong>Email:</strong> {studentData.email || 'не указан'}</p>
                            <p><strong>Контактные данные:</strong> {studentData.contactInfo || 'не указаны'}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
