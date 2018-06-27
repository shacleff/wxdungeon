import { EventConstant } from "../EventConstant";

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
export default class Bullet extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    damage: number = 1;
    @property
    speed: number = 0.5;

    anim:cc.Animation;
    dir = 0;
    tagetPos = cc.v2(0,0);

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
    }
    onEnable(){
        this.tagetPos = cc.v2(0,0);
    }
    //animation
    BulletShow(){
        this.fire(this.dir);
    }
    showBullet(dir){
        this.dir = dir;
        this.anim.play(this.node.name+'Show');
    }
    fire(dir){
        let x = 0;
		let y = 0;
		switch (dir) {
			case 0: y += 1500; break;
			case 1: y -= 1500; break;
			case 2: x -= 1500; break;
			case 3: x += 1500; break;
			case 4: break;
        }
        this.tagetPos = cc.v2(x,y);
    }

    start () {

    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        if(other.tag == 3){
            if(this.node.active){
                this.node.stopAllActions();
                cc.director.emit(EventConstant.PLAYER_TAKEDAMAGE,{damage:this.damage});
                cc.director.emit('destorybullet',{bulletNode:this.node});
            }
        }
        if(other.tag == 6){
            if(this.node.active){
                this.node.stopAllActions();
                cc.director.emit('destorybullet',{bulletNode:this.node});
            }
        }
    }
    update (dt) {
        this.node.position =  cc.pLerp(this.node.position,this.tagetPos,dt*this.speed);
        if(this.tagetPos.x!=0&&this.tagetPos.y!=0&&this.node.position.equals(this.tagetPos)){
            cc.director.emit('destorybullet',{bulletNode:this.node});
        }
    }
    
}
