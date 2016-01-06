var QueryString = function () {

    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();

var Application = React.createClass({
    displayName: 'Application',
    getInitialState : function(){
        return {
            imageSrc : undefined
        }
    },
    componentWillMount: function () {
        var imageSrc = (QueryString && QueryString.image) ? QueryString.image : undefined;
        this.setState({imageSrc : imageSrc});
    },
    render: function () {
        return (
            <div>
                <TopBar imageSrc={this.state.imageSrc}/>
            </div>
        )
    }
});

var TopBar = React.createClass({
    displayName: 'TopBar',
    changeImageSrc : function(e){

    },
    render: function () {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Brand</a>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li className="active"><a href="#">Link <span className="sr-only">(current)</span></a></li>
                            <li><a href="#">Link</a></li>
                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
                                   aria-haspopup="true" aria-expanded="false">Dropdown <span
                                    className="caret"></span></a>
                                <ul className="dropdown-menu">
                                    <li><a href="#">Action</a></li>
                                    <li><a href="#">Another action</a></li>
                                    <li><a href="#">Something else here</a></li>
                                    <li role="separator" className="divider"></li>
                                    <li><a href="#">Separated link</a></li>
                                    <li role="separator" className="divider"></li>
                                    <li><a href="#">One more separated link</a></li>
                                </ul>
                            </li>
                        </ul>
                        <form className="navbar-form navbar-left">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Image Url" value={this.props.imageSrc} onChange={this.changeImageSrc}/>
                            </div>
                        </form>
                    </div>
                </div>
            </nav>
        )
    }
})

var CanvasBox = React.createClass({
    displayName: 'CanvasBox',
    getInitialState: function () {
        return {
            imageSrc: undefined,
            canvasW: 640,
            canvasH: 480,
            textTop: 'TRÊN',
            textBottom: 'DƯỚI'
        };
    },
    componentWillMount: function () {
        var imageSrc = (QueryString && QueryString.image) ? QueryString.image : undefined;
        if (imageSrc) {
            this.setState({imageSrc: imageSrc});
        }
    },
    componentDidMount: function () {
        var canvas = ReactDOM.findDOMNode(this.refs.canvasBox);
        this.stage = new createjs.Stage(canvas);
        /*        createjs.Ticker.setFPS(15);
         createjs.Ticker.addEventListener("tick", this.stage);*/
        var imageSrc = this.state.imageSrc;
        var img = new Image();
        var self = this;
        img.onload = function () {

            self.canvas_image = new createjs.Bitmap(this.src);

            var src_w = this.width;
            var src_h = this.height;

            var new_w = self.state.canvasW;
            var new_h = self.state.canvasH;

            var info = calculateSizeOfImage(new_w, new_h, src_w, src_h);


            self.canvas_image.scaleX = info.scale_W;
            self.canvas_image.scaleY = info.scale_W;
            self.setState({canvasW: info.canvas_W, canvasH: info.canvas_H});

            self.stage.addChild(self.canvas_image);

            self.canvas_textTop = new createjs.Text(self.state.textTop);
            self.canvas_textTop.font = '20px Lobster';
            self.canvas_textTop.color = "#ffffff";
            self.canvas_textTop.textBaseline = "alphabetic";
            self.canvas_textTop.x = self.canvas_textTop.y = 100;

            self.canvas_textTop.on('pressmove', function (evt) {
                evt.target.x = evt.stageX;
                evt.target.y = evt.stageY;
            })

            self.stage.addChild(self.canvas_textTop);

            /*self.canvas_textBottom = new createjs.Text(self.state.textBottom, "20px Arial");
             self.canvas_textBottom.x = self.canvas_textBottom.y = 100;
             self.canvas_textBottom.textBaseline = "alphabetic";
             self.stage.addChild(self.canvas_textBottom);*/

            self.stage.update();
        }
        img.src = imageSrc;
    },
    componentDidUpdate: function () {
        if (this.stage) {
            this.stage.update();
            //console.info('text top : ', this.canvas_textTop.text);
        }
    },
    canvasImageChange: function (e) {
        this.setState({imageSrc: e.target.value});
    },
    canvasWidthChange: function (e) {
        this.setState({canvasW: e.target.value});
    },
    canvasHeightChange: function (e) {
        this.setState({canvasH: e.target.value});
    },
    canvasTextTopChange: function (e) {
        this.setState({textTop: e.target.value});
        this.canvas_textTop.text = e.target.value;
    },
    canvasTextBottomChange: function (e) {
        this.setState({textBottom: e.target.value});
        this.canvas_textBottom.text = e.target.value;
    },
    render: function () {


        return (
            <div>
                <p>
                    <input type="text" value={this.state.imageSrc} onChange={this.canvasImageChange}/> &nbsp;
                    W : <input type="number" value={this.state.canvasW} onChange={this.canvasWidthChange}/> &nbsp;
                    H : <input type="number" value={this.state.canvasH} onChange={this.canvasHeightChange}/>
                </p>

                <p>
                    Top : <input type="text" value={this.state.textTop} onChange={this.canvasTextTopChange}/> &nbsp;
                    Bottom : <input type="text" value={this.state.textBottom} onChange={this.canvasTextBottomChange}/>
                </p>
                <canvas ref="canvasBox" width={this.state.canvasW} height={this.state.canvasH}></canvas>
            </div>
        )
    }
});

ReactDOM.render(
    <Application/>,
    document.getElementById('container')
)

function calculateSizeOfImage(canvas_W, canvas_H, image_W, image_H) {
    if (canvas_W > image_W) {
        canvas_W = image_W;
        canvas_H = image_H;
    }
    var scale_W = canvas_W / image_W;
    var scale_H = canvas_H / image_H;
    return {
        canvas_W: image_W * scale_W,
        canvas_H: image_H * scale_W,
        scale_W: scale_W,
        scale_H: scale_H
    }
}