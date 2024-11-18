import { useState, useEffect } from 'react';
import TeacherLogin from './TeacherLogIn';

const TeacherSignIn = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    fatherName: '',
    department: '',
    email: '',
    password: '',
    additionalInfo: '',
  });

  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    fetch('/api/departments') // Получение списка кафедр из API
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка загрузки кафедр:', error);
        setIsLoading(false);
      });
  }, []);

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
    // Добавить логику для обработки отправки формы
  };

  if (showLogin) {
    return <TeacherLogin />;
  }

  return (
    <div className="panel">
      <h2>Регистрация преподавателя</h2>
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
          <label>Отчество:</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange}/>
        </div>
        <div className="formField">
          <label>Кафедра:</label>
          {isLoading ? (
            <p>Загрузка кафедр...</p>
          ) : (
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Выберите кафедру</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          )}
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
          <label>Дополнительная информация:</label>
          <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} required />
        </div>
        <button className="button" type="submit">Зарегистрироваться</button>
      </form>
      <h3>Уже есть запись? <a className="linkToPage" onClick={() => setShowLogin(true)}>Войти</a></h3>
    </div>
  );
};

export default TeacherSignIn;
