import { useRouter } from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import _ from "lodash";
import useStateMachine from "@cassiozen/usestatemachine";

export default function Landing({
  isTabletOrMobileDevice,
  windowWidth,
  windowHeight,
}: {
  isTabletOrMobileDevice: boolean;
  windowWidth: number;
  windowHeight: number;
}) {
  const router = useRouter();
  const [currentOrders, setCurrentOrders] = useState([]);
  const [orderForm, setOrderForm] = useState({
    orderType: "",
    orderId: "",
    orderDescription: "",
  });
  const [sendFormDataState, toggleSendFormData] = useStateMachine({
    // timesSent = -1 because onLoad, TOGGLE is applied for initial state
    context: { timesSent: 0, timesSuccessfulSend: 0 },
    initial: "waiting",
    states: {
      waiting: {
        on: { TOGGLE: "sending" },
        effect({ setContext }) {
          console.log(`Moving into "waiting" state.`);

          return () => {
            console.log(`Leaving "waiting" state. Recording send attempt`);
            setContext((context) => ({
              timesSent: context.timesSent + 1,
              timesSuccessfulSend: context.timesSuccessfulSend,
            }));
          };
        },
      },
      sending: {
        on: { TOGGLE: "waiting" },
        effect() {
          // triggers on entering this state
          console.log(
            `Entering "sending" state: Request made to send out form data`
          );
          // cleanup on leaving this state
          return ({ setContext }) => {
            console.log(`Leaving "sending" state. Recording successful send`);
            setContext((context) => ({
              timesSent: context.timesSent,
              timesSuccessfulSend: context.timesSuccessfulSend + 1,
            }));
          };
        },
      },
    },
  });

  useEffect(() => {
    getCurrentOrders();
  }, []);

  const getCurrentOrders = () => {
    console.log(`Getting current orders`);
  };
  const handleOrderInput = (event) => {
    setOrderForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  const createOrder = (event) => {
    event.preventDefault();

    console.log(
      `Creating order for following inputs:\n${JSON.stringify(
        orderForm,
        null,
        2
      )}`
    );
    if (Object.values(orderForm).includes("")) {
      alert(`Missing form value. Please check`);
      return null;
    }

    toggleSendFormData(`TOGGLE`);

    setTimeout(() => {
      toggleSendFormData(`TOGGLE`);
    }, 5000);
  };

  return (
    <>
      <Container>
        <h1>Order management system</h1>
      </Container>
      <Container>
        <div>
          <h4>Current orders</h4>
        </div>
        <div>
          {_.isEmpty(currentOrders) && (
            <>
              <div>No current orders available</div>
            </>
          )}
          {!_.isEmpty(currentOrders) && (
            <>
              <table style={{ border: "1px solid black" }}>
                <tr>
                  <th>orderId</th>
                  <th>description</th>
                  <th>createdAt</th>
                </tr>
                {currentOrders.map((order) => {
                  return (
                    <tr>
                      <td>{order?.orderId}</td>
                      <td>{order?.description}</td>
                      <td>{order?.createdAt}</td>
                    </tr>
                  );
                })}
              </table>
            </>
          )}
        </div>
      </Container>
      <Container>
        <div>
          <h4>Order input</h4>
        </div>
        <div>
          <form
            onSubmit={(event) => {
              createOrder(event);
            }}
          >
            <Row className="my-2">
              <Col md={2}>Select order type</Col>
              <Col md={10}>
                <select
                  name="orderType"
                  defaultValue=""
                  onChange={handleOrderInput}
                >
                  <option value="">--Select an option--</option>
                  <option value="create-order">Create order</option>
                  <option value="cancel-order">Cancel order</option>
                </select>
              </Col>
            </Row>
            <Row className="my-2">
              <Col md={2}>orderId</Col>
              <Col md={10}>
                <input
                  type="text"
                  name="orderId"
                  placeholder="mx1234"
                  onChange={handleOrderInput}
                />
              </Col>
            </Row>
            <Row className="my-2">
              <Col md={2}>Description (optional)</Col>
              <Col md={10}>
                <input
                  type="text"
                  name="orderDescription"
                  onChange={handleOrderInput}
                  placeholder="req from customer"
                />
              </Col>
            </Row>
            <Row className="mx-0">
              <input type="submit" value="Submit" />
            </Row>
          </form>
        </div>
      </Container>
      <Container>
        <div>
          Send attempts: {sendFormDataState?.context?.timesSent ?? 0} vs
          successful send attempts:{" "}
          {sendFormDataState?.context?.timesSuccessfulSend ?? 0}
        </div>
      </Container>
    </>
  );
}
