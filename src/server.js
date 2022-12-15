import * as HAPI from "@hapi/hapi";
import * as DOT from "dotenv";
import route from "./routes.js";

DOT.config();
const { env } = process;
const init = () => {
  const server = HAPI.server({
    port: env.port,
    host: env.enviroment === "production" ? "0.0.0.0" : "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });
  server.route(route);
  server.start();
  console.log(`server are running on : ${server.info.uri}`);
};

init();
