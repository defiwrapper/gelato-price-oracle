import { getWeb3ApiClient } from "./utils";
import { encode } from "@msgpack/msgpack";
import {ethers} from "ethers";

const main = async () => {
  const TEST_URI = "w3://ipfs/Qmd7jUJZCythgZUb49JKPvoBewKbDsdE6gL5GGCztKBGvc";

  const client = await getWeb3ApiClient("goerli", "prod");

  const userConfig = {};
  const buffer = encode(userConfig);

  const iface = new ethers.utils.Interface(["function updateCoinPrices(string[] memory _coins, uint256[] memory _prices) external"]);

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
  // @ts-ignore
  console.log(iface.decodeFunctionData("updateCoinPrices", checker.data.checker.execPayload)[1].map((a) => a.toString()));
};

main();
