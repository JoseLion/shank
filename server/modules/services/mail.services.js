exports.send_recover_password_admin_user = (app, body, callback) => {
  app.mailer.send('recovery_password_admin_user', {
    to: body.to,
    subject: 'Contraseña',
    body: body
  }, callback);
};