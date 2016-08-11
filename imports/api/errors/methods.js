import { Mongo } from 'meteor/mongo';
import '../../ui/pages/Error.js';

Meteor.Errors = {
	alertError: function(name){
		let error;
		switch(name){
			case 'groupError' : error = 'Please, enter name and select image!'; break;
        	case 'MenuError' : error = 'Please, enter Name and Price!'; break;
        	case 'CouponError' : error = 'Please, select Item and enter count! Available only one type of coupon.'; break;
        	case 'EventError' : error = 'Please, enter event name!'; break;
        	case 'OrderError' : error = 'Please, enter Item and Count!'; break;
		}
		if(!$('#alertWarningID')[0]){
			Blaze.renderWithData(Template.Error, error, warningErrorPlaceID);
		}
	}
};