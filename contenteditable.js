(function ($) {

Drupal.behaviors.contenteditable = {
  attach: function (context) {
    //add mouseenter to show toolbar
    $('div[contentEditable="true"]').focusin(function() {
     $('#contenteditableButtons').slideUp('slow').delay(500).remove();
     $(this).before('<div id="contenteditableButtons" class="contenteditable_buttons"><button id="contenteditableBold" alt="bold"><b>B</b></button> <button id="contenteditableItalic" alt="italic"><i>I</i></button> <button id="contenteditableUnderline" alt="underline">U</button> <button id="contenteditableSave" data-nid="'+ $(this).data("nid") + '"data-fieldname="'+ $(this).data("fieldname") + '">Save</button></div>');
     $('#contenteditableButtons').slideDown('slow');
     $('#contenteditableBold').bind('click', function() {
      document.execCommand('bold',false,null);
     });
     $('#contenteditableItalic').bind('click', function() {
      document.execCommand('italic',false,null);
     });
     $('#contenteditableUnderline').bind('click', function() {
      document.execCommand('underline',false,null);
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
            $.notifyBar({
              html: json['msg'],
              delay: 2000,
              animationSpeed: "normal",
              cls: "success"
            }); 
            $('#contenteditableButtons').remove();
          },
          data: {'field_value': editedField.html(), 'nid': editedField.data("nid"), 'fieldname':editedField.data("fieldname")}
        });
        
      });
    });
  }
};

})(jQuery);