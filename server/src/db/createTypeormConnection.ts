import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";
import * as path from 'path';

const typeOrmConfig: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 3306,
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

export const connectionPromise = createConnection(typeOrmConfig);
