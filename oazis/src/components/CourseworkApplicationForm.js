import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../css/CourseworkApplicationForm.css';

const CourseworkApplicationForm = ({ studentId, onCancel, onSuccess }) => {
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        main_teacher: null,
        backup_teacher: null,
        topic: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/teachers/');
                if (!response.ok) throw new Error('Ошибка загрузки преподавателей');
                const data = await response.json();
                
                const formattedTeachers = data.map(teacher => ({
                    value: teacher.id,
                    label: `${teacher.lastname} ${teacher.firstname} ${teacher.fathername}`
                }));
                
                setTeachers(formattedTeachers);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.main_teacher) {
            setError('Необходимо выбрать основного преподавателя');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/courseworks/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student: studentId,
                    main_teacher: formData.main_teacher.value,
                    backup_teacher: formData.backup_teacher?.value,
                    topic: formData.topic,
                    status: 1, // Статус "Ожидание"
                    has_application: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Ошибка создания заявки');
            }

            onSuccess();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="application-form-panel">
            <h2>Новая заявка на курсовую работу</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Основной преподаватель *</label>
                    <Select
                        options={teachers}
                        value={formData.main_teacher}
                        onChange={selected => setFormData({...formData, main_teacher: selected})}
                        isSearchable
                        placeholder="Выберите преподавателя..."
                        className="teacher-select"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Запасной преподаватель</label>
                    <Select
                        options={teachers}
                        value={formData.backup_teacher}
                        onChange={selected => setFormData({...formData, backup_teacher: selected})}
                        isSearchable
                        placeholder="Выберите преподавателя (необязательно)"
                        className="teacher-select"
                        isClearable
                    />
                </div>

                <div className="form-group">
                    <label>Тема работы</label>
                    <textarea
                        value={formData.topic}
                        onChange={e => setFormData({...formData, topic: e.target.value})}
                        placeholder="Введите тему работы (необязательно)"
                        rows="3"
                    />
                </div>

                <div className="form-buttons">
                    <button 
                        type="button" 
                        className="button cancel-button"
                        onClick={onCancel}
                    >
                        Отмена
                    </button>
                    <button 
                        type="submit" 
                        className="button submit-button"
                        disabled={!formData.main_teacher}
                    >
                        Подать заявку
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseworkApplicationForm;