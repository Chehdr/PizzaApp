import { Meteor } from 'meteor/meteor';

import './upload.js';
//import '../../api/orders/methods.js';
import '../../api/groups/groups.js';

    Meteor.methods({

        SendEmail: function (options) {
            check(options,{ from:String, to:String, subject:String, html:String});
            this.unblock();
            Email.send(options);
        }
    });