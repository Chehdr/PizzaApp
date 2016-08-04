import './Coupons.html';
import '../../api/groups/groups.js';

Template.Coupons.helpers({
	Menu: function(){
		Meteor.subscribe('GroupsInfo');
        if(Roles.userIsInRole(Meteor.userId(), 'admin')){
            return GroupsInfo.findOne({'AdminGroup': Meteor.userId()});
        }else{
            return GroupsInfo.findOne( { 'users': { $in: [Meteor.userId() ] } } )
        }
	},
	Coupon: function(){
    	Meteor.subscribe('GroupsInfo');
      	return GroupsInfo.findOne({'AdminGroup': Meteor.userId()});
  	}
});

Template.Coupons.events({
	'click #AddCouponID' : function(e, i){
    	if(CouponItemID.value !== 'default' && CountCoupon.value !== '0' && !GroupsInfo.findOne({ 'coupons': { $elemMatch: { 'name': CouponItemID.value } } } )){
      		Meteor.call('CreateCoupon', CouponItemID.value, parseInt(CountCoupon.value));
     	}else{
      		Meteor.Errors.alertError('CouponError');
  		}
	},
	'click #RemoveCouponID' : function(e, i){
    	Meteor.call('RemoveCoupon', e.currentTarget.attributes.name.value);
  	}
});

