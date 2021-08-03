import "reflect-metadata";
import * as path from 'path';
import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";

export const defaultTypeOrmConfig: MongoConnectionOptions = {
  type: "mongodb",
  entities: [path.join(__dirname, '/entity/*.entity{.ts,.js}')],
  synchronize: false,
  migrations: [
    path.join(__dirname, '/migration/shared/*{.ts,.js}'),
  ],
  migrationsRun: true,
  logging: true
};
