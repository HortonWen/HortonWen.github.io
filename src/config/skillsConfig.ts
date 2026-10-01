import type { SkillsConfig } from "@/types/skillsConfig";
import { withUserConfig } from "../utils/config-overlay.ts";

export const skillsConfig: SkillsConfig = withUserConfig("skills", {
	enable: true,
	title: "$t:skills",
	description: "$t:skillsBanner",
	categories: [
		{
			key: "ai-agent",
			label: "AI Agent",
			icon: "material-symbols:smart-toy-outline-rounded",
		},
		{
			key: "language",
			label: "编程语言",
			icon: "material-symbols:code-outline-rounded",
		},
		{
			key: "robotics",
			label: "机器人",
			icon: "material-symbols:smart-toy-outline-rounded",
		},
		{
			key: "embedded",
			label: "嵌入式",
			icon: "material-symbols:memory-outline-rounded",
		},
		{
			key: "tooling",
			label: "工具链",
			icon: "material-symbols:construction-rounded",
		},
		{
			key: "writing",
			label: "写作",
			icon: "material-symbols:edit-note-outline-rounded",
		},
		{
			key: "frontend",
			label: "前端",
			icon: "material-symbols:web-rounded",
		},
	],
});
