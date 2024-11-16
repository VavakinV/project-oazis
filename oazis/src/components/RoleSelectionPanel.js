const RoleSelectionPanel = () => {
    const handleRoleSelect = (role) => {
      console.log("Выбранная роль: " + role.toString());
        if (role == "Студент"){
        }
        else if (role == "Преподаватель"){
  
        }
      };
  
    return (
      <div className="panel">
        <h1>Добро пожаловать!</h1>
        <h2>Выберите роль</h2>
        <div className="buttonContainer">
          <button className="button" onClick={() => handleRoleSelect('Студент')}>
            Студент
          </button>
          <button className="button" onClick={() => handleRoleSelect('Преподаватель')}>
            Преподаватель
          </button>
        </div>
      </div>
    );
  };
  
  export default RoleSelectionPanel;