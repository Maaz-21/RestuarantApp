import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { category } from "../utils/data";
import HeaderImage from "../utils/Images/Header.png";
import ProductCategoryCard from "../components/cards/ProductCategoryCard";
import ProductsCard from "../components/cards/ProductsCard";
import { getAllProducts } from "../api";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
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
  width: 100%;
`;

const Img = styled.img`
  width: 100%;
  border-radius: 6px;
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

const FilterIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const RemoveFilterButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Home = ({ search }) => {
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();
  
  const getProducts = async () => {
    try 
    {
      setLoading(true);
      const res = await getAllProducts();
      setAllProducts(res.data);
    } 
    catch (error) 
    {
      console.error("Error fetching products:", error);
      dispatch(
        openSnackbar({
          open: true,
          message: "Error fetching products",
          severity: "error",
        })
      );
    } 
    finally 
    {
      setLoading(false);
    }
  };
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const clearFilter = () => {
    setSelectedCategory(null);
  };

  // Filter products based on selected category and search term
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory ? product.category.includes(selectedCategory) : true;
    const matchesSearch = search ? product.name.toLowerCase().includes(search.toLowerCase()) : true;
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    getProducts();
  }
  , []);

  return (
    <Container>
      <Section>
        <Img src={HeaderImage} />
      </Section>      
      <Section>
        <Title>Food Categories</Title>
        <CardWrapper>
          {category.map((item) => (
            <ProductCategoryCard 
              key={item.name} 
              category={item}
              allProducts={allProducts.filter((product) => product.category.includes(item.name))}
              search={search}
              onClick={() => handleCategoryClick(item.name)}
              isSelected={selectedCategory === item.name}
            />
          ))}
        </CardWrapper>
        
        {selectedCategory && (
          <FilterIndicator>
            <span>Currently showing: <strong>{selectedCategory}</strong></span>
            <RemoveFilterButton onClick={clearFilter}>
              Remove Filter ×
            </RemoveFilterButton>
          </FilterIndicator>
        )}
      </Section>

      <Section>
        <Title>
          {selectedCategory ? `${selectedCategory} Items` : "Most Popular"}
        </Title>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : (
          filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              No products found {selectedCategory && `in ${selectedCategory}`} {search && `matching "${search}"`}
            </div>
          ) : (
            <CardWrapper>
              {filteredProducts.map((product) => (
                <ProductsCard key={product._id} product={product} />
              ))}
            </CardWrapper>
          )
        )}
      </Section>
    </Container>
  );
};

export default Home;