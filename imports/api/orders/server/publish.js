import { Meteor } from 'meteor/meteor';
import { Lists } from '../orders.js';

Meteor.publish("Orders", function () {
    return Orders.find({});
});
