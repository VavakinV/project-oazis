// import { useState, useEffect } from 'react';
// import Select from 'react-select';
// import TeacherCourseworks from './TeacherCourseworks';
// import '../css/TeacherLogin.css';

// const TeacherLogin = () => {
//     const [teachers, setTeachers] = useState([]);
//     const [selectedTeacher, setSelectedTeacher] = useState(null);
//     const [password, setPassword] = useState('');
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchTeachers = async () => {
//             try {
//                 const response = await fetch('http://127.0.0.1:8000/api/teachers/');
//                 if (!response.ok) throw new Error('Ошибка при загрузке данных');
//                 const data = await response.json();

//                 const formattedTeachers = data.map(teacher => ({
//                     value: teacher.id,
//                     label: `${teacher.lastname} ${teacher.firstname} ${teacher.fathername}`,
//                     rawData: teacher
//                 }));
//                 setTeachers(formattedTeachers);
//             } catch (error) {
//                 console.error('Ошибка при загрузке преподавателей:', error);
//                 setError('Не удалось загрузить список преподавателей');
//             }
//         };

//         fetchTeachers();
//     }, []);

//     const handleTeacherChange = (selectedOption) => {
//         setSelectedTeacher(selectedOption);
//         setError(null);
//     };

//     const handlePasswordChange = (e) => {
//         setPassword(e.target.value);
//         setError(null);
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
        
//         if (!selectedTeacher) {
//             setError('Пожалуйста, выберите преподавателя');
//             return;
//         }

//         if (!password) {
//             setError('Пожалуйста, введите пароль');
//             return;
//         }
        
//         try {
//             if (password !== 'demo') { // Заменить на реальную проверку
//                 throw new Error('Неверный пароль');
//             }

//             sessionStorage.setItem('currentTeacherId', selectedTeacher.value);
//             sessionStorage.setItem('teacherData', JSON.stringify(selectedTeacher.rawData));
            
//             setIsLoggedIn(true);
//         } catch (error) {
//             console.error('Ошибка входа:', error);
//             setError(error.message || 'Ошибка при входе');
//         }
//     };

//     if (isLoggedIn) return <TeacherCourseworks />;

//     return (
//         <div className="panel teacher-login-panel">
//             <h2 className="login-title">Вход для преподавателей</h2>
            
//             {error && (
//                 <div className="error-message">
//                     {error}
//                 </div>
//             )}

//             <form onSubmit={handleLogin}>
//                 <div className="formField">
//                     <label>Выберите ваш ФИО из списка:</label>
//                     <Select
//                         className="react-select-container"
//                         classNamePrefix="react-select"
//                         options={teachers}
//                         value={selectedTeacher}
//                         onChange={handleTeacherChange}
//                         placeholder="Начните вводить ФИО..."
//                         isSearchable
//                         noOptionsMessage={() => "Преподаватель не найден"}
//                         menuPortalTarget={document.body}
//                         styles={{
//                             menuPortal: base => ({ ...base, zIndex: 9999 }),
//                             control: (provided) => ({
//                                 ...provided,
//                                 cursor: 'pointer'
//                             }),
//                             option: (provided) => ({
//                                 ...provided,
//                                 cursor: 'pointer'
//                             })
//                         }}
//                     />
//                 </div>

//                 <div className="formField">
//                     <label>Пароль:</label>
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={handlePasswordChange}
//                         required
//                         className="password-input"
//                     />
//                 </div>

//                 <button 
//                     className="button login-button" 
//                     type="submit"
//                     disabled={!selectedTeacher || !password}
//                 >
//                     Войти
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default TeacherLogin;

import { useState, useEffect } from 'react';
import Select from 'react-select';
import TeacherCourseworks from './TeacherCourseworks';
import '../css/TeacherLogin.css';

const TeacherLogin = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/teachers/');
                if (!response.ok) throw new Error('Ошибка при загрузке данных');
                const data = await response.json();

                const formattedTeachers = data.map(teacher => ({
                    value: teacher.id,
                    label: `${teacher.lastname} ${teacher.firstname} ${teacher.fathername || ''}`.trim(),
                    rawData: teacher
                }));
                setTeachers(formattedTeachers);
            } catch (error) {
                console.error('Ошибка при загрузке преподавателей:', error);
                setError('Не удалось загрузить список преподавателей');
            }
        };

        fetchTeachers();
    }, []);

    const handleTeacherChange = (selectedOption) => {
        setSelectedTeacher(selectedOption);
        setError(null);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(null);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        if (!selectedTeacher) {
            setError('Пожалуйста, выберите преподавателя');
            setIsLoading(false);
            return;
        }

        if (!password) {
            setError('Пожалуйста, введите пароль');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/teacher-login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teacher_id: selectedTeacher.value,
                    password: password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при входе');
            }

            // Сохраняем данные преподавателя в sessionStorage
            sessionStorage.setItem('currentTeacherId', selectedTeacher.value);
            sessionStorage.setItem('teacherData', JSON.stringify(data.teacher));
            
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Ошибка входа:', error);
            setError(error.message || 'Неверный пароль или ошибка сервера');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoggedIn) return <TeacherCourseworks />;

    return (
        <div className="panel teacher-login-panel">
            <h2 className="login-title">Вход для преподавателей</h2>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div className="formField">
                    <label>Выберите ваш ФИО из списка:</label>
                    <Select
                        className="react-select-container"
                        classNamePrefix="react-select"
                        options={teachers}
                        value={selectedTeacher}
                        onChange={handleTeacherChange}
                        placeholder="Начните вводить ФИО..."
                        isSearchable
                        noOptionsMessage={() => "Преподаватель не найден"}
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                            control: (provided) => ({
                                ...provided,
                                cursor: 'pointer'
                            }),
                            option: (provided) => ({
                                ...provided,
                                cursor: 'pointer'
                            })
                        }}
                    />
                </div>

                <div className="formField">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        className="password-input"
                        disabled={isLoading}
                    />
                </div>

                <button 
                    className="button login-button" 
                    type="submit"
                    disabled={!selectedTeacher || !password || isLoading}
                >
                    {isLoading ? 'Проверка...' : 'Войти'}
                </button>
            </form>
        </div>
    );
};

export default TeacherLogin;