var egret = window.egret;var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ControllerPad = (function (_super) {
    __extends(ControllerPad, _super);
    function ControllerPad() {
        var _this = _super.call(this) || this;
        _this.dirs = new Array(4);
        _this.init();
        return _this;
    }
    ControllerPad.prototype.init = function () {
        var _this = this;
        //0:top,1:bottom,2:left,3:right
        var top = new egret.Bitmap(RES.getRes("controller_png"));
        var bottom = new egret.Bitmap(RES.getRes("controller_png"));
        var left = new egret.Bitmap(RES.getRes("controller_png"));
        var right = new egret.Bitmap(RES.getRes("controller_png"));
        var _loop_1 = function (i) {
            this_1.dirs[i] = new egret.Bitmap(RES.getRes("controller_png"));
            this_1.dirs[i].touchEnabled = true;
            this_1.dirs[i].alpha = 0.5;
            this_1.dirs[i].anchorOffsetX = this_1.dirs[i].width / 2;
            this_1.dirs[i].anchorOffsetY = this_1.dirs[i].height / 2;
            this_1.dirs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.tapPad(i); }, this_1);
            this_1.addChild(this_1.dirs[i]);
        };
        var this_1 = this;
        for (var i = 0; i < this.dirs.length; i++) {
            _loop_1(i);
        }
        this.dirs[0].rotation = -90;
        this.dirs[1].rotation = 90;
        this.dirs[2].rotation = 180;
        var cx = 0;
        var cy = 0;
        this.dirs[0].x = cx;
        this.dirs[0].y = cy;
        this.dirs[1].x = cx;
        this.dirs[1].y = cy + 256;
        this.dirs[2].x = cx - 128;
        this.dirs[2].y = cy + 128;
        this.dirs[3].x = cx + 128;
        this.dirs[3].y = cy + 128;
    };
    ControllerPad.prototype.tapPad = function (dir) {
        var padtapEvent = new PadtapEvent(PadtapEvent.PADTAP);
        padtapEvent.dir = dir;
        this.dispatchEvent(padtapEvent);
    };
    return ControllerPad;
}(egret.DisplayObjectContainer));
__reflect(ControllerPad.prototype, "ControllerPad");
var Dungeon = (function (_super) {
    __extends(Dungeon, _super);
    function Dungeon() {
        var _this = _super.call(this) || this;
        _this.SIZE = 9;
        _this.SUCCESS_NUMBER = 30;
        _this.map = new Array();
        _this.playerPos = new egret.Point();
        _this.dirs = new Array(4);
        _this.successNumber = _this.SUCCESS_NUMBER;
        _this.level = 1;
        _this.isReseting = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Dungeon.prototype.onAddToStage = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var tile = new egret.Bitmap(RES.getRes("tile_png"));
        this.originX = stageW / 2 - Math.floor(this.SIZE / 2) * tile.width;
        this.originY = 200;
        this.drawBg();
        this.drawMap();
        this.addPlayer();
        this.addTimer();
    };
    Dungeon.prototype.drawBg = function () {
        var tile = new egret.Bitmap(RES.getRes("tile_png"));
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x000000, 0.90);
        bg.graphics.drawRect(this.originX - tile.width / 2, this.originY - tile.height / 2, tile.width * this.SIZE, tile.width * this.SIZE);
        bg.graphics.endFill();
        this.addChild(bg);
        var shadow = new egret.Bitmap(RES.getRes("shadow_png"));
        shadow.x = this.originX - tile.width / 2;
        shadow.y = this.originY - tile.height / 2;
        shadow.width = tile.width * this.SIZE;
        shadow.height = tile.width * this.SIZE;
        shadow.alpha = 0.9;
        this.addChild(shadow);
    };
    Dungeon.prototype.drawMap = function () {
        this.randomArr = new Array();
        this.map = new Array();
        for (var i = 0; i < this.SIZE; i++) {
            this.map[i] = new Array(i);
            for (var j = 0; j < this.SIZE; j++) {
                var t = new egret.Bitmap(RES.getRes("tile_png"));
                t.anchorOffsetX = t.width / 2;
                t.anchorOffsetY = t.height / 2;
                t.scaleX = 1;
                t.scaleY = 1;
                t.x = this.originX + i * t.width;
                t.y = this.originY + j * t.height;
                this.map[i][j] = t;
                this.addChild(this.map[i][j]);
                this.randomArr[i * this.SIZE + j] = new egret.Point(i, j);
            }
        }
    };
    Dungeon.prototype.resetGame = function (level) {
        this.level = level;
        if (level == 1) {
            this.successNumber = this.SUCCESS_NUMBER;
        }
        else {
            this.successNumber -= 1;
        }
        if (this.successNumber < 5) {
            this.successNumber = 5;
        }
        for (var i = 0; i < this.SIZE; i++) {
            for (var j = 0; j < this.SIZE; j++) {
                var t = this.map[i][j];
                t.scaleX = 1;
                t.scaleY = 1;
                t.alpha = 1;
                t.visible = true;
                t.x = this.originX + i * t.width;
                t.y = this.originY + j * t.height;
                egret.Tween.removeTweens(t);
                this.randomArr[i * this.SIZE + j] = new egret.Point(i, j);
            }
        }
        var index = Math.floor(this.SIZE / 2);
        this.player.resetPlayer();
        this.playerPos.x = index;
        this.playerPos.y = index;
        this.player.x = this.map[this.playerPos.x][this.playerPos.y].x;
        this.player.y = this.map[this.playerPos.x][this.playerPos.y].y;
        var delay = 300 - level * 10;
        if (delay < 100) {
            delay = 100;
        }
        this.timer.delay = delay;
        this.isReseting = false;
        this.timer.reset();
        this.timer.start();
        this.dispatchEventWith(LogicEvent.UI_REFRESHTEXT, false, { tileNum: this.randomArr.length });
    };
    Dungeon.prototype.addPlayer = function () {
        this.player = new Player();
        var index = Math.floor(this.SIZE / 2);
        this.playerPos.x = index;
        this.playerPos.y = index;
        this.player.x = this.map[this.playerPos.x][this.playerPos.y].x;
        this.player.y = this.map[this.playerPos.x][this.playerPos.y].y;
        this.addChild(this.player);
    };
    /**
     *  移动玩家
     */
    Dungeon.prototype.movePlayer = function (dir) {
        if (this.player.isWalking() || this.player.isDying()) {
            return;
        }
        console.log('walking');
        switch (dir) {
            case 0:
                if (this.playerPos.y - 1 >= 0) {
                    this.playerPos.y--;
                }
                break;
            case 1:
                if (this.playerPos.y + 1 < this.SIZE) {
                    this.playerPos.y++;
                }
                break;
            case 2:
                if (this.playerPos.x - 1 >= 0) {
                    this.playerPos.x--;
                }
                break;
            case 3:
                if (this.playerPos.x + 1 < this.SIZE) {
                    this.playerPos.x++;
                }
                break;
            default: break;
        }
        var px = this.map[this.playerPos.x][this.playerPos.y].x;
        var py = this.map[this.playerPos.x][this.playerPos.y].y;
        this.player.walk(px, py, dir, this.map[this.playerPos.x][this.playerPos.y].visible);
        if (!this.map[this.playerPos.x][this.playerPos.y].visible) {
            this.gameOver();
        }
    };
    Dungeon.prototype.addTimer = function () {
        this.timer = new egret.Timer(300 - this.level * 10, this.SIZE * this.SIZE);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.breakTile, this);
        this.timer.start();
    };
    Dungeon.prototype.breakTile = function () {
        var _this = this;
        if (this.randomArr.length <= this.successNumber) {
            console.log('finish');
            if (!this.isReseting) {
                this.isReseting = true;
                egret.setTimeout(function () { _this.resetGame(++_this.level); }, this, 1000);
            }
            return;
        }
        //发送breaktile消息
        this.dispatchEventWith(LogicEvent.DUNGEON_BREAKTILE, false, { tileNum: this.randomArr.length });
        var index = this.getRandomNum(0, this.randomArr.length - 1);
        var p = this.randomArr[index];
        var tile = this.map[p.x][p.y];
        var y = tile.y;
        egret.Tween.get(tile, { loop: true })
            .to({ y: y + 5 }, 25)
            .to({ y: y }, 25)
            .to({ y: y - 5 }, 25)
            .to({ y: y }, 25);
        egret.Tween.get(tile).wait(2000).call(function () {
            egret.Tween.removeTweens(tile);
            egret.Tween.get(tile).to({ scaleX: 0.7, scaleY: 0.7 }, 700).to({ alpha: 0 }, 300).call(function () {
                _this.map[p.x][p.y].visible = false;
                if (_this.playerPos.x == p.x && _this.playerPos.y == p.y) {
                    _this.gameOver();
                }
            });
        });
        this.randomArr.splice(index, 1);
    };
    Dungeon.prototype.getRandomNum = function (min, max) {
        return min + Math.round(Math.random() * (max - min));
    };
    Dungeon.prototype.gameOver = function () {
        console.log('gameover');
        this.timer.stop();
        //让角色原地走一步触发死亡,防止走路清空动画
        this.movePlayer(-1);
        // egret.setTimeout(() => { this.resetGame(1); }, this, 3000)
        this.dispatchEventWith(LogicEvent.GAMEOVER);
    };
    return Dungeon;
}(egret.Stage));
__reflect(Dungeon.prototype, "Dungeon");
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
var Logic = (function (_super) {
    __extends(Logic, _super);
    function Logic(main) {
        var _this = _super.call(this) || this;
        _this.level = 1;
        _this.main = main;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Logic.prototype.onAddToStage = function () {
        this.dungeon = new Dungeon();
        this.addChild(this.dungeon);
        this.controllerPad = new ControllerPad();
        this.controllerPad.x = this.stage.width / 2;
        this.controllerPad.y = 800;
        this.addChild(this.controllerPad);
        this.controllerPad.addEventListener(PadtapEvent.PADTAP, this.tapPad, this);
        this.dungeon.addEventListener(LogicEvent.DUNGEON_BREAKTILE, this.refreshText, this);
        this.dungeon.addEventListener(LogicEvent.UI_REFRESHTEXT, this.refreshText, this);
        this.main.addEventListener(LogicEvent.DUNGEON_NEXTLEVEL, this.loadNextLevel, this);
        this.dungeon.addEventListener(LogicEvent.GAMEOVER, this.gameOver, this);
    };
    Logic.prototype.refreshText = function (evt) {
        this.main.refreshSecondsText('Target:' + this.dungeon.successNumber + '    Tiles:' + evt.data.tileNum + '    LV.' + this.dungeon.level);
    };
    Logic.prototype.tapPad = function (evt) {
        this.dungeon.movePlayer(evt.dir);
    };
    Logic.prototype.loadNextLevel = function (evt) {
        this.level = evt.data.level;
        this.dungeon.resetGame(this.level);
    };
    Logic.prototype.gameOver = function () {
        this.main.gameoverDialog.show(this.dungeon.level);
    };
    return Logic;
}(egret.Stage));
__reflect(Logic.prototype, "Logic");
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [4 /*yield*/, RES.getResAsync("description_json")];
                    case 2:
                        result = _a.sent();
                        this.startAnimation(result);
                        return [4 /*yield*/, platform.login()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 4:
                        userInfo = _a.sent();
                        console.log(userInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        var bg = new egret.Shape();
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        bg.graphics.beginFill(0x333333, 1);
        bg.graphics.drawRect(0, 0, stageW, stageH);
        bg.graphics.endFill();
        this.addChild(bg);
        var logic = new Logic(this);
        this.addChild(logic);
        this.addSecondsText();
        this.gameoverDialog = new GameoverDialog();
        this.addChild(this.gameoverDialog);
    };
    Main.prototype.addSecondsText = function () {
        this.secondsText = new egret.TextField();
        this.addChild(this.secondsText);
        this.secondsText.alpha = 1;
        this.secondsText.textAlign = egret.HorizontalAlign.CENTER;
        this.secondsText.size = 30;
        this.secondsText.textColor = 0xffd700;
        this.secondsText.x = 50;
        this.secondsText.y = 60;
    };
    Main.prototype.refreshSecondsText = function (text) {
        this.secondsText.text = text;
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Main.prototype.startAnimation = function (result) {
        var _this = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = result.map(function (text) { return parser.parse(text); });
        var textfield = this.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var textFlow = textflowArr[count];
            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var DebugPlatform = (function () {
    function DebugPlatform() {
    }
    DebugPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    DebugPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return DebugPlatform;
}());
__reflect(DebugPlatform.prototype, "DebugPlatform", ["Platform"]);
if (!window.platform) {
    window.platform = new DebugPlatform();
}
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        _this.walking = false;
        _this.isdead = false;
        _this.init();
        return _this;
    }
    Player.prototype.init = function () {
        this.player = new egret.Bitmap(RES.getRes("player_png"));
        this.playerShadow = new egret.Bitmap(RES.getRes("shadow_png"));
        var index = 0;
        this.player.anchorOffsetX = this.player.width / 2;
        this.player.anchorOffsetY = this.player.height;
        this.player.x = 0;
        this.player.y = 0;
        this.playerShadow.anchorOffsetX = this.playerShadow.width / 2;
        this.playerShadow.anchorOffsetY = this.playerShadow.height / 2;
        this.playerShadow.x = 0;
        this.playerShadow.y = 0;
        this.playerShadow.alpha = 0.3;
        this.playerShadow.scaleX = 2;
        this.playerShadow.scaleY = 2;
        this.addChild(this.player);
        this.addChild(this.playerShadow);
    };
    Player.prototype.isWalking = function () {
        return this.walking;
    };
    Player.prototype.isDying = function () {
        return this.isdead;
    };
    Player.prototype.resetPlayer = function () {
        egret.Tween.removeTweens(this.player);
        egret.Tween.removeTweens(this);
        this.parent.setChildIndex(this, 100);
        this.player.scaleX = 1;
        this.player.scaleY = 1;
        this.player.visible = true;
        this.player.alpha = 1;
        this.player.x = 0;
        this.player.y = 0;
        this.playerShadow.visible = true;
        this.isdead = false;
        this.walking = false;
    };
    Player.prototype.die = function () {
        var _this = this;
        if (this.isdead) {
            return;
        }
        this.isdead = true;
        this.playerShadow.visible = false;
        egret.Tween.get(this.player).to({ y: 32, scaleX: 0.5, scaleY: 0.5 }, 200).call(function () {
            _this.parent.setChildIndex(_this, 0);
        }).to({ scaleX: 0.2, scaleY: 0.2, y: 100 }, 100).call(function () { _this.player.alpha = 0; });
    };
    Player.prototype.walk = function (px, py, dir, reachable) {
        var _this = this;
        if (this.walking) {
            console.log("cant");
            return;
        }
        this.walking = true;
        var offsetY = 10;
        var ro = 10;
        if (dir == 1 || dir == 3) {
            offsetY = -offsetY;
            ro = -ro;
        }
        egret.Tween.get(this.player, { loop: true })
            .to({ rotation: ro, y: this.player.y + offsetY }, 25)
            .to({ rotation: 0, y: 0 }, 25)
            .to({ rotation: -ro, y: this.player.y - offsetY }, 25)
            .to({ rotation: 0, y: 0 }, 25);
        egret.Tween.get(this, { onChange: function () { } }).to({ x: px, y: py }, 200).call(function () {
            egret.Tween.removeTweens(_this.player);
            _this.player.rotation = 0;
            _this.player.y = 0;
            _this.walking = false;
            if (!reachable) {
                _this.die();
            }
        });
    };
    return Player;
}(egret.DisplayObjectContainer));
__reflect(Player.prototype, "Player");
var LogicEvent = (function (_super) {
    __extends(LogicEvent, _super);
    function LogicEvent(type, bubbles, cancelable, data) {
        return _super.call(this, type, bubbles, cancelable, data) || this;
    }
    LogicEvent.LOGIC = "LOGIC";
    LogicEvent.GAMEOVER = "LOGIC_GAMEOVER";
    LogicEvent.DUNGEON_BREAKTILE = "DUNGEON_BREAKTILE";
    LogicEvent.DUNGEON_NEXTLEVEL = "DUNGEON_NEXTLEVEL";
    LogicEvent.UI_REFRESHTEXT = "UI_REFRESHTEXT";
    return LogicEvent;
}(egret.Event));
__reflect(LogicEvent.prototype, "LogicEvent");
/**
 * 方向键点击事件
 */
var PadtapEvent = (function (_super) {
    __extends(PadtapEvent, _super);
    function PadtapEvent(type, bubbles, cancelable, data) {
        var _this = _super.call(this, type, bubbles, cancelable, data) || this;
        _this.dir = -1;
        return _this;
    }
    PadtapEvent.PADTAP = "padtap";
    return PadtapEvent;
}(egret.Event));
__reflect(PadtapEvent.prototype, "PadtapEvent");
var GameoverDialog = (function (_super) {
    __extends(GameoverDialog, _super);
    function GameoverDialog() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    GameoverDialog.prototype.onAddToStage = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.bg = new egret.Shape();
        this.addChild(this.bg);
        this.bg.alpha = 0;
        this.bg.graphics.beginFill(0x000000, 1);
        this.bg.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
        this.bg.graphics.endFill();
        this.textTips = new egret.TextField();
        this.addChild(this.textTips);
        this.textTips.alpha = 0;
        this.textTips.textAlign = egret.HorizontalAlign.CENTER;
        this.textTips.size = 70;
        this.textTips.width = this.stage.width;
        this.textTips.textColor = 0xff0000;
        this.textTips.x = 0;
        this.textTips.y = this.stage.height / 2 - 200;
        this.textTips.text = 'you die';
        this.textRetry = new egret.TextField();
        this.addChild(this.textRetry);
        this.textRetry.alpha = 0;
        this.textRetry.textAlign = egret.HorizontalAlign.CENTER;
        this.textRetry.size = 50;
        this.textRetry.textColor = 0xffffff;
        this.textRetry.width = this.stage.width;
        this.textRetry.y = this.stage.height / 2 + 200;
        this.textRetry.text = 'play again';
        this.textRetry.bold = true;
    };
    GameoverDialog.prototype.show = function (level) {
        var _this = this;
        this.bg.alpha = 0;
        this.textTips.text = ' you die\n Lv.' + level;
        this.textTips.scaleX = 1;
        this.textTips.scaleY = 1;
        this.textTips.y = this.stage.height / 2 - 200;
        this.textTips.alpha = 0;
        this.textRetry.alpha = 0;
        this.textRetry.touchEnabled = true;
        this.visible = true;
        egret.Tween.get(this.bg).to({ alpha: 1 }, 1000);
        egret.Tween.get(this.textTips).wait(200).to({ y: this.textTips.y + 20, alpha: 1 }, 1000);
        egret.Tween.get(this.textRetry).wait(1000).to({ alpha: 1 }, 1000).call(function () {
            _this.textRetry.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.retry, _this);
        });
    };
    GameoverDialog.prototype.retry = function () {
        this.visible = false;
        this.textRetry.touchEnabled = false;
        this.textRetry.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.retry, this);
        this.parent.dispatchEventWith(LogicEvent.DUNGEON_NEXTLEVEL, false, { level: 1 });
    };
    return GameoverDialog;
}(egret.DisplayObjectContainer));
__reflect(GameoverDialog.prototype, "GameoverDialog");
;window.Main = Main;