const SOURCE_PATH = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '666666',
  database: 'nestjsrealworld',
  entities: [`${SOURCE_PATH}/**/**.entity{.ts,.js}`],
  synchronize: true
};
