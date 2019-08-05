import request from 'request-promise';

const createHttpClient = () => {
  // a handy place to future defaults via request.defaults
  return request.defaults({
    json: true,
  });
};

export {
  createHttpClient,
};
