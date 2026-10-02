/**
 * 设备展示页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/devicesConfig.ts 控制。
 */
import type { DeviceItem } from "@/types/devicesConfig";

export const devicesData: DeviceItem[] = [
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
	{
		id: "huawei-freebuds-3-pro",
		name: "HUAWEI FreeBuds 3 Pro",
		brand: "HUAWEI",
		category: "audio",
		status: "active",
		specs: "TWS / 智慧动态降噪 / 星闪",
		description: "日常通勤与开发时佩戴的无线耳机，降噪和连接稳定性都不错。",
		icon: "material-symbols:headphones-rounded",
		year: "2024",
	},
	{
		id: "langtu-t98-keyboard",
		name: "狼途 T98",
		brand: "LANGTU",
		category: "peripheral",
		status: "active",
		specs: "98 键位 / 机械轴",
		description: "日常码字与打游戏的主力键盘，98 配列省桌面空间。",
		icon: "material-symbols:keyboard-outline-rounded",
		year: "2024",
	},
	{
		id: "huawei-watch-gt4",
		name: "HUAWEI Watch GT 4",
		brand: "HUAWEI",
		category: "mobile",
		status: "active",
		specs: "智能运动手表",
		description: "日常健康监测与运动记录，续航长，消息提醒方便。",
		icon: "material-symbols:watch-rounded",
		year: "2023",
	},
];

/** 获取所有设备数据列表 */
export function getDevicesList(): DeviceItem[] {
	return devicesData;
}
