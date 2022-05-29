import React from "react";

export default function TranslationsList() {
    return (
        <div>
            <div className="row paginator-container">
                <div className="col-sm-4 total-count"><b>Items:</b> 1</div>
                <div className="col-sm-8 text-right">
                    <nav aria-label="Page navigation">
                        <ul className="pagination">

                            <li className="disabled">
                                <span aria-hidden="true">«</span>

                            </li>

                            <li className="active">
                                <span>1</span>

                            </li>

                            <li className="disabled">
                                <span aria-hidden="true">»</span>

                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div>

                <div className="row">
                    <div className="translation-item col-xs-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <div className="row trans-item-header">
                                    <div className="col-sm-6">
                                        <h3 className="panel-title">
                                            testing
                                            <span slot="message">
                    <span className="glyphicon glyphicon-ok label label-success">
                        Save Successfull!
                    </span>
                    <span className="glyphicon glyphicon-remove label label-danger">
                        Save Error!
                    </span>
                </span>
                                        </h3>


                                    </div>
                                    <div className="col-sm-6 text-right">
                                        <div className="row">
                                            <div className="col-sm-5 text-left">
                                                <small className="text-muted">messages</small>

                                            </div>
                                            <div className="col-sm-4"><b>Autogenerated:</b> No</div>
                                            <div className="col-sm-3"><b>Active:</b> Yes</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="row">
                                            <div className="col-sm-9 col-md-10">
                                                <div className="row translation-item-value-container">
                                                    <div className="col-sm-2 col-md-1 translation-item-locale">en</div>
                                                    <div className="col-sm-10 col-md-11">
                                                        <pre className="translation-item-value">&gt;Testing</pre>

                                                    </div>
                                                </div>
                                                <div className="row translation-item-value-container">
                                                    <div className="col-sm-2 col-md-1 translation-item-locale">es</div>
                                                    <div className="col-sm-10 col-md-11">
                                                        <pre className="translation-item-value">Testing</pre>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-3 col-md-2 translation-item-actions">

                                                <button type="button" className="btn btn-info btn-xs">
                                                    <span className="glyphicon glyphicon-edit"
                                                          aria-hidden="true"> </span>
                                                    Edit
                                                </button>

                                                <button type="button" className="btn btn-primary"
                                                        >Save
                                                </button>

                                                <button type="button" className="btn btn-danger btn-sm"
                                                        >Cancel
                                                </button>

                                                <button type="button" className="btn btn-warning btn-xs"
                                                        >
                                                    <span className="glyphicon glyphicon-ban-circle"
                                                          aria-hidden="true"> </span>
                                                    Deactivate
                                                </button>

                                                <button type="button" className="btn btn-success btn-xs"
                                                        >
                                                    <span className="glyphicon glyphicon-ban-circle"
                                                          aria-hidden="true"> </span>
                                                    Activate
                                                </button>

                                                <div slot="extra-buttons">
                                                    <button type="button" className="btn btn-danger btn-xs"
                                                            >Cancel Creation
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>


        </div>
    );
}