import "reflect-metadata";
import * as path from 'path';
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const defaultTypeOrmConfig: PostgresConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "",
  password: "",
  database: "groupin_dev",
  entities: [path.join(__dirname, '/entity/*.entity{.ts,.js}')],
  synchronize: false,
  migrations: [
    path.join(__dirname, '/migration/shared/*{.ts,.js}'),
  ],
  migrationsRun: true,
  logging: ['error']
};
