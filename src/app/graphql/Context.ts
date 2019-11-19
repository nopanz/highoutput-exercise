import Loader from './Loader';

export default (context: object) => {
  const loader = new Loader();
  return { loader, context };
};
