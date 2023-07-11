import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Chart from "chart.js/auto";

const EmiCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [emi, setEmi] = useState("");
  const [totalPayment, setTotalPayment] = useState("");
  const [roi, setRoi] = useState("");
  const chartRef = useRef(null);

  const calculateEmi = () => {
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

    // Update the chart data
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy previous chart if it exists
      if (window.chartInstance) {
        window.chartInstance.destroy();
      }

      window.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["EMI", "Total Payment", "Principal"],
          datasets: [
            {
              label: "Amount",
              data: [emiAmount.toFixed(2), totalAmount.toFixed(2), principal],
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: true,
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
    }
  };

  useEffect(() => {
    // Cleanup the chart when the component is unmounted
    return () => {
      if (window.chartInstance) {
        window.chartInstance.destroy();
      }
    };
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="text-center">EMI Calculator</h1>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={6}>
          <Form>
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

            <Button
              variant="primary"
              className="w-100"
              onClick={calculateEmi}
            >
              Calculate
            </Button>
          </Form>
        </Col>
      </Row>

      {emi && (
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={6}>
            <h3 className="text-center mb-4">EMI: {emi}</h3>
            <div className="chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
            <h3 className="text-center mt-4">Total Payment: {totalPayment}</h3>
            <h3 className="text-center">Rate of Interest (ROI): {roi}%</h3>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EmiCalculator;
