/**
 * Created by nxcong on 05/01/2016.
 */
var QueryString = function () {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
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
var stage = undefined;
var canvas_image = undefined;
var canvas_textTop = undefined;
var canvas_textBottom = undefined;
var CanvasBox = React.createClass({
    displayName: 'CanvasBox',
    getInitialState: function () {
        return {
            imageSrc: undefined,
            canvasW: 640,
            canvasH: 480,
            textTop : 'TOP',
            textBottom : 'BOTTOM'
        };
    },
    componentWillMount: function () {
        var imageSrc = (QueryString && QueryString.image) ? QueryString.image : undefined;
        if (imageSrc) {
            this.setState({imageSrc: imageSrc});
        }
    },
    componentDidMount: function () {
        this.stage = new createjs.Stage("canvasBox");

        var imageSrc = this.state.imageSrc;
        var img = new Image();
        var self = this;
        img.onload = function () {
            canvas_image = new createjs.Bitmap(this.src);
            canvas_image.scaleX = 1;
            self.stage.addChild(canvas_image);
            canvas_textTop = new createjs.Text(self.state.textTop,"20px Arial");
            canvas_textTop.x = canvas_textTop.y = 100;
            canvas_textTop.textBaseline = "alphabetic";
            self.stage.addChild(canvas_textTop);
            self.stage.update();
        }
        img.src = imageSrc;
    },
    componentDidUpdate: function () {
        /*if (this.stage) {
            this.stage.update();
        }*/
    },
    canvasImageChange: function (e) {
        this.setState({imageSrc : e.target.value});
    },
    canvasWidthChange : function(e){
        this.setState({canvasW : e.target.value});
    },
    canvasHeightChange : function(e){
        this.setState({canvasH : e.target.value});
    },
    canvasTextTopChange : function(e){
        this.setState({textTop : e.target.value});
        canvas_textTop.text = this.state.textTop;
        this.stage.update();
        //stage.update();
    },
    canvasTextBottomChange : function(e){
        this.setState({textBottom : e.target.value});
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
                <canvas id="canvasBox" width={this.state.canvasW} height={this.state.canvasH}></canvas>
            </div>
        )
    }
});

ReactDOM.render(
    <CanvasBox/>,
    document.getElementById('container')
)

/*
 var App = blocks.Application();
 var stage = undefined;

 var Meme = App.Model({
 imageSrc : blocks.observable(),
 canvasW : blocks.observable(),
 canvasH : blocks.observable(),
 });

 App.View('Home', {
 // options object contains all properties that define the View behavior
 options: {
 // enabling the View routing and setting it to the root page
 // for a www.example.com the root is the same www.example.com
 route: '/'
 },
 meme : Meme({
 canvasW : 640,
 canvasH : 480,
 imageSrc : undefined
 }),
 init : function(){

 },
 ready : function(){
 stage = new createjs.Stage("demoCanvas");
 },
 routed: function () {
 var ImageUrl = (QueryString && QueryString.image) ? QueryString.image : undefined;
 if(ImageUrl){
 this.meme.imageSrc = ImageUrl;
 var img = new Image();
 img.onload = function(){
 var bitmap = new createjs.Bitmap(this.src);
 bitmap.scaleX = bitmap.scaleY = 1.0;
 stage.addChild(bitmap);
 stage.update();
 }
 img.src = this.meme.imageSrc;
 }
 }
 });*/