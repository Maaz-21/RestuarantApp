import { CircularProgress, Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import {
  FavoriteBorder,
  FavoriteBorderOutlined,
  FavoriteRounded,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  addToFavourite,
  //deleteFromCart,
  deleteFromFavourite,
  getFavourite,
  getProductDetails,
  //placeOrder,
} from "../api";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import { useDispatch } from "react-redux";

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
    padding: 20px 16px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  width: 100%;
  flex: 1;
  max-width: 1400px;
  display: flex;
  gap: 40px;
  justify-content: center;
  @media only screen and (max-width: 700px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const ImagesWrapper = styled.div`
  flex: 0.7;
  display: flex;
  justify-content: center;
`;
const Image = styled.img`
  max-width: 500px;
  width: 100%;
  max-height: 500px;
  border-radius: 12px;
  object-fit: cover;
  @media (max-width: 768px) {
    max-width: 400px;
    height: 400px;
  }
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  gap: 18px;
  flex-direction: column;
  padding: 4px 10px;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
`;
const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 60};
  text-decoration: line-through;
  text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
`;

const Percent = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: green;
`;

const Ingridents = styled.div`
  font-size: 16px;
  font-weight: 500;
  diaplay: flex;
  flex-direction: column;
  gap: 24px;
`;
const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const Item = styled.div`
  background: ${({ theme }) => theme.primary + 20};
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  padding: 4px 12px;
  display: flex;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
  padding: 32px 0px;
  @media only screen and (max-width: 700px) {
    gap: 12px;
    padding: 12px 0px;
  }
`;

const FoodDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();

  const getErrorMessage = (error) => error?.response?.data?.message || error?.message || "Something went wrong";

  const getProduct = async () => {
    setLoading(true);
    try {
      const res = await getProductDetails(id);
      setProduct(res.data);
    } catch (err) {
      dispatch(openSnackbar({ message: getErrorMessage(err), severity: "error" }));
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("foodeli-app-token");

    try {
      await deleteFromFavourite(token, { productId: id });
      setFavorite(false);
    } catch (err) {
      dispatch(openSnackbar({ message: getErrorMessage(err), severity: "error" }));
    } finally {
      setFavoriteLoading(false);
    }
  };

  const addFavourite = async () => {
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) {
      dispatch(openSnackbar({ message: "Please log in to add items to your favorites", severity: "error" }));
      navigate("/");
      return;
    }

    setFavoriteLoading(true);
    try {
      await addToFavourite(token, { productId: id });
      setFavorite(true);
    } catch (err) {
      dispatch(openSnackbar({ message: getErrorMessage(err), severity: "error" }));
    } finally {
      setFavoriteLoading(false);
    }
  };

  const checkFavorite = async () => {
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) return;

    setFavoriteLoading(true);
    try {
      const res = await getFavourite(token, { productId: id });
      const isFavorite = res.data?.some((fav) => fav._id === id);
      setFavorite(isFavorite);
    } catch (err) {
      dispatch(openSnackbar({ message: getErrorMessage(err), severity: "error" }));
    } finally {
      setFavoriteLoading(false);
    }
  };
  
  const addCart = async () => {
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) {
      dispatch(openSnackbar({ message: "Please log in to add items to your cart", severity: "error" }));
      navigate("/");
      return;
    }

    setCartLoading(true);
    try {
      await addToCart(token, { productId: id, quantity: 1 });
      navigate("/cart");
    } catch (err) {
      dispatch(openSnackbar({ message: getErrorMessage(err), severity: "error" }));
    } finally {
      setCartLoading(false);
    }
  };
  // const placeOrderHandler = async () => {
  //   const token = localStorage.getItem("foodeli-app-token");
  //   if (!token) {
  //     dispatch(openSnackbar({ message: "Please Register to place an order", severity: "error" }));
  //     navigate("/");
  //     return;
  //   }
  //   setCartLoading(true);
  //   try {
  //     await placeOrder(token, { productId: id, quantity: 1 });
  //     navigate("/orders");
  //   }
  //   catch (err) {
  //     dispatch(openSnackbar({ message: getErrorMessage(err), severity: "error" }));
  //   } finally {
  //     setCartLoading(false);
  //   }
  // };
  useEffect(() => {
    getProduct();
    checkFavorite();
  }, []);

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : (
        <Wrapper>
          <ImagesWrapper>
            <Image src={product?.img} alt={product?.name || "Product"}/>
          </ImagesWrapper>
          <Details>
            <div>
              <Title>{product?.name}</Title>
            </div>
            <Rating value={3.5} />
            <Price>
              ₹{product?.price?.org} <Span>₹{product?.price?.mrp}</Span>{" "}
              <Percent> (₹{product?.price?.off}% Off) </Percent>
            </Price>

            <Desc>{product?.desc}</Desc>

            <Ingridents>
              Ingridents
              <Items>
                {product?.ingredients.map((ingredient, index) => (
                  <Item key={index}>{ingredient}</Item>
                ))}
              </Items>
            </Ingridents>

            <ButtonWrapper>
              <Button
                text="Add to Cart"
                full
                primary
                isLoading={cartLoading}
                onClick={() => addCart()}
              />
              <Button
                leftIcon={
                  favorite ? (
                    <FavoriteRounded sx={{ fontSize: "22px", color: "red" }} />
                  ) : (
                    <FavoriteBorderOutlined sx={{ fontSize: "22px" }} />
                  )
                }
                text = {favorite ? "Remove from Favorites" : "Add to Favorites"}
                full
                outlined
                isLoading={favoriteLoading}
                onClick={() => (favorite ? removeFavourite() : addFavourite())}
              />
            </ButtonWrapper>
          </Details>
        </Wrapper>
      )}
    </Container>
  );
};

export default FoodDetails;
