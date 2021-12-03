import { Nullable, BigInt } from "@web3api/wasm-as";
import {
  DateTime_Query,
  Ethereum_Connection,
  Ethereum_Query,
  Gelato_CheckerResult,
  Input_checker,
  Coingecko_Query,
  Coingecko_SimplePrice,
  Coingecko_SimplePriceData,
} from "./w3";

function createNullable<T>(v: T): Nullable<T> {
  const obj: Nullable<T> = new Nullable<T>();
  obj.value = v;
  return obj;
}

export function checker(input: Input_checker): Gelato_CheckerResult {
  const ids = ["ethereum"];
  const vs_currencies = ["usd"];
  const include_24hr_change = createNullable(false);
  const include_24hr_vol = createNullable(false);
  const include_last_updated_at = createNullable(false);
  const include_market_cap = createNullable(false);

  const priceInfo = Coingecko_Query.simplePrice({
    ids: ids,
    vs_currencies: vs_currencies,
    include_24hr_change: include_24hr_change,
    include_24hr_vol: include_24hr_vol,
    include_last_updated_at: include_last_updated_at,
    include_market_cap: include_market_cap,
  });

  const canExec = priceInfo ? true : false;
  let price = "0";

  if (priceInfo && priceInfo.length > 0 && priceInfo[0].price_data) {
    const price_data = priceInfo[0].price_data as Coingecko_SimplePriceData[];
    if (price_data.length > 0 && price_data[0].price) {
      // Todo: fix this hack
      price = (parseFloat(price_data[0].price) * 1000000).toString().replace(".0", "");
    }
  }
  

  const execPayload = Ethereum_Query.encodeFunction({
    method: "function updateETHPrice(uint256)",
    args: [price],
  });

  const resolverData: Gelato_CheckerResult = {
    canExec: canExec,
    execPayload: execPayload,
  };

  return resolverData;
}
