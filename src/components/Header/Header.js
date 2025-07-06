import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.9);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.h1`
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ContactButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SideMenu = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.$isOpen ? '0' : '-300px'};
  width: 300px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  transition: right 0.3s ease;
  z-index: 1000;
  padding: 20px;
`;

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const MenuItem = styled.div`
  color: #fff;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #6366f1;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <HeaderContainer>
        <Logo>DashDramas</Logo>
        <RightSection>
          <ContactButton>Contact Us</ContactButton>
          <MenuButton onClick={toggleMenu}>
            <FiMenu />
          </MenuButton>
        </RightSection>
      </HeaderContainer>
      
      <MenuOverlay $isOpen={isMenuOpen} onClick={toggleMenu} />
      <SideMenu $isOpen={isMenuOpen}>
        <MenuItem>Categories</MenuItem>
        <MenuItem>My Account</MenuItem>
        <MenuItem>Help Center</MenuItem>
        <MenuItem>Settings</MenuItem>
      </SideMenu>
    </>
  );
};

export default Header;