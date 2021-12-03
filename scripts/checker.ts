import { getWeb3ApiClient } from "./utils";
import { encode } from "@msgpack/msgpack";

const main = async () => {
  const TEST_URI = "w3://ipfs/QmWcaTWWzcomZ3uXMyJ1PQcMv46oi9QaNE5gtJE5Y44HJZ";

  const client = await getWeb3ApiClient("goerli", "prod");

  const userConfig = {};
  const buffer = encode(userConfig);

  const checker = await client.query({
    uri: TEST_URI,
    query: `
      query {
        checker(
          argBuffer: $arg
        )
      }`,
    variables: {
      arg: buffer,
    },
  });

  console.log(checker);
};

main();
