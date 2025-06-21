import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import TextInput from "../components/TextInput"; // If you're using this elsewhere

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
  max-width: 800px;
  width: 100%;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  width: 100%;
  resize: vertical;
  min-height: 120px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    opacity: 0.9;
  }
`;

const Contact = () => {
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(openSnackbar({ open: true, message: "Message sent!", severity: "success" }));
  };

  return (
    <Container>
      <Section>
        <PageTitle>Get in Touch</PageTitle>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <Label htmlFor="name">Name</Label>
            {/* Replace with <TextInput ... /> if your component supports it */}
            <Input id="name" type="text" required placeholder="Your Name" />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="Your Email" />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <Label htmlFor="message">Message</Label>
            <TextArea id="message" required placeholder="Your Message..." />
          </div>
          <Button type="submit">Send Message</Button>
        </form>
      </Section>
    </Container>
  );
};

export default Contact;
