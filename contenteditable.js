(function ($) {
var self =
Drupal.behaviors.contenteditable = {
  attach: function (context) {
    // Make sure it was initialized.
    if (!self.initialized) {
      self.init();
    }
    // Bind handlers and prevent elements from being processed again.
    $('div[contenteditable]', context)
    .not('.contenteditable-processed')
    .addClass('contenteditable-processed')
    .bind('focusin', self.focusin)
    .bind('focusout', self.focusout);
  },
  init: function() {
    // Create controls, store reference and bind handlers.
    self.controls = $('<div id="contenteditableButtons" class="contenteditable_buttons"><button data-command="bold" alt="bold"><b>B</b></button> <button data-command="italic" alt="italic"><i>I</i></button> <button data-command="underline" alt="underline"><u>U</u></button> <button id="contenteditableSave">Save</button></div>').appendTo('body');
    self.controls.find('#contenteditableSave').bind('click', self.submitHandler);
    self.controls.find('[data-command]').bind('click', self.commandHandler);
    self.initialized = true;
  },
  focusin: function(e) {
    // Move the controls to right before the element we're editing.
    self.active = $(this);
    var $clone = self.controls.clone(true);
    self.controls.remove();
    self.controls = $clone;
    self.controls.hide().insertBefore(self.active).fadeIn('slow');
  },
  focusout: function(e) {
    // TODO: handle removing the controls in a sane way.
  },
  commandHandler: function(e) {
    // Executes commands attached to the controls.
    var $this = $(this),
        cmd = $this.data('command')
        cmdValue = $this.attr('cmdValue') || null,
        returnValue = document.execCommand(cmd, false, cmdValue);
    if (returnValue) {
      return returnValue;
    }
  },
  submitHandler: function(e) {
    // If they manage to press the button before an element was set as active,
    // or there are no controls, throw an exception, otherwise, post the data.
    if (!self.active) {
      throw new Error('Active element not found.');
    }
    if (!self.controls) {
      throw new Error('Failed to hide controls: reference not found.');
    }
    // Hide the controls and trigger the hide helper
    self.controls.slideUp('slow', self.hideControls);
    var ajax_data = {
      'field_value': self.active.html(),
      'nid': self.active.data('nid'),
      'fieldname': self.active.data('fieldname')
    }
    $.ajax({
      type: 'POST',
      url: Drupal.settings.basePath + 'contenteditable/ajax',
      dataType: 'json',
      data: ajax_data,
      success: self.successHandler
    });
  },
  successHandler: function(data, status, xhr) {
    // Highlight the edited element and show a status message.
    var $el = $('div[data-nid="' + data['nid'] + '"][data-fieldname="' + data['fieldname'] + '"]'),
        $success = $('<div id="contenteditableSuccess" class="messages status">' + data['msg'] + '</div>').insertBefore($el);
    $el.effect('highlight', {}, 3000);
    $success.delay(1800).slideUp('slow', function() { $(this).remove(); });
  },
  hideControls: function() {
    // Move the controls back to the end of the body element.
    if (!self.controls) {
      throw new Error('Failed to hide controls: reference not found.');
    }
    var $clone = self.controls.removeAttr('style').clone(true).appendTo('body');
    self.controls.remove();
    self.controls = $clone;
  }
};

})(jQuery);
