// Deployment script
const Client = require('ftp')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

require('dotenv').config()

const ENV = process.env
const BUILD_PATH = path.resolve(__dirname, ENV.BUILD_PATH || 'build')
const TARGET_PATH = ENV.TARGET_PATH
const USERNAME = ENV.FTP_USERNAME
const PASSWORD = ENV.FTP_PASSWORD
const HOST = ENV.FTP_HOST
const PORT = ENV.FTP_PORT || 21

const client = new Client()

const listFiles = dir => {
  let filesList = [];

  const files = fs.readdirSync(dir);
  files.map(file => {
    const fullPath = path.resolve(dir, file);
    const stats = fs.lstatSync(fullPath);
    if (stats.isDirectory()) {
      filesList = filesList.concat(listFiles(fullPath));
    } else {
      if (dir.endsWith(BUILD_PATH)) {
        filesList.push({
          'local': fullPath,
          'target': file
        });
      } else {
        const lastSeparator = dir.lastIndexOf(path.sep);
        const parentDir = dir.substring(lastSeparator);
        const targetPath = `${parentDir}${path.sep}${file}`.replace(/\\/g, '/');

        filesList.push({
          'local': fullPath,
          'target': targetPath
        });
      }
    }
  });

  return filesList;
};

client.on("greeting", msg => {
  console.log(chalk.green(msg));
});

client.on("ready", () => {
  client.list(TARGET_PATH, (error, serverList) => {
    console.log(chalk.green('Get list from server.'));

    const uploadList = listFiles(BUILD_PATH);
    const total = uploadList.length;
    let uploadCount = 0;
    let errorList = [];

    uploadList.map((file, index) => {
      console.log(chalk.blue(`Start file upload: ${file.local} ---> ${file.target}`));
      client.put(file.local, file.target, (error) => {
        if (error) {
          console.error(chalk.red(`Error: ${file.local} ---> ${file.target}`));
          console.error(chalk.red(error.message));
        } else {
          console.info(chalk.green(`Success: ${file.local} ---> ${file.target}`));
        }
      })
    });

    client.rename('index-critical.html', 'index.html', error => {
      if (error) {
        console.error(chalk.red(error.message));
      } else {
        console.info(chalk.green(`Success: Index has been renamed.`));
      }

    })

    client.end();
  });
});

client.connect({
  host: HOST,
  port: PORT,
  user: USERNAME,
  password: PASSWORD,
});