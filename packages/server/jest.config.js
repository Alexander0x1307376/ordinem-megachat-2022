/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
};

// module.exports = {
//   postgre: {
//     image: 'postgres',
//     tag: '12.3-alpine',
//     ports: [5452],
//     env: {
//       POSTGRES_PASSWORD: 'integration-pass',
//     },
//     wait: {
//       type: 'text',
//       text: 'server started',
//     },
//   },
// };