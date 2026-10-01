/**
 * 技能页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/skillsConfig.ts 控制。
 */
import type { SkillItem } from "@/types/skillsConfig";

export const skillsData: SkillItem[] = [
	{
		name: "cxxy-campus AI Skill",
		description:
			"东南大学成贤学院校园系统自动化技能：官网通知查询、竞赛系统报名、数字校园门户 SSO 到教务系统。仅 Python 标准库，零第三方依赖。",
		icon: "material-symbols:smart-toy-outline-rounded",
		category: "ai-agent",
		level: "advanced",
	},
	{
		name: "C / C++",
		description: "面向对象编程、STL、文件 IO、模板、多文件编译、CMake 构建。",
		icon: "simple-icons:cplusplus",
		category: "language",
		level: "intermediate",
	},
	{
		name: "Python",
		description: "脚本自动化、标准库网络请求、数据处理、AI Agent 技能开发。",
		icon: "simple-icons:python",
		category: "language",
		level: "intermediate",
	},
	{
		name: "ROS / ROS2",
		description: "节点编写、话题与服务通信、URDF 模型、Gazebo 仿真、导航栈。",
		icon: "material-symbols:smart-toy-outline-rounded",
		category: "robotics",
		level: "intermediate",
	},
	{
		name: "嵌入式开发",
		description: "STM32 入门、GPIO、串口通信、定时器、中断处理。",
		icon: "material-symbols:memory-outline-rounded",
		category: "embedded",
		level: "beginner",
	},
	{
		name: "Linux / WSL",
		description: "常用命令、Shell 脚本、环境配置、Ubuntu 20.04 WSL 搭建。",
		icon: "simple-icons:linux",
		category: "tooling",
		level: "intermediate",
	},
	{
		name: "CMake",
		description: "多文件项目构建、跨平台配置、第三方库链接、编译选项管理。",
		icon: "material-symbols:build-outline-rounded",
		category: "tooling",
		level: "intermediate",
	},
	{
		name: "Git / GitHub",
		description: "版本控制、分支管理、Actions CI/CD、Pages 部署、开源协作。",
		icon: "fa6-brands:github",
		category: "tooling",
		level: "intermediate",
	},
	{
		name: "LaTeX",
		description: "学术论文排版、数学公式、表格、参考文献、Beamer 幻灯片。",
		icon: "simple-icons:latex",
		category: "writing",
		level: "intermediate",
	},
	{
		name: "Markdown",
		description: "技术文档写作、Mermaid 流程图、数学公式渲染、Obsidian 工作流。",
		icon: "simple-icons:markdown",
		category: "writing",
		level: "advanced",
	},
	{
		name: "MATLAB",
		description: "矩阵运算、数据可视化、脚本编写、控制系统仿真基础。",
		icon: "material-symbols:functions-outline-rounded",
		category: "tooling",
		level: "beginner",
	},
	{
		name: "Astro",
		description: "静态站点生成、内容集合、组件群岛、GitHub Pages 部署。",
		icon: "simple-icons:astro",
		category: "frontend",
		level: "intermediate",
	},
];

/** 获取所有技能数据列表 */
export function getSkillsList(): SkillItem[] {
	return skillsData;
}
