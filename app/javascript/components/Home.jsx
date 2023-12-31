import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Chart from "chart.js/auto";

const EmiCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [emi, setEmi] = useState("");
  const [totalPayment, setTotalPayment] = useState("");
  const [roi, setRoi] = useState("");
  const [chartData, setChartData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
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
    const newChartData = {
      labels: ["EMI", "Total Payment", "Principal"],
      datasets: [
        {
          label: "Amount",
          data: [emiAmount.toFixed(2), totalAmount.toFixed(2), principal],
          backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        },
      ],
    };
    setChartData(newChartData);

    // Generate monthly data
    const monthlyEmi = emiAmount.toFixed(2);
    const monthlyInterest = (p * r).toFixed(2);
    const monthlyPrincipal = (monthlyEmi - monthlyInterest).toFixed(2);

    const monthlyDataArray = [];
    for (let i = 1; i <= n; i++) {
      monthlyDataArray.push({
        month: i,
        emi: monthlyEmi,
        interest: monthlyInterest,
        principal: monthlyPrincipal,
      });
    }
    setMonthlyData(monthlyDataArray);
  };

  useEffect(() => {
    // Initialize the chart when the component mounts
    if (chartRef.current && chartData) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy previous chart if it exists
      if (window.chartInstance) {
        window.chartInstance.destroy();
      }

      window.chartInstance = new Chart(ctx, {
        type: "bar",
        data: chartData,
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

    // Cleanup the chart when the component is unmounted
    return () => {
      if (window.chartInstance) {
        window.chartInstance.destroy();
      }
    };
  }, [chartData]);

  return (
    <Container className="mt-4">
      <h1 className="text-center gradient-border-animation" style={{ padding: "10px" }}>
        EMI Calculator
      </h1>

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

            <Button variant="primary" className="w-100" onClick={calculateEmi}>
              Calculate
            </Button>
          </Form>
        </Col>
        <Col xs={12} md={6} className="text-center">
          {emi && (
            <div>
              <h3 className="mb-4">EMI: {emi}</h3>
              <div className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
              <h3 className="mt-4">Total Payment: {totalPayment}</h3>
              <h3>Rate of Interest (ROI): {roi}%</h3>
            </div>
          )}
        </Col>
      </Row>

      {monthlyData.length > 0 && (
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={8}>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>EMI</th>
                  <th>Interest</th>
                  <th>Principal</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data) => (
                  <tr key={data.month}>
                    <td>{data.month}</td>
                    <td>{data.emi}</td>
                    <td>{data.interest}</td>
                    <td>{data.principal}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EmiCalculator;
