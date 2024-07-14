const createRequest = async (options) => {
  const response = await fetch(options.input, options.init);
  options.callback(await response.json());
};

export default createRequest;
