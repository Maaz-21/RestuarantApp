import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductCard from "../components/cards/ProductsCard";
import { filter } from "../utils/data";
import { CircularProgress, Slider } from "@mui/material";
import { getAllProducts } from "../api";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 30px;
  @media (max-width: 700px) {
    flex-direction: column;
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;
const Filters = styled.div`
  padding: 20px 16px;
  flex: 1;
  width: 100%;
  max-width: 300px;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: fit-content;
  @media (max-width: 700px) {
    max-width: 440px;
    position: static;
  }
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Products = styled.div`
  flex: 1;
  padding: 20px 0px;
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

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.bg_secondary};
  border: 1px ${({ theme }) => theme.text_secondary + 50};
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`;
const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const Selectableitem = styled.div`
  cursor: pointer;
  display: flex;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  color: ${({ theme }) => theme.text_secondary + 90};
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 16px;
  width: fit-content;
  ${({ selected, theme }) =>
    selected &&
    `
  border: 1px solid ${theme.text_primary};
  color: ${theme.text_primary};
  background: ${theme.text_primary + 30};
  font-weight: 500;
  `}
`;

const FoodListing = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
  const [selectedCategories, setSelectedCategories] = useState([]); // Default selected categories
  const [error, setError] = useState(null);

  const getFilteredProductsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllProducts(
        selectedCategories.length > 0
          ? `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&categories=${selectedCategories.join(",")}`
          : `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`
      );
      setProducts(res.data);
    } catch (error) 
    {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again later.");
      setProducts([]); // Clear previous products
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFilteredProductsData();
  }, [priceRange, selectedCategories]);

  return (
    <Container>
      <Filters>
        <Menu>
          {filter.map((filters,i) => (
            <FilterSection key={filters.name || i} className="">
              <Title>{filters.name}</Title>
              {filters.value === "price" ? (
                <Slider
                  getAriaLabel={index => (index === 0 ? 'Minimum price' : 'Maximum price')}
                  disabled={loading}
                  value={priceRange}
                  min={0}
                  max={1000}
                  sx={{width: "85%"}}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: 0, label: "$0" },
                    { value: 1000, label: "$1000" },
                  ]}
                  onChange={(e, newValue) => setPriceRange(newValue)}
                />
              ) : filters.value === "category" ? (
                <Item>
                  {filters.items.map((item) => (
                    <Selectableitem
                      key={item}
                      selected={selectedCategories.includes(item)}
                      onClick={() =>
                        setSelectedCategories((prevCategories) =>
                          prevCategories.includes(item)
                            ? prevCategories.filter(
                                (category) => category !== item
                              )
                            : [...prevCategories, item]
                        )
                      }
                    >
                      {item}
                    </Selectableitem>
                  ))}
                </Item>
              ) : null}
            </FilterSection>
          ))}
        </Menu>
      </Filters>
      <Products>
        <CardWrapper>
          {loading ? (
            <CircularProgress sx={{ marginTop: "40px" }} />
          ) : error? (
              <div style={{ color: "red", fontSize: "18px", marginTop: "20px" }}>
                   {error}
              </div>
              ) :  (
            <>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </>
          )}
        </CardWrapper>
      </Products>
    </Container>
  );
};

export default FoodListing;
