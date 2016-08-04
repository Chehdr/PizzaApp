import { Meteor } from 'meteor/meteor';

let fs = Npm.require('fs');
let path = Npm.require('path');
let MeteorRoot = fs.realpathSync(__meteor_bootstrap__.serverDir + '/../' );
let ApplicationRoot = fs.realpathSync( MeteorRoot + '/../../../../' );

if(path.basename( fs.realpathSync(MeteorRoot + '/../../../' ) ) == '.meteor'){
    application_root =  fs.realpathSync(MeteorRoot + '/../../../../' );
}

UploadServer.init({
    tmpDir:  ApplicationRoot + '/.uploads/tmp',
    uploadDir: ApplicationRoot + '/.uploads/',
    checkCreateDirectories: true,
    finished: function(fileInfo, formFields) {},
    cacheTime: 100,
    mimeTypes: {
        "xml": "application/xml",
         "vcf": "text/x-vcard"
    }
});