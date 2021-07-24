import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";
import * as path from 'path';

const typeOrmConfig: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "",
  password: "",
  database: "groupin_dev",
  entities: [path.join(__dirname, './**/*.entity{.ts}')],
  synchronize: false,
  migrations: [
    path.join(__dirname, './migration/shared/*{.ts}'),
  ],
  migrationsRun: true,
  logging: ['error']
};

export default () => createConnection(typeOrmConfig);
