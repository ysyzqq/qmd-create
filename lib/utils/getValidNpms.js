const { execSync } = require('child_process');

function getNpmClients() {
    const npms = [];
    try {
        execSync('yarn --version', {stdio: 'ignore'})
        npms.push('yarn')
    } catch(e) {}
    try {
        execSync('cnpm --version', {stdio: 'ignore'})
        npms.push('cnpm')
    } catch(e) {}
    try {
        execSync('npm --version', {stdio: 'ignore'})
        npms.push('npm')
    } catch(e) {}
    return npms;
}
module.exports = getNpmClients;