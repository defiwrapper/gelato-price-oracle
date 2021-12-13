import { getWeb3ApiClient } from "./utils";
import { encode } from "@msgpack/msgpack";

const main = async () => {
  const TEST_URI = "w3://ipfs/QmYLctUdu4eQ3T9tH4C6b72zmzS3iAozZ4En4fkCkP7cJj";

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
