import React, { useState } from "react";
import styled from "styled-components";
import { Link as LinkR, NavLink } from "react-router-dom";
import LogoImg from "../utils/Images/Logo.png";
import { useLocation } from "react-router-dom";
import {
  FavoriteBorder,
  MenuRounded,
  SearchRounded,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import Button from "./Button";
import { Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/UserSlice";

const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
`;
const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;
const NavLogo = styled(LinkR)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: inherit;
`;
const Logo = styled.img`
  width: 70px;
`;
const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 1s slide-in;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 1.8px solid ${({ theme }) => theme.primary};
  }
`;
const ButtonContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 28px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileIcon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;
const MobileIcons = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 0 6px;
  list-style: none;
  width: 80%;
  padding: 12px 40px 24px 40px;
  background: ${({ theme }) => theme.card_light + 99};
  position: absolute;
  top: 80px;
  right: 0;
  transition: all 0.6s ease-in-out;
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-100%)"};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
`;

const TextButton = styled.span`
  text-align: end;
  color: ${({ theme }) => theme.secondary};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  font-weight: 600;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Navbar = ({ setOpenAuth, openAuth, currentUser, search, setSearch }) => {
  const [isOpen, setIsOpen] = useState(false); //isOpen state to toggle mobile menu, useState(false) is the initial state
  const dispatch = useDispatch();  //Redux hook to dispatch actions
  const location = useLocation(); 
  const isHomePage = location.pathname === "/"; 
  // to go to login page on SignIn and go to SignUp page on SignUp
  
  return (
    <Nav>
      <NavContainer>
        <MobileIcon 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle menu"
        role='button'>
          <MenuRounded style={{ color: "inherit", cursor: "pointer" }} />
        </MobileIcon>
        <NavLogo to="/">  
          <Logo src={LogoImg} />
        </NavLogo>

        <MobileIcons>
          <Navlink to="/search">
            <SearchRounded sx={{ color: "inherit", fontSize: "30px" }} />
          </Navlink>
          <Navlink to="/favorite">
          {currentUser && (
            <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
          )}
          </Navlink>
          <Navlink to="/cart">
          {currentUser && (
            <ShoppingCartOutlined sx={{ color: "inherit", fontSize: "28px" }} />
          )}
          </Navlink>
          {currentUser && (
            <Avatar src={currentUser?.img || ""}>{currentUser?.username?.charAt(0) ?? ""}</Avatar>
          )}
        </MobileIcons>

        <NavItems>
          <Navlink to="/">Home</Navlink>
          <Navlink to="/dishes">Dishes</Navlink>
          {currentUser && (
          <Navlink to="/orders">Orders</Navlink>
          )}
          <Navlink to="/contact">Contact</Navlink>
        </NavItems>

        {isOpen && (
          <MobileMenu isOpen={isOpen}>
            <Navlink to="/" onClick={() => setIsOpen(false)}>
              Home
            </Navlink>
            <Navlink to="/dishes" onClick={() => setIsOpen(false)}>
              Dishes
            </Navlink>
            {currentUser && (
            <Navlink to="/orders" onClick={() => setIsOpen(false)}>
              Orders
            </Navlink>
            )}
            <Navlink to="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </Navlink>
            {currentUser ? (
                <TextButton onClick={() => dispatch(logout())}>
                  Logout
                </TextButton>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <Button
                  text="Sign Up"
                  outlined
                  small
                  onClick={() => setOpenAuth("signup")}
                />
                <Button
                  text="Sign In"
                  small
                  onClick={() => setOpenAuth("signin")}
                />
              </div>
            )}
          </MobileMenu>
        )}
        <ButtonContainer>
            {isHomePage && (
                // You can use your input, TextInput, or just the icon as needed
                <input
                  type="text"
                  placeholder="Search for food..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    marginRight: "16px"
                  }}
                />
              // Or use your custom TextInput component here
            )}
          {currentUser ? (
            <>
              <Navlink to="/favorite">
                <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
              </Navlink>
              <Navlink to="/cart">
                <ShoppingCartOutlined
                  sx={{ color: "inherit", fontSize: "28px" }}
                />
              </Navlink>
              <Avatar src={currentUser?.img}>{currentUser?.username[0]}</Avatar>
              <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
            </>
          ) : (
            <>
              <Button text="SignIn" small onClick={() => setOpenAuth("signin")} />
              <Button text="SignUp" small outlined onClick={() => setOpenAuth("signup")} />
            </>
          )}
        </ButtonContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
