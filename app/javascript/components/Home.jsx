import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const EmiCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [emi, setEmi] = useState("");
  const [totalPayment, setTotalPayment] = useState("");
  const [roi, setRoi] = useState("");

  const calculateEmi = (e) => {
    e.preventDefault();
    
    // Perform EMI calculation here
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const n = parseFloat(loanTenure) * 12; // Total number of months
    
    const emiAmount = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emiAmount * n;
    const rateOfInterest = ((emiAmount * n) - p) / p * 100;

    setEmi(emiAmount.toFixed(2));
    setTotalPayment(totalAmount.toFixed(2));
    setRoi(rateOfInterest.toFixed(2));
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center">EMI Calculator</h1>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={6}>
          <Form onSubmit={calculateEmi}>
            <Form.Group controlId="principal">
              <Form.Label>Principal Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Principal Amount"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="interestRate">
              <Form.Label>Interest Rate (in % per annum)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Interest Rate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="loanTenure">
              <Form.Label>Loan Tenure (in years)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Loan Tenure"
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Calculate
            </Button>
          </Form>
        </Col>
      </Row>

      {emi && (
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={6}>
            <h3>EMI: {emi}</h3>
            <h3>Total Payment: {totalPayment}</h3>
            <h3>Rate of Interest (ROI): {roi}%</h3>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EmiCalculator;
