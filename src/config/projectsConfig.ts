import type { ProjectsConfig } from "@/types/projectsConfig";
import { withUserConfig } from "../utils/config-overlay.ts";

export const projectsConfig: ProjectsConfig = withUserConfig("projects", {
	enable: true,
	title: "$t:projects",
	description: "$t:projectsBanner",
	categories: [
		{
			key: "robomaster",
			label: "机甲大师",
			icon: "material-symbols:sports-esports-outline-rounded",
		},
		{
			key: "robotics",
			label: "机器人",
			icon: "material-symbols:smart-toy-outline-rounded",
		},
		{
			key: "tool",
			label: "工具",
			icon: "material-symbols:build-outline-rounded",
		},
		{
			key: "coursework",
			label: "课程项目",
			icon: "material-symbols:school-outline-rounded",
		},
	],
});
