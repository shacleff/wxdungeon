
const {ccclass, property} = cc._decorator;
@ccclass
export class EventConstant extends cc.Component{
    public static readonly PLAYER_MOVE = 'PLAYER_MOVE';
    public static readonly PLAYER_ROTATE = 'PLAYER_ROTATE';
    public static readonly PLAYER_USEITEM = 'PLAYER_USEITEM';
    public static readonly PLAYER_SKILL = 'PLAYER_SKILL';
    public static readonly PLAYER_ATTACK = 'PLAYER_ATTACK';
    public static readonly PLAYER_REMOTEATTACK = 'PLAYER_REMOTEATTACK';
    public static readonly PLAYER_GETITEM = 'PLAYER_GETITEM';
    public static readonly PLAYER_TAPTIPS = 'PLAYER_TAPTIPS';
    public static readonly PLAYER_TAKEDAMAGE= 'PLAYER_TAKEDAMAGE';
    public static readonly PLAYER_CHANGEWEAPON= 'PLAYER_CHANGEWEAPON';
    public static readonly PLAYER_CHANGEEQUIPMENT= 'PLAYER_CHANGEEQUIPMENT';
    public static readonly PLAYER_STATUSUPDATE = 'PLAYER_STATUSUPDATE';
    public static readonly INVENTORY_CHANGEITEM = 'INVENTORY_CHANGEITEM';
    public static readonly LOADINGNEXTLEVEL= 'LOADINGNEXTLEVEL';
    public static readonly CHANGE_MINIMAP= 'CHANGE_MINIMAP';
    public static readonly LOADINGROOM= 'LOADINGROOM';
    public static readonly HUD_ADD_COIN = 'HUD_ADD_COIN';
    public static readonly HUD_STOP_COUNTTIME = 'HUD_STOP_COUNTTIME';
    public static readonly HUD_LIGHT_CONTROLLER = 'HUD_LIGHT_CONTROLLER';
    public static readonly HUD_DARK_CONTROLLER = 'HUD_DARK_CONTROLLER';
    public static readonly HUD_CONTROLLER_COOLDOWN = 'HUD_CONTROLLER_COOLDOWN';
    public static readonly HUD_DAMAGE_CORNER_SHOW = 'HUD_DAMAGE_CORNER_SHOW';
    public static readonly HUD_GROUND_EQUIPMENT_INFO_SHOW = 'HUD_GROUND_EQUIPMENT_INFO_SHOW';
    public static readonly HUD_GROUND_EQUIPMENT_INFO_HIDE = 'HUD_GROUND_EQUIPMENT_INFO_HIDE';
    public static readonly DUNGEON_SETEQUIPMENT = 'DUNGEON_SETEQUIPMENT';
    public static readonly DUNGEON_SHAKEONCE = 'DUNGEON_SHAKEONCE';
    public static readonly DUNGEON_ADD_COIN = 'DUNGEON_ADD_COIN';
    public static readonly DUNGEON_ADD_HEART = 'DUNGEON_ADD_HEART';
    public static readonly DUNGEON_ADD_AMMO = 'DUNGEON_ADD_AMMO';
    public static readonly DUNGEON_ADD_FALLSTONE = 'DUNGEON_ADD_FALLSTONE';
    public static readonly MONSTER_STATUSUPDATE = 'MONSTER_STATUSUPDATE';
    public static readonly BOSS_ADDSLIME = 'BOSS_ADDSLIME';
    public static readonly HUD_UPDATE_PLAYER_INFODIALOG = 'HUD_UPDATE_PLAYER_INFO_DIALOG';
    public static readonly HUD_UPDATE_PLAYER_HEALTHBAR = 'HUD_UPDATE_PLAYER_HEALTHBAR';
    public static readonly TALENT_TREE_UPDATE = 'TALENT_TREE_UPDATE';
    public static readonly TALENT_TREE_SELECT = 'TALENT_TREE_SELECT';
    public static readonly PLAY_AUDIO = 'PLAY_AUDIO';
    public static eventHandler:cc.Node = new cc.Node();
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {

    // }

    // update (dt) {}
}
