import './Error.html';

Template.Error.onRendered(function () {
	setTimeout(function(){$('#warningErrorPlaceID').empty()}, 3000);
})