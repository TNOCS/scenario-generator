import dotenv from 'dotenv'
dotenv.config();
import { IServerOptions, defaultOptions } from './interfaces/IServerOptions';
import yn from 'yn';
import { formatISO } from 'date-fns';

export const RUN_FOLDER = __dirname;

export const assertFrom = (from: any) => (from == undefined) ? formatISO(new Date(0)) : typeof +from === 'number' && !isNaN(+from) ? formatISO(+from) : from;
export const assertTo = (to: any) => (to == undefined) ? formatISO(new Date(2999, 1, 1)) : typeof +to === 'number' && !isNaN(+to) ? formatISO(+to) : to;

export const getServerOptions = () => {
    const options: IServerOptions = defaultOptions;
    if (process.env.V2018_SERVER) options.v2018Server = process.env.V2018_SERVER;
    if (process.env.V2018_PORT) options.v2018Port = +process.env.V2018_PORT;
    if (process.env.V2018_DASHBOARD_FOLDER) options.v2018DashboardFolder = process.env.V2018_DASHBOARD_FOLDER;
    if (process.env.V2018_ENABLE_CORS) options.v2018EnableCors = yn(process.env.V2018_ENABLE_CORS);
    return options;
};