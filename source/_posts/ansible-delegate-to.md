---
title: ansible-delegate_to
date: 2025-08-05 13:53:53
tags:
 - ansible
---

### delegate_to是ansible的委派主机，使用委派主机需要注意上下问变量不会切换

```ini
[hosts]
node1 ansible_host=xxxxx work_dir=root_dir_1
node2 ansible_host=xxxx work_dir=root_dir_2

[work1]
node1

[work2]
node2

[hosts:vars]
ansible_ssh_user=root 
ansible_ssh_pass=xxxxx
```

```yaml
- hosts: node1
  gather_facts: false
  tasks:
    - name: show context
      debug:
        msg:
          - "ansible_delegated_vars:  {{ ansible_delegated_vars.keys() | list }}"
          - "ansible_play_hosts:  {{ ansible_play_hosts }}"
          - "inventory_hostname={{ inventory_hostname }}"
          - "work_dir={{ work_dir }}"
          - "origin work_dir={{ hostvars[inventory_hostname].work_dir }}"
          - "delegate work_dir = {{ hostvars[ansible_delegated_vars | first].work_dir }}"
      delegate_to: node2
```

```shell
PLAY [node1] ******************************************************************************************************************************************************************************************

TASK [show context] ***********************************************************************************************************************************************************************************
ok: [node1 -> node2(172.17.139.121)] => {
    "msg": [
        "ansible_delegated_vars:  ['node2']",
        "ansible_play_hosts:  ['node1']",
        "work_dir=root_dir_1",
        "inventory_hostname=node1",
        "origin work_dir=root_dir_1",
        "delegate work_dir = root_dir_2"
    ]
}

PLAY RECAP ********************************************************************************************************************************************************************************************
node1                      : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0  
```

需要使用委派主机上下文，可以使用`hostvars[ansible_delegated_vars | first]`或单独设置vars和set_fact