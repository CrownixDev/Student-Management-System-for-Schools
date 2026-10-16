import { createSearchParamsCache, parseAsInteger, parseAsNumberLiteral, parseAsString } from "nuqs/server";

export const filterParsers = {
  search: parseAsString.withOptions({
    shallow: false,
    limitUrlUpdates: {
      method: "debounce",
      timeMs: 300,
    },
  }),
  page: parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  limit: parseAsNumberLiteral([25, 50, 100]).withDefault(25).withOptions({ shallow: false }),
};

export const filterCache = createSearchParamsCache(filterParsers);
