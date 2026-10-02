---
title: "Linux 常用命令与虚拟机文件传输"
published: 2026-08-03
description: "Linux 日常高频命令速查手册，以及 VMware 虚拟机与 Windows 之间四种文件传输方法的实操步骤。"
tags: [Linux, 命令行, VMware, 文件传输, SCP]
category: 机甲大师
draft: false
---


刚接触 Linux 时，面对纯命令行界面往往不知道该敲什么。本文汇总了日常使用中最常见的命令分类，方便随时查阅；同时整理了 VMware 虚拟机中 Ubuntu 与 Windows 互传文件的四种方法，从最简单的拖拽到无需额外配置的 HTTP 临时服务器都有覆盖。

## 文件与目录操作

这是最基础也最高频的一组命令：

```bash
ls              # 列出目录内容
ls -l           # 详细列表（权限、大小、时间）
ls -a           # 显示隐藏文件

cd /path        # 切换到指定目录
cd ~            # 回到家目录
cd ..           # 返回上级目录

pwd             # 显示当前工作路径

mkdir dirname   # 新建目录
mkdir -p a/b/c  # 递归创建多级目录

rm file         # 删除文件
rm -r dir       # 删除目录
rm -rf dir      # 强制递归删除（慎用！）

cp src dst      # 复制文件
cp -r src dst   # 复制整个目录

mv src dst      # 移动文件或重命名

touch file      # 新建空文件
```

`rm -rf` 是不可逆操作，执行前务必确认路径正确。在生产环境中建议先用 `ls` 预览目标再执行删除。

## 查看文件内容

```bash
cat file         # 一次性输出全部内容
less file        # 分页查看（按 q 退出）
head -n 10 file  # 查看前 10 行
tail -n 10 file  # 查看后 10 行
tail -f file     # 实时追踪日志输出
```

`less` 适合查看大文件，支持上下翻页和搜索（按 `/` 输入关键词）。`tail -f` 在调试程序或监控服务日志时特别有用。

## 查找与搜索

```bash
which cmd                # 查找命令的可执行文件路径
find /path -name "*.conf" # 按文件名查找

grep "text" file          # 在文件中搜索文本
grep -R "text" dir        # 在目录中递归搜索
```

`grep -R` 配合正则表达式可以快速定位代码中的特定字符串，是日常开发中使用频率极高的组合。

## 权限与用户管理

```bash
sudo cmd              # 以管理员权限执行命令

chmod 644 file        # 设置文件权限
chmod +x script.sh    # 添加可执行权限

chown user:group file # 修改文件所有者

whoami                # 查看当前用户名
su - username         # 切换用户
```

Linux 的权限模型是理解系统安全的基础。`chmod` 的数字表示法中，644 意味着所有者可读写、其他人只读；755 则额外给所有人加了执行权限。

## 进程与资源监控

```bash
ps aux           # 查看所有进程的详细信息
top              # 实时进程监控（htop 更友好）
kill PID         # 终止指定进程
kill -9 PID      # 强制终止

df -h            # 查看磁盘使用情况
du -sh dir       # 查看目录占用大小
free -h          # 查看内存使用
```

当系统变慢或某个程序无响应时，先用 `top` 或 `htop` 找到异常进程的 PID，再用 `kill` 处理。`df -h` 和 `du -sh` 则是排查磁盘空间不足的标配组合。

## 网络相关

```bash
ip addr          # 查看 IP 地址（推荐）
ifconfig         # 旧版命令（部分新系统已移除）

ping host        # 测试网络连通性
curl http://xxx  # HTTP 请求
wget http://xxx  # 下载文件

netstat -tunlp   # 查看端口监听状态
ss -tunlp        # 同上（新版替代）
```

`ss` 是 `netstat` 的现代替代品，输出格式更清晰，执行速度也更快。在新系统中建议优先使用 `ss`。

## 软件包管理

```bash
# Debian / Ubuntu
sudo apt update
sudo apt install pkg

# CentOS / RHEL
sudo yum install pkg
# 或
sudo dnf install pkg
```

不同发行版的包管理器不同，Ubuntu/Debian 用 `apt`，CentOS/RHEL 用 `yum` 或 `dnf`。安装软件前先执行 `update` 更新索引是个好习惯。

## 压缩与解压

```bash
tar -czvf archive.tar.gz dir/   # 压缩为 tar.gz
tar -xzvf archive.tar.gz        # 解压 tar.gz

zip -r archive.zip dir/         # 压缩为 zip
unzip archive.zip               # 解压 zip
```

