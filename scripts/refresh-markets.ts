import "dotenv/config";
import { refreshMarketsSnapshot } from "../src/lib/markets-snapshot";

refreshMarketsSnapshot()
  .then(({ count }) => {
    console.log("markets snapshot saved, rows:", count);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
