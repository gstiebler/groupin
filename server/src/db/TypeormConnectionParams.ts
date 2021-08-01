import "reflect-metadata";
import * as path from 'path';
import { SqlServerConnectionOptions } from "typeorm/driver/sqlserver/SqlServerConnectionOptions";

export const defaultTypeOrmConfig: SqlServerConnectionOptions = {
  type: "mssql",
  entities: [path.join(__dirname, '/entity/*.entity{.ts,.js}')],
  synchronize: false,
  migrations: [
    path.join(__dirname, '/migration/shared/*{.ts,.js}'),
  ],
  migrationsRun: true,
  logging: ['error']
};
