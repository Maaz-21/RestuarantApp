import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";
import { getOrders } from "../api";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.text_primary};
`;

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OrderCard = styled.div`
  background-color: ${({ theme }) => theme.card};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const OrderId = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const OrderDate = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const OrderStatus = styled.div`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${({ status, theme }) =>
    status === "Delivered"
      ? theme.success + "20"
      : status === "Cancelled"
      ? theme.error + "20"
      : theme.warning + "20"};
  color: ${({ status, theme }) =>
    status === "Delivered"
      ? theme.success
      : status === "Cancelled"
      ? theme.error
      : theme.warning};
`;

const OrderContent = styled.div`
  margin-bottom: 12px;
`;

const OrderItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
`;

const ItemDetails = styled.div`
  display: flex;
  gap: 12px;
`;

const ItemImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
`;

const ItemName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const ItemQuantity = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const ItemPrice = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const OrderTotal = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
`;

const DeliveryAddress = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  margin-top: 8px;
`;

const EmptyOrders = styled.div`
  margin-top: 40px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const Orders = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders...");
        const token = localStorage.getItem("foodeli-app-token");
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await getOrders(token);
        console.log("Orders response:", response);
        const data = response?.data;
        console.log("Orders data:", data);
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data?.orders)) {
          setOrders(data.orders);
        } else {
          console.error("Unexpected orders response format", data);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        dispatch(
          openSnackbar({
            message: "Failed to fetch orders. Please try again.",
            severity: "error",
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getOrderStatus = (order) => {
    if (order.status) return order.status;
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 3) return "Delivered";
    if (diffDays > 1) return "Shipped";
    return "Processing";
  };

  if (loading) {
    return (
      <Container>
        <Title>My Orders</Title>
        <LoaderContainer>
          <ClipLoader color="#FF5A5F" size={40} />
        </LoaderContainer>
      </Container>
    );
  }

  if (!currentUser) {
    return (
      <Container>
        <Title>My Orders</Title>
        <EmptyOrders>Please sign in to view your orders.</EmptyOrders>
      </Container>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <Container>
        <Title>My Orders</Title>
        <EmptyOrders>You don't have any orders yet.</EmptyOrders>
      </Container>
    );
  }

  return (
    <Container>
      <Title>My Orders</Title>
      <OrdersContainer>
        {orders.map((order) => (
          <OrderCard key={order._id || order.id}>
            <OrderHeader>
              <OrderId>Order #{order._id || order.id}</OrderId>
              <OrderDate>{formatDate(order.date || order.createdAt)}</OrderDate>
              <OrderStatus status={getOrderStatus(order)}>
                {getOrderStatus(order)}
              </OrderStatus>
            </OrderHeader>
            <OrderContent>
              <OrderItemsList>
                {order.items?.map((item, index) => (
                  <OrderItem key={item._id || index}>
                    <ItemDetails>
                      <ItemImage src={item.product?.img}  alt={item.product?.name} />
                      <div>
                        <ItemName>{item.product?.name}</ItemName>
                        <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>
                      </div>
                    </ItemDetails>
                    <ItemPrice>₹{(item.product?.price?.org * item.quantity).toFixed(2)}</ItemPrice>
                  </OrderItem>
                ))}
              </OrderItemsList>
              <DeliveryAddress>
                <strong>Delivery Address:</strong> {order.address}
              </DeliveryAddress>
            </OrderContent>
            <OrderFooter>
              <div>Total:</div>
              <OrderTotal>₹{order.total_amount}</OrderTotal>
            </OrderFooter>
          </OrderCard>
        ))}
      </OrdersContainer>
    </Container>
  );
};

export default Orders;
