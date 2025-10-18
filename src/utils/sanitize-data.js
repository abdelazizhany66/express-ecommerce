//what will i want return from date user and put in any place such as login or logout

exports.sanitizeUser = function (user) {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
  };
};
