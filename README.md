# hu10 项目简单说明
名称：10成长动态
诉求：在一个有限的范围内分享宝贝的成长动态。
使用者/分享者：父母
有限的范围：必须是有人邀请的，邀请者和被邀请者是一个圈子。
宝贝：任何年龄阶段的“宝贝”；
成长动态：可以是文字，图片，音频，视频；

功能
注册：被邀请后可以使用手机号码注册，注册须填写姓名，宝贝信息，设置密码；
登陆：使用手机号和密码登陆；以下的功能都必须登陆之后才能使用；
浏览动态：
浏览范围：圈子里的人发布的所有类型动态；
发布动态：动态包含标题，内容，标签。还可选择上传图片，音频，视频，但只能其一；
点赞动态：可以对自己或别人的动态点赞；
评论动态：可以对自己或别人的动态评论，评论可以指定对象；
删除动态：可以删除自己发布的动态；

内部标签设定
宝贝可以拥有各种标签/成就，具体标签/成就设定待定；
获取方式：根据发布动态的种类，及其动态被评论和被赞的数量；

数据模型
用户（user）
{
	name:String,
	account:String, //手机号码
	role: {			//角色 user,admin
		type: String,
		default: 'user'
	},
	hashedPassword: String, //加密后的密码
	provider: String,	//微信、QQ或者其他途径登陆
	salt: String,
	kids: [kid],
	invite: [String],
	create_date: { type: Number, default: Date.now, index: true}
}
宝贝（kid）
{
	name：String，
	account：{type:String, default: ''}, //备用
	birthday：{type: Number},
	avatar:String
}


动态（post）
{
	title: String,
	content: String,
	tags: [tag],
	author: user,
	create_date: { type: Number, default: Date.now, index: true},
	mediaUrl: {type: [], default: []},
	mediaType: {type: Number, default: 0}, //媒体类型 0:图片，1:视频，2：音频。
	comments: [comment], //评论
	favs: [user] //赞
}
标签（tag）
{
	tag:String,
	count:Number
}
评论（comment）
{
	content: String,
	from: user,
	to: user,
	create_date: { type: Number, default: Date.now, index: true}
}
