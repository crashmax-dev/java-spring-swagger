import { exec, spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { createClient } from '@hey-api/openapi-ts';
import gracefulKill from 'graceful-kill';

const isWindows = process.platform === 'win32';

async function main() {
  const bootRun = exec('gradlew bootRun');

  if (!isWindows) {
    bootRun.unref();
  }

  try {
    const json = await new Promise((resolve) => {
      const interval = setInterval(async () => {
        try {
          const res = await fetch('http://localhost:8080/v3/api-docs');
          if (res.ok) {
            clearInterval(interval);
            resolve(await res.json())
          }
        } catch {}
      }, 1000);
    });

    await writeFile('swagger.json', JSON.stringify(json, null, 2));
    console.log('Swagger JSON saved to swagger.json');

    await createClient({
      input: 'swagger.json',
      output: 'api',
      plugins: [
        {
          name: '@hey-api/sdk',
          auth: false,
        },
        {
          name: '@hey-api/client-fetch',
          throwOnError: true,
        },
        {
          enums: 'javascript',
          enumsCase: 'PascalCase',
          name: '@hey-api/typescript',
        },
      ],
    })
    console.log('API client generated in src/api');

  } catch (error) {
    console.error(error);
  } finally {
    if (isWindows && bootRun.pid) {
      spawn('taskkill', ['/F', '/T', '/PID', `${bootRun.pid}`]);
    } else {
      gracefulKill(bootRun).then(() => {
        process.exit(0);
      });
    }
  }
}

main().catch(console.error);
