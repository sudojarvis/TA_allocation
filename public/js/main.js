// {/* <><script language="JavaScript" type="text/javascript" src="/js/jquery-1.2.6.min.js"></script><script language="JavaScript" type="text/javascript" src="/js/jquery-ui-personalized-1.5.2.packed.js"></script><script language="JavaScript" type="text/javascript" src="/js/sprinkle.js"></script></> */}


$(function() {
	'use strict';
	
  $('.form-control').on('input', function() {
	  var $field = $(this).closest('.form-group');
	  if (this.value) {
	    $field.addClass('field--not-empty');
	  } else {
	    $field.removeClass('field--not-empty');
	  }
	});

});