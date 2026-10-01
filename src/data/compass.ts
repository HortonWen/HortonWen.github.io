/**
 * 站点罗盘数据（本地数据源）。
 * 用途：src/pages/compass.astro → organisms/CompassSection → molecules/CompassTile。
 * 添加站点：往对应 Shelf.entries 追加一项；数组顺序即展示顺序。
 */

/** 单条站点记录 */
export interface CompassEntry {
	label: string;
	href: string;
	note?: string;
	icon?: string;
	image?: string;
}

/** 分组（Shelf = 罗盘上的收纳格） */
export interface CompassShelf {
	key: string;
	name: string;
	icon?: string;
	blurb?: string;
	entries: CompassEntry[];
}

export const compassData: CompassShelf[] = [
	{
		key: "tools",
		name: "我的小工具",
		icon: "material-symbols:build-outline-rounded",
		blurb: "自己日常用的 Windows 小工具和自动化脚本",
		entries: [
			{
				label: "校园网一键登录",
				href: "https://github.com/HortonWen",
				note: "Windows 端 Student_CX 自动登录，支持开机自启",
				icon: "material-symbols:wifi-outline-rounded",
			},
			{
				label: "cxxy-campus Skill",
				href: "https://github.com/HortonWen/seu-cxxy-campus-skill",
				note: "校园系统自动化 AI 技能，官网/竞赛/门户一站式",
				icon: "material-symbols:smart-toy-outline-rounded",
			},
		],
	},
	{
		key: "campus",
		name: "校园资源",
		icon: "material-symbols:school-outline-rounded",
		blurb: "东南大学成贤学院相关资源",
		entries: [
			{
				label: "成贤学院课程攻略",
				href: "https://openlist.truraly.fun/",
				note: "同学自发维护的课程资料开源项目",
				icon: "material-symbols:menu-book-outline-rounded",
			},
			{
				label: "计算机协会官网",
				href: "https://github.com/SEUCXCS/homepage",
				note: "协会官网仓库，由协会同学维护",
				icon: "material-symbols:groups-outline-rounded",
			},
			{
				label: "计协 C++ 指南",
				href: "https://guide.cxcs.dev/docs/cpp",
				note: "协会维护的 C++ 学习指南",
				icon: "material-symbols:code-outline-rounded",
			},
		],
	},
	{
		key: "dev",
		name: "开发常用",
		icon: "material-symbols:code-rounded",
		blurb: "写代码时常开的站点",
		entries: [
			{
				label: "GitHub",
				href: "https://github.com",
				note: "代码托管与协作",
				icon: "fa6-brands:github",
			},
			{
				label: "Stack Overflow",
				href: "https://stackoverflow.com",
				note: "编程问答与调试",
				icon: "fa6-brands:stack-overflow",
			},
			{
				label: "MDN Web Docs",
				href: "https://developer.mozilla.org",
				note: "权威 Web 技术文档",
				icon: "simple-icons:mdnwebdocs",
			},
			{
				label: "cppreference",
				href: "https://en.cppreference.com",
				note: "C/C++ 标准库参考",
				icon: "simple-icons:cplusplus",
			},
		],
	},
	{
		key: "robotics",
		name: "机器人 / 机甲大师",
		icon: "material-symbols:smart-toy-outline-rounded",
		blurb: "RoboMaster 与机器人开发相关资源",
		entries: [
			{
				label: "RoboMaster 官网",
				href: "https://www.robomaster.com",
				note: "DJI 机甲大师官方网站",
				icon: "material-symbols:sports-esports-outline-rounded",
			},
			{
				label: "RoboMaster SDK",
				href: "https://github.com/dji-sdk/RoboMaster-SDK",
				note: "DJI 官方 Python SDK 及示例",
				icon: "material-symbols:extension-outline-rounded",
			},
			{
				label: "ROS 官方文档",
				href: "https://docs.ros.org",
				note: "ROS / ROS2 官方教程与 API",
				icon: "material-symbols:menu-book-outline-rounded",
			},
			{
				label: "Gazebo 仿真",
				href: "http://gazebosim.org",
				note: "机器人三维仿真环境",
				icon: "material-symbols:3d-rotation-outline-rounded",
			},
		],
	},
	{
		key: "tools-online",
		name: "在线工具",
		icon: "material-symbols:handyman-outline-rounded",
		entries: [
			{
				label: "Regex101",
				href: "https://regex101.com",
				note: "正则表达式测试与调试",
			},
			{
				label: "Squoosh",
				href: "https://squoosh.app",
				note: "图片压缩与格式转换",
			},
			{
				label: "Excalidraw",
				href: "https://excalidraw.com",
				note: "手绘风格白板协作",
			},
			{
				label: "Iconify",
				href: "https://icon-sets.iconify.design",
				note: "开源图标集搜索",
			},
		],
	},
];
