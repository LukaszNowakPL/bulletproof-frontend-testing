import * as fs from 'fs';
import {resolve} from 'path';
import {Axios} from 'axios';
import {create} from 'tar';
import {DockerApi} from './docker-api';

const {version} = JSON.parse(fs.readFileSync(resolve(process.cwd(), 'node_modules', '@playwright', 'test', 'package.json')) as any);

export class PlaywrightApi {
    imageName;

    constructor(private axiosInstance: Axios) {
        this.imageName = `playwright:v${version}-noble`;
    }

    getImageName() {
        return this.imageName;
    }

    getRunCommand() {
        return [
            'node',
            '-e',
            `const {chromium} = require('playwright-core');
                chromium.launchServer({
                    port: ${DockerApi.portNumber},
                    wsPath: 'string',
                }).then((server) => console.log("Docker browser server started."));`,
        ];
    }

    async sendPlaywrightCoreToContainer(containerName: string) {
        try {
            console.log('Sending playwrigh-core to docker.');
            await this.axiosInstance.put(
                `/containers/${containerName}/archive?path=/`,
                create({gzip: true, preservePaths: true}, ['node_modules/playwright-core']),
                {headers: {'Content-Type': 'application/x-tar'}},
            );
        } catch (e) {
            console.log('Error while sending playwright-core to container.');
            console.log(e);
        }
    }

    getDockerBrowserUpLog() {
        return 'Docker browser server started.';
    }
}
