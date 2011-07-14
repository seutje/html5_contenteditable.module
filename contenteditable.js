(function ($) {

Drupal.behaviors.contenteditable = {
  attach: function (context) {
    //add mouseenter to show toolbar
    $('div[contentEditable="true"]').focusin(function() {
     //$('#contenteditableButtons').slideUp('slow').delay(500).remove();
     $(this).before('<div id="contenteditableButtons" class="contenteditable_buttons"><button data-command="bold" alt="bold"><b>B</b></button> <button data-command="italic" alt="italic"><i>I</i></button> <button data-command="underline" alt="underline"><u>U</u></button> <button id="contenteditableSave" data-nid="'+ $(this).data("nid") + '"data-fieldname="'+ $(this).data("fieldname") + '">Save</button></div>');
     $('#contenteditableButtons').slideDown('slow');
     $('#contenteditableButtons button[data-command]').each(function(){
        $(this).unbind('click').bind('click', function() {
         var value = $(this).attr('cmdValue') || null;
         var returnValue = document.execCommand($(this).data("command"),false,value);
         if (returnValue) return returnValue;
       });
      });
      
     $('#contenteditableSave').bind('click', function() {
        
        $('#contenteditableButtons').slideUp('slow');
        var editedField = $('div[contentEditable="true"][data-nid="' + $(this).data("nid") + '"][data-fieldname="' + $(this).data("fieldname") + '"]');
        editedField.blur();
        jQuery.ajax({
          type: 'POST',
          url: '/contenteditable/ajax',
          dataType: 'json',
          success: function(json){
            $('div[data-nid="' + json['nid'] + '"][data-fieldname="' + json['fieldname'] + '"]').effect("highlight", {}, 3000);
            $('div[data-nid="' + json['nid'] + '"][data-fieldname="' + json['fieldname'] + '"]').before('<div id="contenteditableSuccess" class="messages status">' + json['msg'] + '</div>');
            $('#contenteditableSuccess').delay(1800).slideUp('slow', function() { $(this).remove(); });
            $('#contenteditableButtons').remove();
          },
          data: {'field_value': editedField.html(), 'nid': editedField.data("nid"), 'fieldname':editedField.data("fieldname")}
        });
        
      });
    });
  }
};

})(jQuery);