/**
 * 项目页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/projectsConfig.ts 控制。
 */
import type { ProjectItem } from "@/types/projectsConfig";

export const projectsData: ProjectItem[] = [
	{
		key: "robomaster-opensource",
		title: "机甲大师开源列表",
		summary:
			"维护的 RoboMaster 开源资源目录，汇总各战队、个人开发者、DJI 官方与第三方公司在 GitHub、Gitee 和 RoboMaster 论坛公开的代码、图纸与项目。收录 82 支战队、25 位个人开发者、387 个公开仓库。",
		category: "robomaster",
		phase: "shipped",
		technologies: ["Python", "GitHub API", "Static Site"],
		icon: "material-symbols:sports-esports-outline-rounded",
		featured: true,
		repository: "https://github.com/HortonWen/robomaster-opensource",
		year: "2026",
	},
	{
		key: "cxxy-campus-skill",
		title: "cxxy-campus AI Skill",
		summary:
			"针对东南大学成贤学院校园系统的自动化 AI 技能，覆盖官网信息查询、学科竞赛系统报名、数字校园门户单点登录到教务系统。仅用 Python 标准库，零第三方依赖。",
		category: "tool",
		phase: "shipped",
		technologies: ["Python", "HTTP", "AI Agent"],
		icon: "material-symbols:smart-toy-outline-rounded",
		repository: "https://github.com/HortonWen/seu-cxxy-campus-skill",
		year: "2026",
	},
	{
		key: "campus-wifi-tool",
		title: "校园网一键登录工具",
		summary:
			"Windows 端校园网自动登录工具，解决连上 Student_CX 不弹认证页的问题，支持自动登录、开机自启，密码可选本机加密保存。",
		category: "tool",
		phase: "shipped",
		technologies: ["Windows", "Auto Login"],
		icon: "material-symbols:wifi-outline-rounded",
		year: "2026",
	},
	{
		key: "cpp-course-project",
		title: "C++ 课程项目（Rolex 设计）",
		summary:
			"C++ 课程综合项目，包含完整的 Rolex 系统设计、核心代码实现、测试用例与多文件编译配置。",
		category: "coursework",
		phase: "shipped",
		technologies: ["C++", "CMake", "OOP"],
		icon: "material-symbols:code-outline-rounded",
		year: "2026",
	},
	{
		key: "ros-gazebo-sim",
		title: "ROS Gazebo 小车仿真",
		summary:
			"基于 ROS 和 Gazebo 的小车模型仿真项目，包含 URDF 模型搭建、传感器配置与基础控制节点。",
		category: "robotics",
		phase: "shipped",
		technologies: ["ROS", "Gazebo", "URDF", "C++"],
		icon: "material-symbols:smart-toy-outline-rounded",
		year: "2026",
	},
];

/** 获取所有项目数据列表 */
export function getProjectsList(): ProjectItem[] {
	return projectsData;
}
