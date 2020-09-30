export interface IServerOptions {
    v2018Port: number;
    v2018Server: string;
    v2018DashboardFolder: string;
    v2018EnableCors: boolean;
}

export const defaultOptions: IServerOptions = {
    v2018Port: 3005,
    v2018Server: '0.0.0.0',
    v2018DashboardFolder: './dashboard',
    v2018EnableCors: true
}