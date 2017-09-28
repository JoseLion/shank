'use strict';

import React, { Component } from 'react';

import {
  Platform,
  Alert,
  AlertIOS,
} from 'react-native';

const currentAlert = Platform.OS == 'android' ? Alert : AlertIOS;

let Notifier = {
  error: function(message) {
    currentAlert.alert(
      'Error',
      message,
      [
        {
          text:'ACEPTAR',
          onPress: () => console.log('Tapped OK'),
        }
      ]
    );
  },
  alert: function(message) {
    currentAlert.alert(
      'Alerta',
      message,
      [
        {
          text:'ACEPTAR',
          onPress: () => console.log('Tapped OK'),
        }
      ]
    );
  },
  message: function(message) {
    currentAlert.alert(
      message.title,
      message.message,
      [
        {
          text:'ACEPTAR',
          onPress: () => console.log('Tapped OK'),
        }
      ]
    );
  },
  withoutConnection: function() {
    currentAlert.alert(
      'SIN INTERNET',
      'No fue posible acceder al internet de su teléfono.',
      [
        {
          text:'ACEPTAR',
          onPress: () => console.log('Tapped OK'),
        }
      ]
    );
  },
  requestServerError: function() {
    currentAlert.alert(
      'ERROR',
      'No fue posible comunicar con el servidor.',
      [
        {
          text:'ACEPTAR',
          onPress: () => console.log('Tapped OK'),
        }
      ]
    );
  },
  requestServerParsingResponse: function() {
    currentAlert.alert(
      'ERROR',
      'Error al analizar la respuesta del servidor.',
      [
        {
          text:'ACEPTAR',
          onPress: () => console.log('Tapped OK'),
        }
      ]
    );
  }
};

export { Notifier as default };