const execa = require('execa');


async function getNpms() {
    const npms = [];
    try {
        await execa('yarn', ['--version'])
        npms.push('yarn')
    } catch {}
    try {
        await execa('cnpm', ['--version'])
        npms.push('cnpm')
    } catch {}
    try {
        await execa('npm', ['--version'])
        npms.push('npm')
    } catch {}
    return npms;
}
module.exports = getNpms;