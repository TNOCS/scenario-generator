import { Injectable } from '@nestjs/common';
import queryString from 'query-string';
import Axios from 'axios';
import { spawn } from 'child_process';
import { join, resolve } from 'path';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'Hello World! Open the dashboard by typing `/dashboard` to your current page-address.';
  }

  async getLanguages(): Promise<string[]> {
    return ["EN", "NL"];
  }

  // Just an example api returning 10 random words
  async getWordsFromApi(): Promise<string[]> {
    const axios = Axios.create({ baseURL: 'https://random-word-api.herokuapp.com' });
    const data = await axios.get('/word', { params: { 'number': 10, 'swear': 1 } });
    return data.data;
  }

  // Just an example api returning data from a script file
  async getWordsFromScript(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let dataFromPython;
      console.log(`Dir: ${process.cwd()}`);
      // spawn new child process to call the python script
      const python = spawn('python', [join('scripts','script1.py')]);
      // collect data from script
      python.stdout.on('data', (data: any) => {
        dataFromPython = data.toString();
      });
      // in close event we are sure that stream from child process is closed
      python.on('close', (code: number) => {
        console.log(`Closed all stdio with code ${code}`);
        resolve(dataFromPython);
      });
    });
  }
}
