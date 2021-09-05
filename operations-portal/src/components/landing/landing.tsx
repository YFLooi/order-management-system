import { useRouter } from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import _ from "lodash";
import useStateMachine from "@cassiozen/usestatemachine";
import axios from "axios";
import ServerConfig from "@src/server.config";
import moment from "moment";

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

  const getCurrentOrders = async () => {
    console.log(`Getting current orders`);
    const currentOrders = await axios
      .post(
        `${ServerConfig.getPaymentAppBaseUrl()}/orders/get-current-orders`,
        orderForm
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(`Unable to get current orders. Err: ${err?.message}`);
      });
    console.log(currentOrders);
    setCurrentOrders(currentOrders);
  };
  const handleOrderInput = (event) => {
    setOrderForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  const createOrder = async (event) => {
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

    // Chk for duplicate orderIds
    const presentOrderIds = currentOrders.map((order) => order?.orderId);
    if (presentOrderIds.includes(orderForm.orderId)) {
      alert(`orderId "${orderForm.orderId}" already present in db`);
      return null;
    }

    toggleSendFormData(`TOGGLE`);
    try {
      await axios
        .post(
          `${ServerConfig.getPaymentAppBaseUrl()}/orders/submit-order`,
          orderForm
        )
        .then((_) => {
          toggleSendFormData(`TOGGLE`);
        });
    } catch (err) {
      console.error(
        `Unable to pass data to /orders/submitOrder. Err: ${err?.message}`
      );
      toggleSendFormData(`TOGGLE`);
    }
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
                <thead>
                  <tr>
                    <th className="px-2 py-2">orderId</th>
                    <th className="px-2 py-2">status</th>
                    <th className="px-2 py-2">description</th>
                    <th className="px-2 py-2">createdAt</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order, i) => {
                    return (
                      <tr key={`order-table-row-${i}`}>
                        <td className="px-2">{order?.orderId}</td>
                        <td className="px-2">{order?.status}</td>
                        <td className="px-2">{order?.description}</td>
                        <td className="px-2">
                          {moment(order?.createdAt).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
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
          completed send attempts:{" "}
          {sendFormDataState?.context?.timesSuccessfulSend ?? 0}
        </div>
      </Container>
    </>
  );
}
