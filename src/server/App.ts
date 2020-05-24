import bodyParser from "body-parser";
import express from "express";
import { resolve as resolvePath } from 'path';
import { Server } from "http";
import io from 'socket.io';

import * as config from "./config";
import { log } from "./log";

export default class App {
    app: express.Application;
    http: Server;
    io: io.Server;

    constructor() {
        this.app = express();
        this.configApp();
        this.startSocket();
        this.defineRoutes();
        this.listen();
    }
        
    /**
     * Return the Express Application
     */
    public getApp = (): express.Application => this.app;

    /**
     * Return the socket
     */
    public getIO = (): io.Server => this.io;

    /**
     * Configure Express to parse json, setup pug as our html view engine for generating html pages and host the resources
     */
    private configApp(): void {
        this.app.use(bodyParser.json());
        this.app.set('views', resolvePath(`${__dirname}`, '../views'));
        this.app.use(express.static(resolvePath(`${__dirname}`, '../')));
    }

    /**
     * Create a socket.io server
     */
    private startSocket = () => {
        this.http = new Server(this.app);
        this.io = io(this.http);
    };

    /**
     * Define the routes used in the application
     */
    private defineRoutes(): void {
        const router: express.Router = express.Router();
        
        this.app.use('/', router);
    }

    /**
     * Start the Node.js server
     */
    private listen = (): void => {
        const runningMessage = `Overlay server is running on port http://localhost:${
        config.port
        }`;
        this.http.listen(config.port, () => {
        log(runningMessage, 'info');
        });
    };
}