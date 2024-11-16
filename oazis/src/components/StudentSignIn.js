import React, { useState } from 'react';

const StudentSignIn = () => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    group: '',
    email: '',
    password: '',
    contactInfo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Отправленные данные:', formData);
    // Здесь можно добавить логику для обработки отправки формы
  };

  return (
    <div className="panel">
      <h2>Регистрация студента</h2>
      <form onSubmit={handleSubmit}>
        <div className="formField">
          <label>Фамилия:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className="formField"> 
          <label>Имя:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="formField">
          <label>Группа:</label>
          <input type="text" name="group" value={formData.group} onChange={handleChange} required />
        </div>
        <div className="formField">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="formField">
          <label>Пароль:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="formField">
          <label>Контактная информация:</label>
          <textarea name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
        </div>
        <button className="button" type="submit">Зарегистрироваться</button>
      </form>
      <button className="button" onClick={() => console.log('Переход к странице логина')}>Уже есть запись? Войти</button>
    </div>
  );
};

export default StudentSignIn;
