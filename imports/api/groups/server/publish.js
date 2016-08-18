import { Meteor } from 'meteor/meteor';
import { Lists } from '../groups.js';

Meteor.publish("AllUsers", function () {
  return Meteor.users.find({});
    
});

Meteor.publish("Groups", function () {
	if(this.userId) {
  	return Groups.find({});
  }
});
