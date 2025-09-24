import axios from 'axios';
import {ClientRequest} from 'http';
import os from 'os';

export class DockerApi {
    private static randomNumber = Math.floor(Math.random() * 10);
    static portNumber = `1234${DockerApi.randomNumber}`;
    CHROME_CONTAINER_NAME = `chrome-browser-${DockerApi.randomNumber}`;

    static axiosInstance = axios.create({baseURL: 'http://localhost:2375'});

    constructor(private imageName: string) {}

    async createContainer(cmd: string[]) {
        process.env.PLAYWRIGHT_PORT = DockerApi.portNumber;

        console.log('Spawning chrome docker container.');
        try {
            await DockerApi.axiosInstance.post(`/containers/create?name=${this.CHROME_CONTAINER_NAME}`, {
                Image: this.imageName,
                Cmd: cmd,
                AttachStdin: false,
                AttachStdout: false,
                AttachStderr: false,
                HostConfig: {
                    PortBindings: {
                        [`${DockerApi.portNumber}/tcp`]: [{HostPort: DockerApi.portNumber}],
                    },
                },
                ExposedPorts: {
                    [`${DockerApi.portNumber}/tcp`]: {},
                },
            });
            console.log('Created chrome docker container.');
        } catch (e) {
            console.log('catch run error', e);
        }
    }

    async getContainerStatus(): Promise<string> {
        const {data} = await DockerApi.axiosInstance.get<any>(`/containers/${this.CHROME_CONTAINER_NAME}/json`);
        return data.State.State;
    }

    async pullImage() {
        try {
            return new Promise<void>(async (resolve, reject) => {
                try {
                    const {data} = await DockerApi.axiosInstance.post<ClientRequest>(`/images/create?fromImage=${this.imageName}`, null, {
                        responseType: 'stream',
                    });

                    data.on('data', (chunk) => {
                        if (chunk.includes('Download complete')) {
                            console.log(chunk.toString().trim());
                        }
                    });

                    // The whole response has been received. Print out the result.
                    data.on('end', () => {
                        data.destroy();
                        resolve();
                    });
                    data.on('error', () => {
                        data.destroy();
                        reject();
                    });
                } catch (e) {
                    reject(e);
                }
            });
        } catch (e) {
            console.log('Error while pulling an image');
            console.log(e);
        }
    }

    async findContainer() {
        try {
            const {data} = await DockerApi.axiosInstance.get<any[]>('/containers/json?all=true');
            return data.find((containerInfo) => containerInfo.Names.some((name: string) => name.includes(this.CHROME_CONTAINER_NAME)));
        } catch (e) {
            console.log('Error while finding container.');
            console.log(e);
        }
    }

    async findImage() {
        console.log(`Trying to find image ${this.imageName}`);
        try {
            const {data} = await DockerApi.axiosInstance.get<any[]>(`/images/json?filters={"reference":["${this.imageName}"]}`);
            if (data[0]) {
                console.log(`Chrome image ${this.imageName} found.`);
                return data[0];
            }
            console.log('Chrome image not found.');
            return;
        } catch (e: unknown) {
            console.log('Error while trying to find chrome image.');
            if (axios.isAxiosError(e)) {
                if (e.code === 'ENOENT') {
                    throw Error('Docker desktop is not responding - check if it is running.');
                }
            }
        }
    }

    async startContainer() {
        try {
            await DockerApi.axiosInstance.post(`/containers/${this.CHROME_CONTAINER_NAME}/start`);
            console.log('Started chrome docker container.');
        } catch (e) {
            console.log('Error while starting container.');
            console.log(e);
        }
    }

    async stopAndRemoveContainer() {
        try {
            await DockerApi.axiosInstance.post(`/containers/${this.CHROME_CONTAINER_NAME}/stop`);
            console.log('Chrome docker container stopped.');
            await DockerApi.axiosInstance.delete(`/containers/${this.CHROME_CONTAINER_NAME}`);
            console.log('Chrome docker container removed.');
        } catch (e: any) {
            if ('statusCode' in e && e.statusCode === 404) {
                console.log('Container already stopped.');
            } else {
                throw e;
            }
        }
    }

    static getSocketPath() {
        return os.type() === 'WINDOWS_NT' ? '//./pipe/docker_engine' : '/var/run/docker.sock';
    }

    async waitForChromeToBeUp(log: string) {
        try {
            return new Promise<void>(async (resolve, reject) => {
                const {data} = await DockerApi.axiosInstance.get<ClientRequest>(
                    `/containers/${this.CHROME_CONTAINER_NAME}/logs?follow=true&stdout=true&stderr=true`,
                    {
                        responseType: 'stream',
                    },
                );

                data.on('data', (chunk) => {
                    if (chunk.toString().includes(log)) {
                        console.log('Chrome browser is UP.');
                        data.destroy();
                        resolve();
                    }
                });

                data.on('end', () => {
                    console.log('end');
                    resolve();
                });
                data.on('error', () => {
                    data.destroy();
                    reject();
                });
            });
        } catch (e) {
            console.log('Error while waiting for chrome browser to be UP.');
            console.log(e);
        }
    }
}
