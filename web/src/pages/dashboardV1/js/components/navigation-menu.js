define(
    [
        'react',
        'jquery',
    ],
    function (React, $) {
        var NavigationMenu = React.createClass({
            render: function () {
                var style = {
                    display: "block"
                };

                return (
                    <aside className="main-sidebar">
                        {/* sidebar: style can be found in sidebar.less */}
                        <section className="sidebar" >
                            {/* Sidebar user panel */}
                            <div className="user-panel">
                                <div className="pull-left image">
                                    <img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User Image" />
                                </div>
                                <div className="pull-left info">
                                    <p>Alexander Pierce</p>
                                    <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                                </div>
                            </div>
                            {/* search form */}
                            <form action="#" method="get" className="sidebar-form">
                                <div className="input-group">
                                    <input type="text" name="q" className="form-control" placeholder="Search..." />
                                    <span className="input-group-btn">
                                    <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search"></i></button>
                                  </span>
                                </div>
                            </form>
                            {/* /.search form */}
                            {/* sidebar menu: : style can be found in sidebar.less */}
                            <ul className="sidebar-menu">
                                <li className="header">MAIN NAVIGATION</li>
                                <li className="active treeview">
                                    <a href="#">
                                        <i className="fa fa-dashboard"></i> 
                                        <span>
                                            Dashboard
                                        </span> 
                                        <i className="fa fa-angle-left pull-right"></i>
                                    </a>
                                </li>
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-files-o"></i>
                                        <span>User Catalog</span>
                                        <span className="label label-primary pull-right">4</span>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="#"><i className="fa fa-circle-o"></i> User Listing</a></li>
                                      </ul>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fa fa-th"></i>
                                        <span>Reports</span> 
                                        <small className="label pull-right bg-green">new</small>
                                    </a>
                                </li>
                            </ul>
                        </section>
                        {/* /.sidebar */}
                    </aside>
                )
            }
        });

        return NavigationMenu
    }
)