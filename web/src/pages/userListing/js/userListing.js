/**
 * Created by MnMistake on 10/30/2017.
 */
define(
    [
        'react',
        'react-dom',
        'jquery',
        '../../../widgets.src',
        '../../../services/utils/constants',
        '../../dashboardV1/js/components/header-bar/header-bar',
        '../../dashboardV1/js/components/navigation-menu',
    ],
    function (React, ReactDOM, $, reactjsAdminlte, Constants, HeaderBar, NavigationMenu) {

        //let clientCalls = reactjsAdminlte.clientCalls;

        let UserListingPage = React.createClass({
            getInitialState: function () {
                return {loading: true}
            },
            componentDidMount: function () {
                let options = {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                };
                this.setState({
                    loading: true
                });
                fetch(Constants.ApiHost + 'allUsers', options).then((response) => {
                    response.json().then((jsonResponse) => {
                        console.log("asdasdasdasdasds")
                        console.log(jsonResponse.response)
                        this.setState({
                            userList: jsonResponse.response,
                            loading: false
                        });
                    }).catch(
                        error => {
                            console.log(error)
                            this.setState({
                                userList: {},
                                loading: false
                            });
                            throw Constants.parsingResponseError;
                        }
                    );
                }).catch(
                    error => {
                        console.log(error)
                        this.setState({
                            userList: {},
                            loading: false
                        });
                        throw Constants.requestServerError;
                    }
                );
            },
            render: function () {
                if (!this.state.loading) {
                    let userList = this.state.userList.map(function (data, iterator) {
                        return (
                            <tr role="row" className="odd">
                                <td className="sorting_1">{data.name}</td>
                                <td>{data.email}</td>
                                <td>{data.enabled}</td>
                                <td>{data.type}</td>
                            </tr>
                        )
                    });
                    console.log("this.state.userListthis.state.userListthis.state.userList")
                    console.log(this.state.userList)

                    return (
                        <div className="wrapper">
                            <HeaderBar />

                            <NavigationMenu />

                            <div className="content-wrapper">
                                <section className="content-header">
                                    <h1>
                                        List
                                        <small>User Listing</small>
                                    </h1>
                                    {/*<ol className="breadcrumb">
                                     <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
                                     <li className="active">Dashboard</li>
                                     </ol>*/}
                                </section>
                                <section className="content">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="box">
                                                <div className="box-header">
                                                    <h3 className="box-title">Shank Users</h3>
                                                </div>
                                                <div className="box-body">
                                                    <div id="example2_wrapper"
                                                         className="dataTables_wrapper form-inline dt-bootstrap">
                                                        <div className="row">
                                                            <div className="col-sm-6"></div>
                                                            <div className="col-sm-6"></div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-12">
                                                                <table id="example2"
                                                                       className="table table-bordered table-hover dataTable"
                                                                       role="grid"
                                                                       aria-describedby="example2_info">
                                                                    <thead>
                                                                    <tr role="row">
                                                                        <th className="sorting_asc" tabIndex="0"
                                                                            aria-controls="example2" rowSpan="1"
                                                                            colSpan="1" aria-sort="ascending"
                                                                            aria-label="Name">
                                                                            Rendering
                                                                            engine
                                                                        </th>
                                                                        <th className="sorting" tabIndex="0"
                                                                            aria-controls="example2" rowSpan="1"
                                                                            colSpan="1"
                                                                            aria-label="email">
                                                                            Browser
                                                                        </th>
                                                                        <th className="sorting" tabIndex="0"
                                                                            aria-controls="example2" rowSpan="1"
                                                                            colSpan="1"
                                                                            aria-label="">
                                                                            Platform(s)
                                                                        </th>
                                                                        <th className="sorting" tabIndex="0"
                                                                            aria-controls="example2" rowSpan="1"
                                                                            colSpan="1"
                                                                            aria-label="type">
                                                                            Engine version
                                                                        </th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {userList}
                                                                    </tbody>
                                                                    <tfoot>
                                                                    <tr>
                                                                        <th rowSpan="1" colSpan="1">footer example
                                                                        </th>
                                                                    </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-5">
                                                                <div className="dataTables_info" id="example2_info"
                                                                     role="status"
                                                                     aria-live="polite">
                                                                    Showing
                                                                    1 to 10 of 57 entries
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-7">
                                                                <div
                                                                    className="dataTables_paginate paging_simple_numbers"
                                                                    id="example2_paginate">
                                                                    <ul className="pagination">
                                                                        <li className="paginate_button previous disabled"
                                                                            id="example2_previous"><a
                                                                            href="#"
                                                                            aria-controls="example2"
                                                                            data-dt-idx="0"
                                                                            tabIndex="0">Previous</a>
                                                                        </li>
                                                                        <li className="paginate_button active"><a
                                                                            href="#"
                                                                            aria-controls="example2"
                                                                            data-dt-idx="1"
                                                                            tabIndex="0">1</a>
                                                                        </li>
                                                                        <li className="paginate_button "><a href="#"
                                                                                                            aria-controls="example2"
                                                                                                            data-dt-idx="2"
                                                                                                            tabIndex="0">2</a>
                                                                        </li>
                                                                        <li className="paginate_button "><a href="#"
                                                                                                            aria-controls="example2"
                                                                                                            data-dt-idx="3"
                                                                                                            tabIndex="0">3</a>
                                                                        </li>
                                                                        <li className="paginate_button "><a href="#"
                                                                                                            aria-controls="example2"
                                                                                                            data-dt-idx="4"
                                                                                                            tabIndex="0">4</a>
                                                                        </li>
                                                                        <li className="paginate_button "><a href="#"
                                                                                                            aria-controls="example2"
                                                                                                            data-dt-idx="5"
                                                                                                            tabIndex="0">5</a>
                                                                        </li>
                                                                        <li className="paginate_button "><a href="#"
                                                                                                            aria-controls="example2"
                                                                                                            data-dt-idx="6"
                                                                                                            tabIndex="0">6</a>
                                                                        </li>
                                                                        <li className="paginate_button next"
                                                                            id="example2_next"><a
                                                                            href="#"
                                                                            aria-controls="example2"
                                                                            data-dt-idx="7"
                                                                            tabIndex="0">Next</a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </section>
                            </div>

                            <footer className="main-footer">
                                <div className="pull-right hidden-xs">
                                    <b>Version</b> 1.0.0
                                </div>
                                <strong>This project is a derivative of <a href="http://almsaeedstudio.com">Almsaeed
                                    Studio</a>.</strong>
                            </footer>

                        </div>
                    )
                } else {
                    return <h2>Loading...</h2>;
                }
            }
        });

        ReactDOM.render(<UserListingPage />, document.getElementById('user-list-container'));

        //commonFunctions.initialize().bootstrapTooltips("[data-toggle='tooltip']");
    }
)