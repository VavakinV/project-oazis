import { useState } from 'react';
import RoleSelectionPanel from './components/RoleSelectionPanel';
import StudentSignIn from './components/StudentSignIn';
import TeacherSignIn from './components/TeacherSignIn';

const MainPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    console.log("Выбранная роль: " + role);
    setSelectedRole(role);
  };

  if (selectedRole === 'student') {
    return <StudentSignIn />;
  } else if (selectedRole === 'teacher') {
    return <TeacherSignIn />;
  }

  return <RoleSelectionPanel onRoleSelect={handleRoleSelect} />;
};

export default MainPage;
