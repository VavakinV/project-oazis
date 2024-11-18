const SiteLogo = ({ onLogoClick }) => {
    return (
      <div className="siteLogo" >
        <h1 onClick={onLogoClick} style={{ cursor: 'pointer' }}>ОАЗИС</h1>
      </div>
    );
  };
  
  export default SiteLogo;