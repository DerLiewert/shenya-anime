export const searchParamsToObj = (paramsString: string) => {
  const searchParams = new URLSearchParams(paramsString);
  const paramsObj = Object.fromEntries(searchParams.entries());
  return paramsObj;
};
