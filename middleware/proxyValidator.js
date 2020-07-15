const ipRangeCheck = require('ip-range-check');
const axios = require('axios');

const allowedProxies = [
	'127.0.0.1/8',
	'255.255.255.0',
	'::1/128',
	'169.254.0.0/16',
	'fe80::/10',
	'10.0.0.0/8',
	'172.16.0.0/12',
	'192.168.0.0/16',
	'fc00::/7'
];

axios.get('https://www.cloudflare.com/ips-v4').then(res => {
	allowedProxies.push(...res.data.split('\n'));
});

axios.get('https://www.cloudflare.com/ips-v6').then(res => {
	allowedProxies.push(...res.data.split('\n'));
});

const proxyValidator = requestIp => {
	return ipRangeCheck(requestIp, allowedProxies);
};

module.exports = proxyValidator;