`tar` 的参数记忆口诀：`c` 创建、`x` 解压、`z` gzip 压缩、`v` 显示过程、`f` 指定文件名。

## 其他实用命令

```bash
history          # 查看命令历史
clear            # 清屏
date             # 显示当前时间
reboot           # 重启系统
shutdown now     # 立即关机
```

---

以上命令覆盖了 Linux 日常使用的绝大多数场景。接下来介绍一个与 Linux 开发密切相关的话题：如何在虚拟机和宿主机之间传输文件。

## VMware 虚拟机与 Windows 文件传输

在 VMware 中运行 Ubuntu 时，经常需要在两个系统之间搬运文件。以下四种方法按推荐程度排序。

### 方法一：直接拖拽（最简单）

首先需要安装 VMware 开源增强工具：

```bash
sudo apt update
sudo apt install open-vm-tools open-vm-tools-desktop -y
sudo reboot
```

然后在 VMware 中开启双向拖拽：关闭或暂停虚拟机 → 顶部菜单「虚拟机 → 设置」→ 「选项 → 客户机隔离」→ 将拖放和复制粘贴都设为「双向」。重启虚拟机后即可直接在两个系统间拖拽文件。

### 方法二：共享文件夹（适合大量文件长期互传）

**第一步**，在 Windows 上新建一个空文件夹作为共享目录（路径不要包含中文）。

**第二步**，在 VMware 虚拟机设置中配置共享：「选项 → 共享文件夹」→ 勾选「总是启用」→ 点击「添加」→ 浏览选中刚才创建的 Windows 文件夹。

**第三步**，在 Ubuntu 中访问共享目录。默认挂载路径为 `/mnt/hgfs/`：

```bash
# 查看已配置的共享目录名
vmware-hgfsclient
# 进入共享文件夹
cd /mnt/hgfs
# 将 Ubuntu 文件复制到共享目录
cp ~/test.txt /mnt/hgfs/
```

此时 Windows 端的共享文件夹中就能看到传过来的文件了。

#### 共享文件夹无法自动挂载的修复

如果 `/mnt/hgfs` 为空，可以手动挂载：

```bash
sudo vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other,uid=1000
```

要实现开机自动挂载，编辑 `/etc/fstab`，在末尾添加一行（将 uid/gid 替换为你的实际值，可通过 `id` 命令查看）：

```text
.host:/ /home/[用户名]/vmshare fuse.vmhgfs-fuse allow_other,uid=1000,gid=1000,defaults 0 0
```

### 方法三：SCP 传输（命令行备用方案）

当拖拽和共享文件夹都不可用时，可以通过 SSH 协议传输文件。

先在 Ubuntu 中开启 SSH 服务：

```bash
sudo apt install openssh-server
sudo systemctl start ssh
sudo systemctl enable ssh
# 查看 Ubuntu 的 IP 地址
ip a
```

然后在 Windows 的 CMD 或 PowerShell 中拉取文件：

```powershell
# 下载单个文件
scp [用户名]@[虚拟机IP]:/home/[用户名]/Desktop/test.zip D:\

# 下载整个文件夹
scp -r [用户名]@[虚拟机IP]:/home/[用户名]/code D:\VM_Files
```

### 方法四：Python 临时 HTTP 服务器（零配置应急方案）

如果只是临时传几个文件，不想做任何配置，可以用 Python 内置的 HTTP 服务器：

```bash
# 在要传输的文件所在目录执行
python3 -m http.server 8000
```

然后在 Windows 浏览器中访问 `http://[虚拟机IP]:8000`，直接点击下载即可。用完关闭终端即停止服务。

### 常见问题

- **不能拖拽**：确认安装了 `open-vm-tools-desktop`、客户机隔离设为双向、重启过虚拟机
- **`/mnt/hgfs` 为空**：手动执行挂载命令，或检查 VMware 共享文件夹是否已启用
- **中文文件名乱码**：共享文件夹路径全程使用英文，避免中文目录名

## 小结

- Linux 日常命令可分为文件操作、内容查看、搜索、权限、进程、网络、包管理七大类
- `rm -rf` 等破坏性命令执行前务必二次确认路径
- VMware 文件传输首选拖拽，需先安装 `open-vm-tools-desktop`
- 共享文件夹适合长期大量互传，注意挂载问题和中文路径
- SCP 和 Python HTTP 服务器是无图形界面时的可靠备选方案
