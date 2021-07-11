import "reflect-metadata";
import { createConnection, ConnectionOptions} from "typeorm";
import {User} from "./entity/User";
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

createConnection(typeOrmConfig).then(async connection => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.name = "Timber";
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
