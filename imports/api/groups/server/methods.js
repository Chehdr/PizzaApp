import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import '../groups.js';
import '../../events/events.js';
import '../../orders/orders.js';

Meteor.methods({
  CreateGroup: function (name, image) {
    check(name, String);
    check(image, String);
    Roles.addUsersToRoles(Meteor.userId(), ['admin']);
    let info = { 
    	name: name, 
      image: image, 
      AdminGroup: Meteor.userId(), 
      AdminGroupName: Meteor.user().profile['first-name'] +' '+ Meteor.user().profile['last-name'],
      dateCreate: new Date(), 
      invite: [],
      users: [],
      menu: {},
      coupons: []
    }
    Groups.insert( info );
  },
  DeleteGroup: function() {
    Roles.removeUsersFromRoles( Meteor.userId(), 'admin');
    let Group = Groups.findOne({'AdminGroup': Meteor.userId()});
    _.each(Group.users, function(id){ 
      Roles.removeUsersFromRoles( id, 'user');
    });
    Groups.remove({'_id': Group._id});
    Events.remove({'GroupId': Group._id});
    Orders.remove({'GroupId': Group._id});
  },
  SendInvite: function(userId){
    check(userId, String);
    Groups.update({ 'AdminGroup': Meteor.userId() }, { $push: { 'invite': {'userId': userId} } });
  },
  DeclineInviteToGroup: function(groupId){
    check(groupId, String);
    Groups.update({'_id': groupId }, { $pull: { "invite" : { userId: Meteor.userId()} } }, false, true );
  },
  AcceptInviteToGroup: function(groupId){
    check(groupId, String);
    Roles.addUsersToRoles(Meteor.userId(), ['user']);
    Groups.update({'_id': groupId }, { $push: { 'users': Meteor.userId() } });
    Groups.update({invite:{userId:Meteor.userId()}}, { $pull: { "invite" : { userId: Meteor.userId()} } },{multi: true});
  },
  RemoveUserFromGroup: function(userId){
    check(userId, String);
    Roles.removeUsersFromRoles( userId, 'user');
    Groups.update({'AdminGroup': Meteor.userId() }, { $pull: { 'users': userId } });
  },
  LeaveGroup: function(){
    Roles.removeUsersFromRoles( Meteor.userId(), 'user');
    Groups.update({}, { $pull: { 'users': Meteor.userId() } },{multi: true});
  },
  GroupMenu: function(menu){
    if(Roles.userIsInRole(Meteor.userId(), 'admin')){
      Groups.update({'AdminGroup': Meteor.userId()}, { $set: { 'menu': menu } });
    }else{
      Groups.update({ 'users': { $in: [Meteor.userId() ] }} , { $set: { 'menu': menu } });
    }
  },
  CreateCoupon: function(name, count){
    check(name, String);
    check(count, Number);
    Groups.update({'AdminGroup': Meteor.userId()}, { $push: { 'coupons': {'name': name, 'count': count}} });
  },
  RemoveCoupon: function(name){
    check(name, String);
    Groups.update({'AdminGroup': Meteor.userId()}, { $pull: { 'coupons': {'name':name} } });
  }
});