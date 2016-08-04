import { Meteor } from 'meteor/meteor';

import './upload.js';
import '../../api/orders/methods.js';
import '../../api/groups/groups.js';

    Meteor.methods({

        SendEmail: function (options) {
            check(options,{ from:String, to:String, subject:String, html:String});
            this.unblock();
            Email.send(options);
        },

        UserToAdminInGroup: function (name, image) {
            Roles.addUsersToRoles(Meteor.userId(), ['admin']);
            GroupsInfo.insert({
                'name':name, 
                'image': image, 
                'AdminGroup': Meteor.userId(), 
                'AdminGroupName': Meteor.user().profile['first-name'] +' '+ Meteor.user().profile['last-name'],
                'dateCreate': new Date(), 
                'invite':[],
                'users':[],
                'menu':{},
                'events': [],
                'coupons': [],
            });
        },
        
        DeleteGroup: function() {
            Roles.removeUsersFromRoles( Meteor.userId(), 'admin');
            let UsersRemoveFromRole =  GroupsInfo.findOne({'AdminGroup': Meteor.userId()}).users;
            _.each(UsersRemoveFromRole, function(id){ 
                Roles.removeUsersFromRoles( id, 'custumer');
            });
            GroupsInfo.remove({'AdminGroup': Meteor.userId()});
        },
        SendInvite: function(userId){
            GroupsInfo.update({ 'AdminGroup': Meteor.userId() }, { $push: { 'invite': {'userId': userId} } });
        },
        DeclineInviteToGroup: function(groupId){
            GroupsInfo.update({'_id': groupId }, { $pull: { "invite" : { userId: Meteor.userId()} } }, false, true );
        },
        AcceptInviteToGroup: function(groupId){
            Roles.addUsersToRoles(Meteor.userId(), ['custumer']);
            GroupsInfo.update({'_id': groupId }, { $push: { 'users': Meteor.userId() } });
            GroupsInfo.update({invite:{userId:Meteor.userId()}}, { $pull: { "invite" : { userId: Meteor.userId()} } },{multi: true});
        },
        RemoveUserFromGroup: function(userId){
            Roles.removeUsersFromRoles( userId, 'custumer');
            GroupsInfo.update({'AdminGroup': Meteor.userId() }, { $pull: { 'users': userId } });
        },
        LeaveGroup: function(){
            Roles.removeUsersFromRoles( Meteor.userId(), 'custumer');

            GroupsInfo.update({}, { $pull: { 'users': Meteor.userId() } },{multi: true});
        },
        GroupMenu: function(menu){
            if(Roles.userIsInRole(Meteor.userId(), 'admin')){
                GroupsInfo.update({'AdminGroup': Meteor.userId()}, { $set: { 'menu': menu } });
            }else{
                GroupsInfo.update({ 'users': { $in: [Meteor.userId() ] }} , { $set: { 'menu': menu } });
            }
        },
        CreateCoupon: function(name, count){
            GroupsInfo.update({'AdminGroup': Meteor.userId()}, { $push: { 'coupons': {'name': name, 'count': count}} });
        },
        RemoveCoupon: function(name){
            GroupsInfo.update({'AdminGroup': Meteor.userId()}, { $pull: { 'coupons': {'name':name} } });
        },
        CreateEvent: function(name){
            var LocalAdmin = {};
            if(Roles.userIsInRole(Meteor.userId(), 'admin')){
                LocalAdmin = {'AdminGroup': Meteor.userId()};
            }else{
                LocalAdmin = { 'users': { $in: [Meteor.userId() ] }};
            }
            GroupsInfo.update(LocalAdmin , { 
                    $push: { 
                        'events': {
                            'createUser': Meteor.userId(), 
                            'dateCreate': new Date(),
                            'eventName': name,
                            'accepts': [Meteor.userId()],
                            'orders': [],
                            'status': 'ordering'
                        }} 
            }); 
        },
        RemoveEvent: function(name){
        var LocalAdmin = {};
            if(Roles.userIsInRole(Meteor.userId(), 'admin')){
                LocalAdmin = {'AdminGroup': Meteor.userId()};
            }else{
                LocalAdmin = { 'users': { $in: [Meteor.userId() ] }};
            }
            GroupsInfo.update(LocalAdmin, { $pull: { 'events': {'eventName': name} } });
        },
        JoinToEvent: function(idGroup, name){
            GroupsInfo.update({'_id': idGroup, 'events.eventName': name}, {$push: {'events.$.accepts': Meteor.userId()}})
        },
        AddOrderToEvent: function(groupId, name, order){
            GroupsInfo.update({'_id': groupId, 'events.eventName': name}, {$push: {'events.$.orders': order}});
            let Limit = GroupsInfo.findOne( { _id: groupId}, {fields:{'events':1}});
            for (let i = 0; i < Limit.events.length; i++) {
                if (Limit.events[i].eventName == name){
                    if(Limit.events[i].accepts.length == Limit.events[i].orders.length){
                        Meteor.Order.CheckStatus(name, Limit.events[i].status, Limit.events[i].orders, Limit._id);
                    }
                }
            }

        },
        ChangeStatusGroup: function(name, status){
            GroupsInfo.update({'events.eventName': name}, {$set: {'events.$.status': status}})
        }
    });