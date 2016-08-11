import { Meteor } from 'meteor/meteor';
import { Lists } from '../events.js';

Meteor.publish("Events", function () {
    return Events.find({});
});
