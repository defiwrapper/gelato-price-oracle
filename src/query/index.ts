import { Nullable, JSON } from "@web3api/wasm-as";
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

const coins = ["ethereum", "bitcoin", "binancecoin", "cardano", "solana"];

function coinSymbolMap(coin: string): string {
  if (coin == "ethereum") {
    return "ETH";
  } else if (coin == "bitcoin") {
    return "BTC";
  } else if (coin == "binancecoin") {
    return "BNB";
  } else if (coin == "cardano") {
    return "ADA";
  } else if (coin == "solana") {
    return "SOL";
  } else {
    throw new Error("coinSymbolMap: coin not found");
  }
}

export function checker(input: Input_checker): Gelato_CheckerResult {
  const ids = coins;
  const vs_currencies = ["usd"];
  const include_24hr_change = createNullable(false);
  const include_24hr_vol = createNullable(false);
  const include_last_updated_at = createNullable(false);
  const include_market_cap = createNullable(false);

  const priceInfos: Coingecko_SimplePrice[] | null = Coingecko_Query.simplePrice({
    ids: ids,
    vs_currencies: vs_currencies,
    include_24hr_change: include_24hr_change,
    include_24hr_vol: include_24hr_vol,
    include_last_updated_at: include_last_updated_at,
    include_market_cap: include_market_cap,
  });

  const canExec = priceInfos ? true : false;
  const prices: JSON.Arr = new JSON.Arr();
  const coinsArr = new JSON.Arr();

  if (priceInfos) {
    for (let i = 0; i < priceInfos.length; i++) {
      if (priceInfos[i]) {
        const price_data = priceInfos[i].price_data as Coingecko_SimplePriceData[];
        if (price_data.length > 0 && price_data[0].price) {
          const currency = priceInfos[i].id;
          const price = <i64>(parseFloat(price_data[0].price) * 1000000);
          prices.push(new JSON.Integer(price));
          coinsArr.push(new JSON.Str(coinSymbolMap(currency)));
        }
      }
    }
  }

  const execPayload = Ethereum_Query.encodeFunction({
    method: "function updateCoinPrices(string[] memory _coins, uint256[] memory _prices)",
    args: [coinsArr.stringify(), prices.stringify()],
  });

  const resolverData: Gelato_CheckerResult = {
    canExec: canExec,
    execPayload: execPayload,
  };

  return resolverData;
}
