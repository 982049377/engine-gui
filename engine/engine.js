var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var engine;
(function (engine) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    engine.Point = Point;
    var Rectangle = (function () {
        function Rectangle() {
            this.x = 0;
            this.y = 0;
            this.width = 1;
            this.height = 1;
        }
        Rectangle.prototype.isPointInRectangle = function (point) {
            var rect = this;
            if (point.x < rect.width + rect.x &&
                point.y < rect.height + rect.y &&
                point.x > rect.x &&
                point.y > rect.y) {
                return true;
            }
            else {
                return false;
            }
        };
        return Rectangle;
    }());
    engine.Rectangle = Rectangle;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    engine.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }
        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;
    }
    engine.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    engine.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;
            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        return Matrix;
    }());
    engine.Matrix = Matrix;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var Ticker = (function () {
        function Ticker() {
            this.listeners = [];
        }
        Ticker.getInstance = function () {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        };
        Ticker.prototype.register = function (listener) {
            var x = this.listeners.indexOf(listener);
            if (x < 0) {
                this.listeners.push(listener);
            }
            else {
                console.log("already listen");
            }
        };
        Ticker.prototype.unregister = function (listener) {
            var x = this.listeners.indexOf(listener);
            if (x >= 0) {
                this.listeners.splice(x, 1);
            }
            else {
                console.log("no listener");
            }
        };
        Ticker.prototype.notify = function (deltaTime) {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(deltaTime);
            }
        };
        return Ticker;
    }());
    engine.Ticker = Ticker;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var res;
    (function (res) {
        //图片数据缓存
        var cache = {};
        //图片json
        var imgJson = {};
        //imageResourse索引
        var imgResIndex = {};
        //读取外部json数据并存入指定json
        function loadConfig(url, callback) {
            var processor = createProcessor("text");
            if (processor != null) {
                processor.load(url, function (data, type) {
                    if (type.match("text")) {
                        var dataObj = JSON.parse(data);
                        imgJson = dataObj;
                        callback();
                    }
                });
            }
        }
        res.loadConfig = loadConfig;
        //从图片json中读取图片部分信息,并进行索引设置
        function getRes(url) {
            if (imgResIndex[url] == null) {
                imgResIndex[url] = new ImageResource(url, imgJson[url].width, imgJson[url].height);
            }
            return imgResIndex[url];
        }
        res.getRes = getRes;
        var ImageResource = (function () {
            function ImageResource(url, width, height) {
                this.url = url;
                this.width = width;
                this.height = height;
                this.Loading = false;
            }
            return ImageResource;
        }());
        res.ImageResource = ImageResource;
        var ImageProcessor = (function () {
            function ImageProcessor() {
            }
            ImageProcessor.prototype.load = function (url, callback) {
                var image = document.createElement("img");
                image.src = url;
                image.onload = function () {
                    // cache[url]=image;
                    callback(image, "bitmap");
                };
            };
            return ImageProcessor;
        }());
        res.ImageProcessor = ImageProcessor;
        var TextProcessor = (function () {
            function TextProcessor() {
            }
            TextProcessor.prototype.load = function (url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.send();
                xhr.onload = function () {
                    callback(xhr.responseText, "text");
                };
            };
            return TextProcessor;
        }());
        res.TextProcessor = TextProcessor;
        //自定义文件类型判断
        function mapTypeSelector(typeSelector) {
            getTypeByURL = typeSelector;
        }
        res.mapTypeSelector = mapTypeSelector;
        //根据路径判断文件类型，从外部文件读取元数据，并存入缓存cache
        function load(imageRes, callback) {
            var type = getTypeByURL(imageRes.url);
            var processor = createProcessor(type);
            if (processor != null) {
                imageRes.Loading = true;
                processor.load(imageRes.url, function (data, type) {
                    imgResIndex[imageRes.url].bitmapData = data;
                    callback(data, type);
                });
            }
        }
        res.load = load;
        function get(url) {
            return imgResIndex[url].bitmapData;
        }
        res.get = get;
        var getTypeByURL = function (url) {
            if (url.indexOf(".jpg") >= 0) {
                return "image";
            }
            else if (url.indexOf(".mp3") >= 0) {
                return "sound";
            }
            else if (url.indexOf(".json") >= 0) {
                return "text";
            }
        };
        var hashMap = {
            "image": new ImageProcessor(),
            "text": new TextProcessor()
        };
        function createProcessor(type) {
            var processor = hashMap[type];
            return processor;
        }
        //自定义文件类型
        function map(type, processor) {
            hashMap[type] = processor;
        }
        res.map = map;
    })(res = engine.res || (engine.res = {}));
})(engine || (engine = {}));
var engine;
(function (engine) {
    var EventManager = (function () {
        function EventManager() {
        }
        EventManager.getInstance = function () {
            if (EventManager.eventManager == null) {
                EventManager.eventManager = new EventManager();
                EventManager.eventManager.targetArray = new Array();
                return EventManager.eventManager;
            }
            else {
                return EventManager.eventManager;
            }
        };
        return EventManager;
    }());
    engine.EventManager = EventManager;
    var MyEvent = (function () {
        function MyEvent(eventType, func, target, ifCapture) {
            this.eventType = "";
            this.ifCapture = false;
            this.eventType = eventType;
            this.ifCapture = ifCapture;
            this.func = func;
            this.target = target;
        }
        return MyEvent;
    }());
    engine.MyEvent = MyEvent;
    var DisplayObject = (function () {
        function DisplayObject(type) {
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.alpha = 1;
            this.globalAlpha = 1;
            this.localMatrix = new engine.Matrix();
            this.globalMatrix = new engine.Matrix();
            this.eventArray = new Array();
            this.type = type;
        }
        DisplayObject.prototype.update = function () {
            this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalMatrix = engine.matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
            }
            else {
                this.globalMatrix = this.localMatrix;
            }
            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.alpha;
            }
            else {
                this.globalAlpha = this.alpha;
            }
        };
        DisplayObject.prototype.addEventListener = function (eventType, func, target, ifCapture) {
            //if this.eventArray doesn't contain e
            var e = new MyEvent(eventType, func, target, ifCapture);
            this.eventArray.push(e);
        };
        return DisplayObject;
    }());
    engine.DisplayObject = DisplayObject;
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap() {
            return _super.call(this, "Bitmap") || this;
        }
        Bitmap.prototype.hitTest = function (x, y) {
            if (this.texture) {
                if (this.texture.bitmapData) {
                    var rect = new engine.Rectangle();
                    rect.x = rect.y = 0;
                    rect.width = this.texture.bitmapData.width;
                    rect.height = this.texture.bitmapData.height;
                    if (rect.isPointInRectangle(new engine.Point(x, y))) {
                        var eventManager = EventManager.getInstance();
                        eventManager.targetArray.push(this);
                        return this;
                    }
                    else {
                        return null;
                    }
                }
            }
        };
        return Bitmap;
    }(DisplayObject));
    engine.Bitmap = Bitmap;
    var fonts = {
        "name": "Arial",
        "font": {
            "A": [0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
            "B": []
        }
    };
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super.call(this, "TextField") || this;
            _this.text = "";
            _this._measureTextWidth = 0;
            return _this;
        }
        TextField.prototype.hitTest = function (x, y) {
            var rect = new engine.Rectangle();
            rect.width = this._measureTextWidth;
            rect.height = 20;
            var point = new engine.Point(x, y);
            if (rect.isPointInRectangle(point)) {
                var eventManager = EventManager.getInstance();
                eventManager.targetArray.push(this);
                return this;
            }
            else {
                return null;
            }
        };
        return TextField;
    }(DisplayObject));
    engine.TextField = TextField;
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            var _this = _super.call(this, "DisplayObjectContainer") || this;
            _this.children = [];
            return _this;
        }
        DisplayObjectContainer.prototype.update = function () {
            _super.prototype.update.call(this);
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var displayobject = _a[_i];
                displayobject.update();
            }
        };
        DisplayObjectContainer.prototype.addChild = function (child) {
            var x = this.children.indexOf(child);
            if (x < 0) {
                this.children.push(child);
                child.parent = this;
            }
            else {
                //如需遮罩，则需在此处将已有子物体移至第一位
            }
        };
        DisplayObjectContainer.prototype.removeChild = function (child) {
            var x = this.children.indexOf(child);
            if (x >= 0) {
                this.children.splice(x, 1);
            }
        };
        DisplayObjectContainer.prototype.hitTest = function (x, y) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var child = this.children[i];
                var point = new engine.Point(x, y);
                var invertChildLocalMatrix = engine.invertMatrix(child.localMatrix);
                var pointBaseOnChild = engine.pointAppendMatrix(point, invertChildLocalMatrix);
                var hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                if (hitTestResult) {
                    var eventManager = EventManager.getInstance();
                    eventManager.targetArray.push(this);
                    return hitTestResult;
                }
            }
            return null;
        };
        return DisplayObjectContainer;
    }(DisplayObject));
    engine.DisplayObjectContainer = DisplayObjectContainer;
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(data) {
            var _this = _super.call(this) || this;
            _this.advancedTime = 0;
            _this.ticker = function (deltaTime) {
                // this.removeChild();
                _this.advancedTime += deltaTime;
                if (_this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                    _this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
                }
                _this.currentFrameIndex = Math.floor(_this.advancedTime / MovieClip.FRAME_TIME);
                var data = _this.data;
                var frameData = data.frames[_this.currentFrameIndex];
                var url = frameData.image;
            };
            _this.setMovieClipData(data);
            _this.play();
            return _this;
        }
        MovieClip.prototype.play = function () {
            engine.Ticker.getInstance().register(this.ticker);
        };
        MovieClip.prototype.stop = function () {
            engine.Ticker.getInstance().unregister(this.ticker);
        };
        MovieClip.prototype.setMovieClipData = function (data) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 
        };
        return MovieClip;
    }(Bitmap));
    MovieClip.FRAME_TIME = 20;
    MovieClip.TOTAL_FRAME = 10;
})(engine || (engine = {}));
var engine;
(function (engine) {
    engine.run = function (canvas) {
        var stage = new engine.DisplayObjectContainer();
        var context2D = canvas.getContext("2d");
        var render = new CanvasRenderer(stage, context2D);
        var lastNow = Date.now();
        var frameHandler = function () {
            var now = Date.now();
            var deltaTime = now - lastNow;
            engine.Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.update();
            render.render();
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        };
        window.requestAnimationFrame(frameHandler);
        var hitResult;
        var currentX;
        var currentY;
        var lastX;
        var lastY;
        var isMouseDown = false;
        window.onmousedown = function (e) {
            isMouseDown = true;
            var targetArray = engine.EventManager.getInstance().targetArray;
            targetArray.splice(0, targetArray.length);
            hitResult = stage.hitTest(e.offsetX, e.offsetY);
            currentX = e.offsetX;
            currentY = e.offsetY;
        };
        window.onmousemove = function (e) {
            var targetArray = engine.EventManager.getInstance().targetArray;
            lastX = currentX;
            lastY = currentY;
            currentX = e.offsetX;
            currentY = e.offsetY;
            if (isMouseDown) {
                for (var i = 0; i < targetArray.length; i++) {
                    for (var _i = 0, _a = targetArray[i].eventArray; _i < _a.length; _i++) {
                        var x = _a[_i];
                        if (x.eventType.match("onmousemove") &&
                            x.ifCapture == true) {
                            x.func(e);
                        }
                    }
                }
                for (var i = targetArray.length - 1; i >= 0; i--) {
                    for (var _b = 0, _c = targetArray[i].eventArray; _b < _c.length; _b++) {
                        var x = _c[_b];
                        if (x.eventType.match("onmousemove") &&
                            x.ifCapture == false) {
                            x.func(e);
                        }
                    }
                }
            }
        };
        window.onmouseup = function (e) {
            isMouseDown = false;
            var targetArray = engine.EventManager.getInstance().targetArray;
            targetArray.splice(0, targetArray.length);
            var newHitRusult = stage.hitTest(e.offsetX, e.offsetY);
            for (var i = 0; i < targetArray.length; i++) {
                for (var _i = 0, _a = targetArray[i].eventArray; _i < _a.length; _i++) {
                    var x = _a[_i];
                    if (x.eventType.match("onclick") &&
                        newHitRusult == hitResult &&
                        x.ifCapture == true) {
                        x.func(e);
                    }
                }
            }
            for (var i = targetArray.length - 1; i >= 0; i--) {
                for (var _b = 0, _c = targetArray[i].eventArray; _b < _c.length; _b++) {
                    var x = _c[_b];
                    if (x.eventType.match("onclick") &&
                        newHitRusult == hitResult &&
                        x.ifCapture == false) {
                        x.func(e);
                    }
                }
            }
        };
        return stage;
    };
    var CanvasRenderer = (function () {
        function CanvasRenderer(stage, context2D) {
            this.stage = stage;
            this.context2D = context2D;
        }
        CanvasRenderer.prototype.render = function () {
            var stage = this.stage;
            var context2D = this.context2D;
            this.renderContainer(stage);
        };
        CanvasRenderer.prototype.renderContainer = function (container) {
            for (var _i = 0, _a = container.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                var m = child.globalMatrix;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                if (child.type == "Bitmap") {
                    this.renderBitmap(child);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child);
                }
            }
        };
        //在渲染时读取图片缓存的数据
        CanvasRenderer.prototype.renderBitmap = function (bitmap) {
            // let result = engine.res.get(bitmap.texture.url);
            // console.log(result);
            if (bitmap.texture.bitmapData) {
                // this.context2D.drawImage(result, 0, 0);
                this.context2D.drawImage(bitmap.texture.bitmapData, 0, 0);
            }
            else {
                // if (bitmap.texture.Loading == false) {
                //     engine.res.load(bitmap.texture, (data, type) => {
                //         if (type.match("bitmap")) {
                //             bitmap.texture.Loading = false;
                //         }
                //     });
                // }
                console.log("!");
                var img_1 = new Image();
                img_1.src = bitmap.texture.url;
                img_1.onload = function () {
                    bitmap.texture.bitmapData = img_1;
                };
            }
        };
        CanvasRenderer.prototype.renderTextField = function (textField) {
            this.context2D.fillText(textField.text, 0, 10);
            textField._measureTextWidth = this.context2D.measureText(textField.text).width;
        };
        return CanvasRenderer;
    }());
})(engine || (engine = {}));
