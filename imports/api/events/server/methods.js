import { Meteor } from 'meteor/meteor';

    Meteor.methods({
        CreateEvent: function(name, id){
            let info = {
                'GroupId': id,
                'createUser': Meteor.userId(), 
                'dateCreate': new Date(),
                'eventName': name,
                'accepts': [Meteor.userId()],
                'status': 'ordering'
            }
            Events.insert( info ); 
        },
        RemoveEvent: function(id){
            Events.remove({'_id': id});
            Orders.remove({'EventId': id});
        },
        JoinToEvent: function(idEvent){
            Events.update({'_id': idEvent}, {$push: {'accepts': Meteor.userId()}});
        },
        ChangeStatusEvent: function(idEvent, status){
            if (status == 'delivered'){
                Orders.remove({'EventId': idEvent});
            }
            Events.update({'_id': idEvent}, {$set: {'status': status}});
        }
    });