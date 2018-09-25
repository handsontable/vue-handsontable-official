export function addLicenseBanner(config) {
  const path = require('path');
  const fs = require('fs');
  const envHotType = process.env.HOT_TYPE;
  const packageBody = require(`./src/${envHotType}/package.json`);

  let licenseBody = fs.readFileSync(path.resolve(__dirname, './LICENSE'), 'utf8');
  licenseBody += `\nVersion: ${packageBody.version} (built at ${new Date().toString()})`;

  config.output.banner = `/*!\n${licenseBody.replace(/^/gm, ' * ')}\n */`;

  return config;
}
