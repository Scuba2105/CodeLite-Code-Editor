import { useState, useEffect, useRef } from 'react';
import icon from '../assets/app-logo-img-only.jpg';

// Define menu structural data
const menuData = {
  Equipment: [
    { label: 'Add New Equipment', action: 'add' },
    { label: 'Update Loan Equipment Register', action: 'loan' },
    { label: 'Update Trial Equipment Register', action: 'trial' },
    { label: 'View Equipment', action: 'view' }
  ],
  Jobs: [{ label: 'Open New Job', action: 'view-jobs' },
    { label: 'View All Jobs', action: 'view-jobs' },
    { label: 'View Active Jobs', action: 'view-jobs' },
    { label: 'View Completed Jobs', action: 'view-jobs' },
  ],
  Orders: [{ label: 'New Order', action: 'new-order' }],
  Parts: [{ label: 'Inventory', action: 'parts-inv' }],
  Officer: [{ label: 'Profile', action: 'profile' }],
  About: [{ label: 'App Version', action: 'version' }]
};

export function Titlebar() {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  // Close dropdowns if the user clicks anywhere outside the menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (menuName) => {
    // Toggle menu open/closed on click
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleSubItemClick = (action) => {
    console.log(`Executing action: ${action}`);
    setOpenMenu(null); // Close the menu after choice
    // Your routing / view-switching logic goes here
  };

  return (
    <div className="titlebar">
      <img className="app-icon" src={icon} alt="MedEq DB logo" />
      <h1 className="app-title roboto-logo-font">MedEq DB</h1>
      
      <menu className="main-menu" ref={menuRef}>
        {Object.keys(menuData).map((menuName) => (
          <li key={menuName} className="menu-container">
            <button 
              className={`menu-option centred ${openMenu === menuName ? 'active' : ''}`}
              onClick={() => handleOptionClick(menuName)}
            >
              {menuName}
            </button>

            {/* Render dropdown if this menu is open */}
            {openMenu === menuName && (
              <ul className="dropdown-menu">
                {menuData[menuName].map((subItem, index) => (
                  <li 
                    key={index} 
                    className="dropdown-item"
                    onClick={() => handleSubItemClick(subItem.action)}
                  >
                    {subItem.label}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </menu>
    </div>
  );
}
