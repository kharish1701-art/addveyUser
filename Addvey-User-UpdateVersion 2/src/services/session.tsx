// session.ts
let sessionData: any = null;

export const setSession = (data: any) => {
  sessionData = data;
};

export const getSession = () => {
  return sessionData;
};

export const clearSession = () => {
  sessionData = null;
};
