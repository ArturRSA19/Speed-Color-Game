import { buildServer } from "./server";
import { env } from "./env";

const app = buildServer();
app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});
