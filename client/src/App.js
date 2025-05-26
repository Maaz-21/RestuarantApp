import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lightTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import SnackbarAlert from "./components/SnackbarAlert";
import Home from "./pages/Home";
import { useState } from "react";
import Authentication from "./pages/Authentication";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import FoodDetails from "./pages/FoodDetails";
import FoodListing from "./pages/FoodListing";
import Orders from "./pages/Orders";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Container = styled.div``;

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [openAuth, setOpenAuth] = useState("");
  const [search, setSearch] = useState("");
  const ProtectedRoute = ({ children }) => {
  return currentUser ? children : <Navigate to="/" />;
  };
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Container>
          <Navbar
            setOpenAuth={setOpenAuth}
            openAuth={openAuth}
            currentUser={currentUser}
            search={search}
            setSearch={setSearch}
          />
          <Routes>
            <Route path="/" element={<Home search={search} />} />
            <Route path="/favorite" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/dishes/:id" element={<FoodDetails />} />
            <Route path="/dishes" element={<FoodListing />} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          </Routes>
          {openAuth && (
            <Authentication setOpenAuth={setOpenAuth} openAuth={openAuth} />
          )}
          <SnackbarAlert open={open} message={message} severity={severity} />
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
