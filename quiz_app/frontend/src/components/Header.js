import React from 'react';

const Header = React.memo(function Header() {
  return (
    <div className="header">
      <h1>CCDM Quiz Application</h1>
      <p>Test your Clinical Data Management knowledge</p>
    </div>
  );
});

export default Header;