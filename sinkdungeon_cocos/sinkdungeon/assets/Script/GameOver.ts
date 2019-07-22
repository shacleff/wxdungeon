import Logic from "./Logic";
import WxHelper from "./WxHelper";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {

    @property(WxHelper)
    wxhelper:WxHelper = null;
    @property(cc.Label)
    level: cc.Label = null;
    @property(cc.Label)
    clock: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        if (this.clock) {
            this.clock.string = `${Logic.time}`;
        }
        if (this.level) {
            this.level.string = `Level ${Logic.chapterName + 1}-${Logic.level}`;
        }
    }
    retry(){
        Logic.resetData();
        cc.director.loadScene('loading');
    }
    home(){
        Logic.time = '00:00:00';
        if(this.wxhelper){
            this.wxhelper.CloseDialog();
        }
        cc.director.loadScene('start');
    }

    // update (dt) {}
}
