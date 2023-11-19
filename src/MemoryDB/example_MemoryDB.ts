import { Redis,Cluster } from 'ioredis';

// Run with debugging on (Win)
// $env:DEBUG="ioredis:*"
// node .\dist\MemoryDB\example_MemoryDB.js

// Single-server
// let client = new Redis(6379, 'clustercfg.rediscommunications.f1yoxv.memorydb.us-east-1.amazonaws.com', {});

// Cluster
let client = new Cluster([
    { port: 6379, host: 'clustercfg.rediscommunications.f1yoxv.memorydb.us-east-1.amazonaws.com' }
],{
    dnsLookup: (address, callback) => callback(null, address),
    slotsRefreshTimeout: 2000,
    redisOptions: { tls: true }
});

(async () => {
    console.log('set');
    await client.set('HolaJML-123', 'Mundo');
    console.log('get');
    console.log(await client.get('HolaJML-123'));
    await client.del('HolaJML-123');

    console.log(await client.keys('a*'));

    client.disconnect();
})();



// Examples: (No funciona en cluster)
// https://aws.amazon.com/blogs/database/access-amazon-memorydb-for-redis-from-aws-lambda/
// https://remarkablemark.medium.com/how-to-use-redis-with-node-js-ioredis-368a8b754574
// [github - docs](https://github.com/luin/ioredis)  
// [ClusterAllFailedError](https://github.com/redis/ioredis/issues/1454)  
// [ioredis - ClusterAllFailedError: Failed to refresh slots cache](https://stackoverflow.com/questions/57350961/ioredis-clusterallfailederror-failed-to-refresh-slots-cache)  