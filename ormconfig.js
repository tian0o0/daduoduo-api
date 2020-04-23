const SOURCE_PATH = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
const PASSWORD =
  process.env.NODE_ENV === 'production' ? 'Miaword2018' : '666666';

module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: PASSWORD,
  database: 'nestjsrealworld',
  entities: [`${SOURCE_PATH}/**/**.entity{.ts,.js}`],
  synchronize: true,
  cache: true,
  // cache: {
  //   duration: 60000,
  //   type: 'redis',
  //   options: {
  //     host: 'localhost',
  //     port: 6379,
  //   },
  // },
};
