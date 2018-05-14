(function () {
  'use strict';
  
  angular.module('core.directives')
  .directive('validation', function() {
  
    var directive = {
      restrict: 'A',
      priority: 1,
      scope: true,
      link: function(scope, elem, attrs) {
        var errors_messages = {
          required: 'Required field!',
          number: ' Only numbers!',
          email: ' Invalid email!',
          url: ' Invalid url!',
          minlength: get_ming_lenght_error(),
          maxlength: get_max_lenght_error(),
          onlyletters: 'Only letters!',
          invalid_id_card: 'Invalid DNI!',
          invalid_legal_ruc: 'Invalid Ruc!',
          invalid_password: 'Invalid password!',
          invalid_confirm_password: 'Password does not match!'
        };
        
        var element = angular.element(elem);
        element.on('remove', function() {
          var control = scope.$eval(form_name + '["' + element.attr('id') + '"]');
          control.removed = true;
        });
        
        var attribute_name = attrs.name;
        var form = angular.element(element).parents('form');
        var form_name = form.attr('name');
        var help_block = angular.element('<p id=' + attrs.id + '_error class="text-danger text-left form-element-error"></p>');
        var to_validate = element.parents('.form-group');
        
        scope.$watch(form_name + '.' + attribute_name + '.$valid', function() {
          validate_input();
        });
        
        element.on('blur', validate_input);
        
        form.on('submit', function() {
          set_dirty();
          validate_input();
        });
        
        element.on('focus', set_dirty);
        
        scope.$watch(attrs.ngModel, function(new_value, old_value) {
          if(new_value !== old_value){
            set_dirty();
            validate_input();
          }
        });
        
        function set_dirty() {
          scope.$eval(form_name + '.' + attribute_name + '.$dirty = true');
          scope.$eval(form_name + '.' + attribute_name + '.$pristine = false');
        }
        
        function validate_input() {
          var is_invalid = scope.$eval(form_name + '.' + attribute_name + '.$invalid');
          var is_dirty = scope.$eval(form_name + '.' + attribute_name + '.$dirty');
  
          if(is_invalid && is_dirty) {
  
            to_validate.addClass('has-error');
  
            element.parent().append(help_block);
  
            help_block.text(get_validation_message());
            help_block.show();
  
            return;
          }
  
          angular.element(to_validate).removeClass('has-error');
          help_block.text('');
          help_block.hide();
        }
  
        function get_validation_message() {
  
          if(attrs.validation !== '') {
            return attrs.validation;
          }
  
          var error_message = '';
          var errors = scope.$eval(form_name + '.' + attribute_name + '.$error');
          
          angular.forEach(errors, function(invalid, error) {
            if(invalid && errors_messages[error]) {
              if (error_message !== '') {
                error_message += ', ';
              }
              error_message += errors_messages[error];
            }
          });
  
          return error_message;
        }
  
        function get_ming_lenght_error() {
          var ming_length = attrs.ngMinlength;
          return 'Debe tener almenos ' + ming_length + ' caracteres!';
        }
  
        function get_max_lenght_error() {
          var ming_length = attrs.ngMaxlength;
          return 'Debe tener máximo ' + ming_length + ' caracteres!';
        }
      }
    };
  
    return directive;
  });
})();