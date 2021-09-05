import _ from "lodash";
import moment from "moment";

export default function OrdersTable({ currentOrders }) {
  return (
    <>
      <div>
        <h4 className="py-2">Current orders</h4>
      </div>
      <div>
        {_.isEmpty(currentOrders) && (
          <>
            <div>No current orders available</div>
          </>
        )}
        {!_.isEmpty(currentOrders) && (
          <>
            <table className="border border-primary">
              <thead className="border border-primary bg-primary text-white text-center">
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
                        {moment(order?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}
