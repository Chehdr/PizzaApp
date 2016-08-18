import { Meteor } from 'meteor/meteor';

Meteor.Errors = {
  alertError: function(name){
    let error;
    switch(name){
      case 'groupError' : error = 'Name and Image mast be entry!'; break;
      case 'MenuError' : error = 'Name and Price mast be entry!'; break;
      case 'CouponError' : error = 'Item and count must be selected! Available only one type coupon.'; break;
      case 'EventError' : error = 'Name must be entry!'; break;
      case 'OrderError' : error = 'Select Item and entry count!'; break;
    }
    swal("Error!", error, "error");
  }
};