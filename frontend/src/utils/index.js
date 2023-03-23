const getTranslation = (field) => {
  const mapping = {
    name: 'modals.constraints',
    password: 'signup.passwordConstraints',
    username: 'signup.usernameConstraints',
  };

  return mapping[field];
};

const normalizeData = (data) => ({
  entities: data.reduce((acc, item) => {
    acc[item.id] = item;

    return acc;
  }, {}),
  ids: data.map(({ id }) => id),
});

export { getTranslation, normalizeData };
