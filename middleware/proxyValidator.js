const ipRangeCheck = require('ip-range-check');

const request = require('sync-request');

const cloudflareV4 = request('GET', 'https://www.cloudflare.com/ips-v4')
	.getBody()
	.toString()
	.split('\n');

const cloudflareV6 = request('GET', 'https://www.cloudflare.com/ips-v6')
	.getBody()
	.toString()
	.split('\n');

const allowedProxies = [
	...cloudflareV4,
	...cloudflareV6,
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

const proxyValidator = requestIp => {
	return ipRangeCheck(requestIp, allowedProxies);
};

module.exports = proxyValidator;
