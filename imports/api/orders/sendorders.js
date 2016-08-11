import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';

Meteor.Status = {
    CheckStatus: function (idEvent, idGroup, status) {
       	switch(status){
            case 'ordering' :  status = 'ordered'; 	Meteor.call('SendOrder', idEvent, idGroup);  break 
            case 'ordered' : status = 'delivering'; break
            case 'delivering' : status = 'delivered'; break
            case 'delivered' : status = 'ordering'; break
        }
        Meteor.call('ChangeStatusEvent', idEvent, status);
	}
};