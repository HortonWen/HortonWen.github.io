/**
 * 设备展示页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/devicesConfig.ts 控制。
 */
import type { DeviceItem } from "@/types/devicesConfig";

export const devicesData: DeviceItem[] = [
	{
		id: "macbook-pro-16",
		name: 'MacBook Pro 16"',
		brand: "Apple",
		category: "desk",
		status: "active",
		specs: "M3 Max / 64GB / 2TB",
		description:
			"Primary workstation for development, design, and heavy rendering workloads.",
		icon: "material-symbols:laptop-mac-rounded",
		featured: true,
		year: "2024",
		link: "https://www.apple.com/macbook-pro/",
	},
	{
		id: "iphone-16-pro",
		name: "iPhone 16 Pro",
		brand: "Apple",
		category: "mobile",
		status: "active",
		specs: "Natural Titanium / 256GB",
		description:
			"Daily driver smartphone with outstanding cameras and a smooth 120Hz ProMotion display.",
		icon: "material-symbols:phone-iphone",
		featured: true,
		year: "2024",
	},
	{
		id: "sony-wh1000xm5",
		name: "Sony WH-1000XM5",
		brand: "Sony",
		category: "audio",
		status: "active",
		specs: "Silver / ANC / LDAC",
		description:
			"Industry-leading noise-canceling headphones for immersive coding sessions and travels.",
		icon: "material-symbols:headphones-rounded",
		year: "2023",
	},
	{
		id: "custom-keyboard-75",
		name: "Custom 75% Mechanical Keyboard",
		brand: "Custom",
		category: "peripheral",
		status: "active",
		specs: "Anodized Aluminum / Linear Switches",
		description:
			"Custom gasket-mounted keyboard tuned for deep, quiet typing acoustics.",
		icon: "material-symbols:keyboard-outline-rounded",
		year: "2025",
	},
	{
		id: "ipad-pro-11",
		name: 'iPad Pro 11"',
		brand: "Apple",
		category: "mobile",
		status: "backup",
		specs: "Space Gray / 128GB",
		description:
			"Secondary mobile screen and digital notepad for sketching ideas and reading papers.",
		icon: "material-symbols:tablet-mac-rounded",
		year: "2021",
	},
	{
		id: "honor-winrt",
		name: "HONOR winRT",
		brand: "HONOR",
		category: "mobile",
		status: "active",
		specs: "Snapdragon 8 Elite",
		description: "日常主力手机，骁龙 8 Elite 平台。",
		icon: "material-symbols:phone-iphone",
		featured: true,
		year: "2025",
	},
	{
		id: "honor-magicpad-pro-133",
		name: 'HONOR MagicPad Pro 13.3"',
		brand: "HONOR",
		category: "mobile",
		status: "active",
		specs: '13.3" / Snapdragon 8 Elite Gen 5',
		description: "影音与阅读平板，骁龙 8 Elite Gen 5 平台。",
		icon: "material-symbols:tablet-mac-rounded",
		year: "2026",
	},
	{
		id: "honor-magicbook-16-pro-hunter",
		name: "HONOR MagicBook 16 Pro Hunter",
		brand: "HONOR",
		category: "desk",
		status: "active",
		specs: "Core Ultra 9 (Gen 2) / RTX 5070",
		description: "游戏本，第二代酷睿 Ultra 9 + RTX 5070 独显。",
		icon: "material-symbols:laptop-mac-rounded",
		featured: true,
		year: "2026",
	},
];

/** 获取所有设备数据列表 */
export function getDevicesList(): DeviceItem[] {
	return devicesData;
}
