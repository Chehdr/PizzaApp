import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './Coupons.html';
import '../../api/groups/groups.js';

Template.Coupons.helpers({
	Menu: function(){
		Meteor.subscribe('Groups');
        if(Roles.userIsInRole(Meteor.userId(), 'admin')){
            return Groups.findOne({'AdminGroup': Meteor.userId()});
        }else{
            return Groups.findOne( { 'users': { $in: [Meteor.userId() ] } } )
        }
	},
	Coupon: function(){
    	Meteor.subscribe('Groups');
      	return Groups.findOne({'AdminGroup': Meteor.userId()});
  	}
});

Template.Coupons.events({
	'click #AddCouponID' : function(e, i){
    	if(CouponItemID.value !== 'default' && CountCoupon.value !== '0' && !Groups.findOne({ 'coupons': { $elemMatch: { 'name': CouponItemID.value } } } )){
      		Meteor.call('CreateCoupon', CouponItemID.value, parseInt(CountCoupon.value));
     	}else{
      		Meteor.Errors.alertError('CouponError');
  		}
	},
	'click #RemoveCouponID' : function(e, i){
    	Meteor.call('RemoveCoupon', e.currentTarget.attributes.name.value);
  	}
});

