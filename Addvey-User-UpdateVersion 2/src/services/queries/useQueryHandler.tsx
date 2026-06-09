import { useSelector } from 'react-redux';
import useQueryApi from './useQueryApi';

const useQueryHandler = (url, enabled) => {
  const userToken = useSelector(state => state?.userReducer?.token);
  return useQueryApi(['mainData', url], url, userToken, {}, enabled);
};

export default useQueryHandler;
