/**
 * 友情链接数据配置（结构与 Mizuki 同款，便于互相迁移）。
 * 用于管理友情链接页面的数据：src/pages/friends.astro → organisms/FriendSection。
 *
 * 添加友链：在 friendsData 中追加一项即可，页面 / 筛选标签自动生成。
 * tags 会聚合为页面顶部的筛选 chip（OR 命中：选中多个标签时命中任一即显示）。
 */
export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "成贤学院课程攻略共享计划",
		imgurl: "https://www.google.com/s2/favicons?domain=openlist.truraly.fun&sz=128",
		desc: "同学自发维护的课程资料开源项目：PPT、作业答案、历年试卷、复习经验，背后有自建资源站，打开即可直接下载。由 Truraly 及社区贡献者维护。",
		siteurl: "https://openlist.truraly.fun/",
		tags: ["资源", "课程"],
	},
	{
		id: 2,
		title: "东南大学成贤学院计算机协会官网",
		imgurl: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
		desc: "2026 年东南大学成贤学院计算机协会官网仓库，由协会同学维护。",
		siteurl: "https://github.com/SEUCXCS/homepage",
		tags: ["资源", "协会"],
	},
	{
		id: 3,
		title: "Nayuta 博客主题",
		imgurl: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
		desc: "简洁优雅的 Astro 博客主题，来自东南成贤计算机协会。原博客曾使用此主题。",
		siteurl: "https://github.com/yuanzui-cf/nayuta",
		tags: ["资源", "主题"],
	},
	{
		id: 4,
		title: "计算机协会 C++ 指南",
		imgurl: "https://www.google.com/s2/favicons?domain=guide.cxcs.dev&sz=128",
		desc: "东南大学成贤学院计算机协会维护的 C++ 学习指南，由协会同学维护。",
		siteurl: "https://guide.cxcs.dev/docs/cpp",
		tags: ["资源", "C++"],
	},
	{
		id: 5,
		title: "NovaForge",
		imgurl: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
		desc: "GitHub 开源项目，作者 SiriusFzh 是东南大学成贤学院 2026 任期的天文爱好者协会会长。",
		siteurl: "https://github.com/SiriusFzh/NovaForge",
		tags: ["资源", "开源"],
	},
];

// 获取所有友情链接数据（稳定顺序，测试可复现）
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据（避免固定排序，按需使用）
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
