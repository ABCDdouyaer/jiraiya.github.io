class WxTemplate {

    constructor(xmlJson){
        this.event = xmlJson.MsgType[0];
        this.fromUser = xmlJson.ToUserName[0];
        this.toUser = xmlJson.FromUserName[0];
        this.content = xmlJson.Content && xmlJson.Content[0];
        this.mediaId = xmlJson.MediaId && xmlJson.MediaId[0]; 
    }

    sendTpl(){
        const template = {
            'text':  `<xml>
                        <ToUserName><![CDATA[${this.toUser}]]></ToUserName>
                        <FromUserName><![CDATA[${this.fromUser}]]></FromUserName>
                        <CreateTime>${Date.now()}</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[您发送的消息是：${this.content}]]></Content>
                    </xml>`,
            'image': `<xml>
                        <ToUserName><![CDATA[${this.toUser}]]></ToUserName>
                        <FromUserName><![CDATA[${this.fromUser}]]></FromUserName>
                        <CreateTime>${Date.now()}</CreateTime>
                        <MsgType><![CDATA[image]]></MsgType>
                        <Image>
                        <MediaId><![CDATA[${this.mediaId}]]></MediaId>
                        </Image>
                    </xml>`,
            'other': `<xml>
                        <ToUserName><![CDATA[${this.toUser}]]></ToUserName>
                        <FromUserName><![CDATA[${this.fromUser}]]></FromUserName>
                        <CreateTime>${Date.now()}</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[🚗🚗您发送的消息没有找到对应的回复]]></Content>
                    </xml>`,
           
        }
       
        return template[this.event] || template.other;
    }

}

module.exports = WxTemplate;