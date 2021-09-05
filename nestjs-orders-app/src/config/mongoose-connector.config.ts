import ServerConfig from "@src/config/server.config";
import mongoose from "mongoose";

export namespace MongooseConnector {
  export async function connect({
    mongoAddr,
    readPreference = "secondary",
  }: {
    mongoAddr?: string;
    readPreference?:
      | "primary"
      | "primaryPreferred"
      | "secondary"
      | "secondaryPreferred";
  }) {
    await mongoose.connect(
      mongoAddr ? mongoAddr : ServerConfig.constructMongoConnection({}),
      {
        readPreference: readPreference,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        connectTimeoutMS: 9000000,
        socketTimeoutMS: 36000000,
        useUnifiedTopology: true,
      }
    );
    // Observed that we need to wait some time after the 'connect', or else some
    // properties of the connection object is null
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    mongoose.set("debug", true);
    // Get the default connection
    const mdb = mongoose.connection;

    // Bind connection to error event (to get notification of connection errors)
    // db.on("error", console.error.bind(console, "MongoDB connection error:"));
    mdb.on("error", () => console.error("MongoDB connection error"));
    mdb.on("reconnectFailed", () =>
      console.error("Failed to reconnect to DB.")
    );
    mdb.on("connecting", function () {
      console.log("connecting to MongoDB...");
    });

    mdb.on("error", function (error) {
      console.error("Error in MongoDb connection: " + error);
      mongoose.disconnect();
    });
    mdb.on("connected", function () {
      console.log("MongoDB connected!");
    });
    mdb.once("open", function () {
      console.log("MongoDB connection opened!");
    });
    mdb.on("reconnected", function () {
      console.log("MongoDB reconnected!");
    });
    mdb.on("disconnected", function () {
      console.error("MongoDB disconnected!");
    });

    console.log("ENV: %s", process.env.NODE_ENV);
    console.log("DB_NAME: %s", process.env.DB_NAME);
    return mdb;
  }
  export async function disconnect() {
    await mongoose.disconnect();
  }
}

export default MongooseConnector;
