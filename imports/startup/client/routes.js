import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/body.js';
import '../../ui/pages/SendInviteToGroup.js';
import '../../ui/pages/GroupList.js';
import '../../ui/pages/Menu.js';
import '../../ui/pages/Coupons.js';
import '../../ui/pages/Event.js';
import '../../ui/pages/CreateGroup.js';
import '../../ui/pages/InvatesToGroup.js';
import '../../ui/pages/AddItemsToOrder.js';
import '../../ui/pages/OutputTemplate.html';


FlowRouter.route('/', {
  name: 'Home',
  action() {
    BlazeLayout.render('home', { main: 'OutputTemplate' });
  }
});

FlowRouter.route('/SendInviteToGroup', {
  name: 'SendInviteToGroup',
  action() {
    BlazeLayout.render('home', { main: 'SendInviteToGroup' });
  }
});

FlowRouter.route('/GroupList', {
  name: 'GroupList',
  action() {
    BlazeLayout.render('home', { main: 'GroupList' });
  }
});

FlowRouter.route('/Menu', {
  name: 'Menu',
  action() {
    BlazeLayout.render('home', { main: 'Menu' });
  }
});

FlowRouter.route('/Coupons', {
  name: 'Coupons',
  action() {
    BlazeLayout.render('home', { main: 'Coupons' });
  }
});

FlowRouter.route('/Event', {
  name: 'Event',
  action() {
    BlazeLayout.render('home', { main: 'Event' });
  }
});

FlowRouter.route('/Event', {
  name: 'Event',
  action() {
    BlazeLayout.render('home', { main: 'Event' });
  }
});

FlowRouter.route('/CreateGroup', {
  name: 'CreateGroup',
  action() {
    BlazeLayout.render('home', { main: 'CreateGroup' });
  }
});

FlowRouter.route('/InvatesToGroup', {
  name: 'InvatesToGroup',
  action() {
    BlazeLayout.render('home', { main: 'InvatesToGroup' });
  }
});

FlowRouter.route('/AddItemsToOrder', {
  name: 'AddItemsToOrder',
  action() {
    BlazeLayout.render('home', { main: 'AddItemsToOrder' });
  }
});
