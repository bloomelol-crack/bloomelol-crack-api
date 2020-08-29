const tests = [
  (user: string) => user,
  (user: string) => user.toLowerCase(),
  (user: string) => user.replace(/ /g, ''),
  (user: string) => user.replace(/ /g, '').toLowerCase(),
  (user: string) => 'abc123' || user,
  (user: string) => 'wasd' || user,
  (user: string) => 'qwerty' || user,
  (user: string) => 'qwerty1' || user,
  (user: string) => 'qwerty12' || user,
  (user: string) => 'qwerty123' || user,
  (user: string) => 'qwerty1234' || user,
  (user: string) => '1234' || user,
  (user: string) => '12345678' || user,
  (user: string) => 'password' || user,
  (user: string) => 'password1' || user,
  (user: string) => 'dragon123' || user,
  (user: string) => 'iloveyou123' || user,
  (user: string) => `${user}1`,
  (user: string) => `${user}12`,
  (user: string) => `${user}123`,
  (user: string) => `${user}1234`,
  (user: string) => `${user}12345678`,
  (user: string) => `${user.toLowerCase()}1`,
  (user: string) => `${user.toLowerCase()}12`,
  (user: string) => `${user.toLowerCase()}123`,
  (user: string) => `${user.toLowerCase()}1234`,
  (user: string) => `${user.toLowerCase()}12345678`,
  (user: string) => `${user.replace(/ /g, '')}1`,
  (user: string) => `${user.replace(/ /g, '')}12`,
  (user: string) => `${user.replace(/ /g, '')}123`,
  (user: string) => `${user.replace(/ /g, '')}1234`,
  (user: string) => `${user.replace(/ /g, '')}12345678`,
  (user: string) => user.replace(/ /g, '_'),
  (user: string) => `${user.replace(/ /g, '_')}1`,
  (user: string) => `${user.replace(/ /g, '_')}12`,
  (user: string) => `${user.replace(/ /g, '_')}123`,
  (user: string) => `${user.replace(/ /g, '_')}1234`,
  (user: string) => `${user.replace(/ /g, '_')}12345678`
];

export const getPasswordSet = (userName = '') => [...new Set(tests.map(test => test(userName)))];