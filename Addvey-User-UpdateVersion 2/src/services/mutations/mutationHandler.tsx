import useApi from ".";

export const mutationHandler = (
  url,
  userToken,
  whenSuccess,
  whenError,
  method,
) => {
  return useApi(url, userToken, {}, whenSuccess, whenError, method);
};
