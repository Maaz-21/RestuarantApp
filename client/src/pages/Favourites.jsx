import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import styled from "styled-components";
import ProductsCard from "../components/cards/ProductsCard";
import { getFavourite } from "../api";
import { CircularProgress } from "@mui/material";
const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;
const Section = styled.div`
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  @media (max-width: 760px) {
    gap: 16px;
  }
`;
const Favourites = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  const getErrorMessage = (err) => err?.response?.data?.message || err?.message || "Failed to load favourites";

  const getProducts = async () => {
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) {
      dispatch(
        openSnackbar({
          message: "Please log in to view your favorites",
          severity: "error",
        })
      );
      return;
    }

    setLoading(true);
    try {
      const res = await getFavourite(token);
      setProducts(res.data);
    } catch (err) {
      dispatch(
        openSnackbar({
          message: getErrorMessage(err),
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container>
      <Section>
        <Title>Your Favourites</Title>
        <CardWrapper>
          {loading ? (
            <CircularProgress 
              style={{ color: "#FF3D00" }}
              size={40}
              thickness={4}            
            /> 
          ) : products.length === 0 ? (
            <p style={{ fontSize: "18px", color: "#777" }}>No favourites added</p>
          ) :
          (
            <>
              {products.map((product) => (
                <ProductsCard key={product._id} product={product} />
              ))}
            </>
          )}
        </CardWrapper>
      </Section>
    </Container>
  );
};

export default Favourites;
