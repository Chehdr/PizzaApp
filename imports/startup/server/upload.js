import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import path from 'path';

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