import { useState } from 'react';
import RoleSelectionPanel from './components/RoleSelectionPanel';
import StudentLogIn from './components/StudentLogIn';
import TeacherLogIn from './components/TeacherLogIn';
import SiteLogo from './components/SiteLogo';

const MainPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleLogoClick = () => {
    setSelectedRole(null);
  };

  return (
    <div>
      <SiteLogo onLogoClick={handleLogoClick} />
      {selectedRole === 'student' ? (
        <StudentLogIn />
      ) : selectedRole === 'teacher' ? (
        <TeacherLogIn />
      ) : (
        <RoleSelectionPanel onRoleSelect={handleRoleSelect} />
      )}
    </div>
  );
};

export default MainPage;
