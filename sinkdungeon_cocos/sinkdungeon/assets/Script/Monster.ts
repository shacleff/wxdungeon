// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import { EventConstant } from './EventConstant';
import HealthBar from './HealthBar';
import Logic from './Logic';
import MonsterData from './Data/MonsterData';

@ccclass
export default class Monster extends cc.Component {

    @property(cc.Vec2)
    pos: cc.Vec2 = cc.v2(0,0);
    @property(cc.Label)
    label: cc.Label = null;
    @property(HealthBar)
    healthBar: HealthBar = null;
    isMoving = false;
    private sprite: cc.Node;
    private anim: cc.Animation;
    isDied = false;
    // currentHealth: number = 3;
    // maxHealth: number = 3;
    isFall = false;
    private timeDelay = 0;
    // attackPonit = 1;
    data:MonsterData = new MonsterData();

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
    }
    
    changeBodyRes(resName:string){
        cc.loader.loadRes('Texture/'+resName,cc.SpriteFrame,(error:Error,spriteFrame:cc.SpriteFrame)=>{
            let body = this.sprite.getChildByName('body');
            spriteFrame.getTexture().setAliasTexParameters();
            body.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })
    }
    updatePlayerPos() {
        this.node.x = this.pos.x * 64 + 32;
        this.node.y = this.pos.y * 64 + 32;
    }
    transportPlayer(x: number, y: number) {
        this.sprite.rotation = 0;
        this.sprite.scale = 1;
        this.sprite.opacity = 255;
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.pos.x = x;
        this.pos.y = y;
        this.changeZIndex();
    }
    changeZIndex() {
        this.node.zIndex = 3000 + (9 - this.pos.y) * 100 + 2;
    }
    attack(dir,finish){
        if (this.isMoving || this.isDied) {
            return;
        }
        let x = 0;
		let y = 0;
		switch (dir) {
			case 0: y += 32; break;
			case 1: y -= 32; break;
			case 2: x -= 32; break;
			case 3: x += 32; break;
			case 4: break;
        }
        let action = cc.sequence(cc.moveBy(0.1, x, y), cc.callFunc(() => {
            if(finish){finish(this.data.attackPoint);}
        }),cc.moveTo(0.1, 0, 0));
        this.sprite.runAction(action);
    }
    move(dir) {
        if (this.isMoving || this.isDied) {
            return;
        }
        this.isMoving = true;
        switch (dir) {
            case 0: if (this.pos.y + 1 < 9) { this.pos.y++; } break;
            case 1: if (this.pos.y - 1 >= 0) { this.pos.y--; } break;
            case 2: if (this.pos.x - 1 >= 0) { this.pos.x--; } break;
            case 3: if (this.pos.x + 1 < 9) { this.pos.x++; } break;
        }
        let isDown = dir == 1;
        if (isDown) {
            this.changeZIndex();
        }
        let x = this.pos.x * 64 + 32;
        let y = this.pos.y * 64 + 32;
        let finish = cc.callFunc(() => {
            this.changeZIndex();
            this.sprite.y = 0;
            this.isDied = false;
            this.sprite.rotation = 0;
            this.sprite.scale = 1;
            this.sprite.opacity = 255;
            this.anim.play('PlayerIdle');
            this.isMoving = false;
        }, this);
        let action = cc.sequence(cc.moveTo(0.1, x, y), finish);
        this.anim.play('PlayerWalk');
        this.node.runAction(action);
    }

    start() {
        let ss = this.node.getComponentsInChildren(cc.Sprite);
        for (let i = 0; i < ss.length; i++) {
            if(ss[i].spriteFrame){
                ss[i].spriteFrame.getTexture().setAliasTexParameters();
            }
        }
        this.changeZIndex();
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.maxHealth);
    }
    fall() {
        if (this.isFall) {
            return;
        }
        this.isFall = true;
        this.isDied = true;
        this.anim.play('PlayerFall');
    }
    takeDamage(damage: number) {
        this.data.currentHealth -= damage;
        if (this.data.currentHealth > this.data.maxHealth) {
            this.data.currentHealth = this.data.maxHealth;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.maxHealth);
        if (this.data.currentHealth < 1) {
            this.killed();
        }
    }
    killed() {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        this.anim.play('PlayerDie');
    }



    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 1) {
            this.timeDelay = 0;
        }
        if (!this.isMoving) {
            this.updatePlayerPos();
        }
        if (this.label) {
            this.label.string = "" + this.node.zIndex;
        }
        this.healthBar.node.active = !this.isDied;
    }
}
