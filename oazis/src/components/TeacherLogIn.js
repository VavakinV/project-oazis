// import { useState, useEffect } from 'react';
// import Select from 'react-select';

// const TeacherLogin = () => {
//     const [teachers, setTeachers] = useState([]);
//     const [selectedTeacher, setSelectedTeacher] = useState(null);

//     useEffect(() => {
//             const fetchTeachers = async () => {
//                 try {
//                     const response = await fetch('http://127.0.0.1:8000/api/teachers/');
//                     if (!response.ok) {
//                         throw new Error('Ошибка при загрузке данных');
//                     }
//                     const data = await response.json();
    
//                     const formattedTeachers = data.map(teacher => ({
//                         value: teacher.id,
//                         label: `${teacher.lastname} ${teacher.firstname} ${teacher.fathername}`,
//                     }));
//                     setTeachers(formattedTeachers);
//                 } catch (error) {
//                     console.error('Ошибка при загрузкепреподавателей:', error);
//                 }
//             };
    
//             fetchTeachers();
//         }, []);

//     const [loginData, setLoginData] = useState({
//         id: '',
//         password: '',
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setLoginData({
//         ...loginData,
//         [name]: value,
//         });
//     };

//     const handleTeacherChange = (selectedOption) => {
//         setSelectedTeacher(selectedOption);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Отправленные данные для входа:', loginData);
//         // Логика отправки формы
//     };

//     return (
//         <div className="panel">
//         <h2>Вход</h2>
//         <form onSubmit={handleSubmit}>
//             <div className="formField">
//             <label>Выберите ваш ФИО из списка:</label>
//                 <Select
//                     options={teachers}
//                     value={selectedTeacher}
//                     onChange={handleTeacherChange}
//                     placeholder="Начинайте вводить ФИО..."
//                     isSearchable
//                     noOptionsMessage={() => "Преподаватель не найден"}
//                 />
//             </div>
//             <div className="formField">
//             <label>Пароль:</label>
//             <input
//                 type="password"
//                 name="password"
//                 value={loginData.password}
//                 onChange={handleChange}
//                 required
//             />
//             </div>
//             <button className="button" type="submit">Войти</button>
//         </form>
//         </div>
//     );
// };

// export default TeacherLogin;

import { useState, useEffect } from 'react';
import Select from 'react-select';
import TeacherCourseworks from './TeacherCourseworks';
import '../css/TeacherLogin.css'; // Создайте этот файл для стилей

const TeacherLogin = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/teachers/');
                if (!response.ok) throw new Error('Ошибка при загрузке данных');
                const data = await response.json();

                const formattedTeachers = data.map(teacher => ({
                    value: teacher.id,
                    label: `${teacher.lastname} ${teacher.firstname} ${teacher.fathername}`,
                    rawData: teacher // Сохраняем полные данные преподавателя
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
        
        if (!selectedTeacher) {
            setError('Пожалуйста, выберите преподавателя');
            return;
        }

        if (!password) {
            setError('Пожалуйста, введите пароль');
            return;
        }

        try {
            if (password !== 'demo') { // Заменить на реальную проверку
                throw new Error('Неверный пароль');
            }

            sessionStorage.setItem('currentTeacherId', selectedTeacher.value);
            sessionStorage.setItem('teacherData', JSON.stringify(selectedTeacher.rawData));
            
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Ошибка входа:', error);
            setError(error.message || 'Ошибка при входе');
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
                    />
                </div>

                <button 
                    className="button login-button" 
                    type="submit"
                    disabled={!selectedTeacher || !password}
                >
                    Войти
                </button>
            </form>
        </div>
    );
};

export default TeacherLogin;