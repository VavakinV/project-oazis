import { useState } from 'react';
import TeacherSignIn from './TeacherSignIn';

const StudentLogin = () => {
    const [showSignIn, setShowSignIn] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
        ...loginData,
        [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Отправленные данные для входа:', loginData);
        // Здесь можно добавить логику для обработки отправки формы
    };

    if (showSignIn){
        return <TeacherSignIn/>
    }

    return (
        <div className="panel">
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
            <div className="formField">
            <label>Email:</label>
            <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
            />
            </div>
            <div className="formField">
            <label>Пароль:</label>
            <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
            />
            </div>
            <button className="button" type="submit">Войти</button>
        </form>
            <h3>Нет аккаунта? <a className="linkToPage" onClick={() => setShowSignIn(true)}>Зарегистрироваться</a></h3>
        </div>
    );
};

export default StudentLogin;