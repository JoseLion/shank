define(
  [
      'react',
      'react-dom',
      'jquery',
      '../../../widgets.src'
  ],
  function (React, ReactDOM, $, reactjsAdminlte) {

      var clientCalls = reactjsAdminlte.clientCalls;

      var LoginPage = React.createClass({
          getInitialState: function() {
              return {
              
              }
          },
          componentDidMount: function() {

              this.setState({
                
              });
          },
          render: function() {
              return (
                    <div className="login-box">
                      <div className="login-logo">
                        <a href="/login"><b>Shank</b>Login</a>
                      </div>
                    
                      <div className="login-box-body">
                        <p className="login-box-msg">Sign in to start your session</p>
                    
                        <form action="/login" method="post">
                          <div className="form-group has-feedback">
                            <input type="email" className="form-control" placeholder="Email" name='email'/>
                            <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                          </div>
                          <div className="form-group has-feedback">
                            <input type="password" className="form-control" placeholder="Password" name='password'/>
                            <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                          </div>
                          <div className="row">
                            <div className="col-xs-8">
                              <div className="checkbox icheck">
                                <label>
                                  <input type="checkbox"/> Remember Me
                                </label>
                              </div>
                            </div>
                            <div className="col-xs-4">
                              <button type="submit" className="btn btn-primary btn-block btn-flat">Sign In</button>
                            </div>
                          </div>
                        </form>   
                      </div>
                  </div>
              )
          }
      });

      ReactDOM.render(<LoginPage />,  document.getElementById('login-container'));

      //commonFunctions.initialize().bootstrapTooltips("[data-toggle='tooltip']");
  }
)
