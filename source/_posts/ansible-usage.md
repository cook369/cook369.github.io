---
title: ansible使用说明
date: 2025-03-21 10:14:09
tags:
  - ansible
---
# ansible安装
1. 使用pip安装ansible
```shell
python get-pip.py --user
python -m pip install --user ansible
```
2. 检查ansible安装
```shell
ansible --version
```
# inventory
ansible默认使用/etc/ansible/hosts作为inventory文件，也可以使用-i选项指定inventory文件
inventory文件格式：
ini格式：
```shell
[webservers]
webserver1.example.com
webserver2.example.com
webserver3.example.com
192.0.6.45

[databases]
database1.example.com
database2.example.com

[host]
host1 ansible_host=127.0.0.1 ansible_user=vagrant ansible_port=2222 ansible_ssh_private_key_file=./.vagrant/machines/host1/virtualbox/private_key

[remote]
remote_test

[remote:vars]
ansible_host=IP_ADDRESS_OF_VIRTUAL_MACHINE
ansible_user=USERNAME
```

# playbook
playbook格式：
```yaml
---
- name: Intro to Ansible Playbooks
  hosts: all
  tasks:
  - name: Copy file hosts with permissions
    ansible.builtin.copy:
      src: ./hosts
      dest: /tmp/hosts_backup
      mode: 0644
  - name: Add the user test
    ansible.builtin.user:
      name: test
    become: yes
    become_method: sudo
  - name: Upgrade all apt packages
    apt:
      force_apt_get: yes
      upgrade: dist
    become: yes
```

# Ansible 常用命令
命令行执行，格式为`ansible [host-pattern] -m [module] -a "[module options]"`
```shell
ansible all -i localhost, --connection=local -m ping
ansible all -i hosts -m ping

ansible all -i hosts --limit host2 -a "/bin/echo hello"
# 指定ansible_user和ansible_password,执行模块
ansible all -i '127.0.0.1,' -m ping  --e "ansible_user=xxx ansible_password=xxx"
# -K交互输入密码
ansible all -i '127.0.0.1,' -a "hostname"  -u xxx -b -K
# 获取os的运行时间
ansible all -i /path/to/inventory/file -m command -a uptime 
# 远程创建文件
ansible all -m ansible.builtin.file -a "dest=/srv/foo/b.txt mode=600 owner=xxx group=xxx"
# 远程创建目录
ansible all -m ansible.builtin.file -a "dest=/path/to/c mode=755 owner=xxx group=xxx state=directory"
# 远程删除文件
ansible webservers -m ansible.builtin.file -a "dest=/path/to/c state=absent"

# 指定任务开始执行
ansible-playbook playbook.yml --start-at-task="install packages"
# 逐行执行
ansible-playbook playbook.yml --step

```

# Ansible 环境变量常用
```shell
# hostkey 检查
export ANSIBLE_HOST_KEY_CHECKING=False
# 全局启用调试器
export ANSIBLE_ENABLE_TASK_DEBUGGER=True
```

# Ansible 默认路径
```shell
# inventory
/etc/ansible/hosts
```

# Ansible debug
1. --step 任务执行交互
```
PLAY [Your play name] ****************************************************************************************
Perform task: TASK: Your task name (N)o/(y)es/(c)ontinue:
```
2. -vvv 显示详细日志
`ansible-playbook playbook.yml -vvv`
3. 打印运行时的变量信息
```yaml
- name: dump all
  hosts: all
  tasks:
    - name: Print some debug information
      vars:
        msg: |
          Module Variables ("vars"):
          --------------------------------
          {{ vars | to_nice_json }}
          ================================

          Environment Variables ("environment"):
          --------------------------------
          {{ environment | to_nice_json }}
          ================================

          Group Variables ("groups"):
          --------------------------------
          {{ groups | to_nice_json }}
          ================================

          Host Variables ("hostvars"):
          --------------------------------
          {{ hostvars | to_nice_json }}
          ================================
      debug:
        msg: "{{ msg.split('\n') }}"
      tags: debug_info
```
4. ansible-lint 检查playbook
```shell
roles/rolename/tasks/main.yml:8: risky-file-permissions File permissions unset or incorrect
```
5. ansible-console 交互模式运行
运行命令`ansible-console -i hosts.yml`.
获取提示信息`help`, 获取模块说明`help shell`。
执行模块`shell touch /tmp/asd creates=/tmp/asd`.
切换运行主机`cd group`, 查看主机`command hostname`.
模块不存在，默认会使用ansible.builtin.shell模块，`echo blah`会用shell执行.
语法提示`<tab>`.

6. Ansible Debugger 
任务失败时候进入python交互模式，可以执行命令。
```yaml
- name: Execute a command
  ansible.builtin.command: "false"
  debugger: on_failed

- name: My play
  hosts: all
  debugger: on_skipped
  tasks:
    - name: Execute a command
      ansible.builtin.command: "true"
      when: False

- hosts: all
  debugger: on_failed
  gather_facts: no
  tasks:
    - fail:
```
debug中使用的命令
| 命令 | 缩写 | 说明|
| --- | --- | --- |
| print | p | 打印变量 |
| task.args[key] = value | | 更新args |
| task_vars[key] = value | | 更新task_vars，需要跟update_task一起用 |
| update_task | u | 重新创建任务 |
| redo | r | 重试任务 |
| continue | c | 继续执行 |
| quit | q | 退出debugger |

```shell
p task
p task.args
p task_vars
p task_vars['pkg_name']
p host
p result._result

# 更新args
task.args['name'] = 'bash'

# 更新vars,需要和update_task一起用
task_vars['pkg_name'] = 'bash
update_task

# 重试任务
redo 


```

7. 常用debug写法

```yaml
---
- name: Print a message
  debug:
    msg: "Hello, Ansible"

---
- name: Check variable value
  debug:
    var: some_variable

---
- name: Debugging Variables
  hosts: all
  tasks:
    - name: Display the value of 'my_variable'
      debug:
        msg: "The value of my_variable is {{ my_variable }}"

```



# 参考
1. [Ansible官方文档](https://docs.ansible.com/ansible/latest/index.html)
2. [Debugging Ansible Playbooks](https://medium.com/@vinoji2005/day-20-debugging-ansible-playbooks-essential-techniques-35d1576847ffl)
3. [Ansible Debugger](https://docs.ansible.com/ansible/latest/user_guide/playbooks_debugger.html)



