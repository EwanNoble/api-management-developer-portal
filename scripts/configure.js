const fs = require('fs'),
    path = require('path'),    
    configDesignFile = path.join(__dirname, '\\..\\src\\config.design.json'),
    configPublishFile = path.join(__dirname, '\\..\\src\\config.publish.json'),
    configRuntimeFile = path.join(__dirname, '\\..\\src\\config.runtime.json');

const managementEndpoint = process.argv[2];
const apimSasAccessTokenValue = process.argv[3];
const storageSasUrlValue = process.argv[4];
const storageConnectionStringValue = process.argv[5];
const apimServiceUrlValue = `https://${managementEndpoint}`;
const apimServiceParameter = "managementApiUrl";
const apimSasAccessTokenParameter = "managementApiAccessToken";
const storageSasUrlParameter = "blobStorageUrl";
const storageConnectionStringParameter = "blobStorageConnectionString";

fs.readFile(configDesignFile, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        const obj = JSON.parse(data);
        obj[apimServiceParameter] = apimServiceUrlValue;
        obj[apimSasAccessTokenParameter] = apimSasAccessTokenValue;
        obj[storageSasUrlParameter] = storageSasUrlValue;
        fs.writeFile(configDesignFile, JSON.stringify(obj, null, 4), function(errWrite) {
            if(errWrite) {
                return console.log(errWrite);
            }
        });
    } else {
        console.log(err);
    }
});

fs.readFile(configPublishFile, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        const obj = JSON.parse(data);
        obj[apimServiceParameter] = apimServiceUrlValue;
        obj[apimSasAccessTokenParameter] = apimSasAccessTokenValue;
        obj[storageConnectionStringParameter] = storageConnectionStringValue;
        fs.writeFile(configPublishFile, JSON.stringify(obj, null, 4), function(errWrite) {
            if(errWrite) {
                return console.log(errWrite);
            }
        });
    } else {
        console.log(err);
    }
});

fs.readFile(configRuntimeFile, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        const obj = JSON.parse(data);
        obj[apimServiceParameter] = apimServiceUrlValue;
        fs.writeFile(configRuntimeFile, JSON.stringify(obj, null, 4), function(errWrite) {
            if(errWrite) {
                return console.log(errWrite);
            }
        });
    } else {
        console.log(err);
    }
});