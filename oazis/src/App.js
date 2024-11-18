import { useState } from 'react';
import RoleSelectionPanel from './components/RoleSelectionPanel';
import StudentSignIn from './components/StudentSignIn';
import TeacherSignIn from './components/TeacherSignIn';
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
        <StudentSignIn />
      ) : selectedRole === 'teacher' ? (
        <TeacherSignIn />
      ) : (
        <RoleSelectionPanel onRoleSelect={handleRoleSelect} />
      )}
    </div>
  );
};

export default MainPage;
