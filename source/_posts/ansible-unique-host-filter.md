---
title: ansible-playbook中根据主机ip聚合
date: 2025-05-13 19:08:18
tags:
  - ansible
---
# ansible-playbook中根据主机ip聚合
1. inventery测试文件
```ini
[hosts]
172.17.100.100 ansible_ssh_user=root ansible_ssh_pass=password
test-1 ansible_host=172.17.100.100 ansible_ssh_user=root ansible_ssh_pass=password
test-2 ansible_host=172.17.100.100 ansible_ssh_user=root ansible_ssh_pass=password
test-3 ansible_host=172.17.100.100 ansible_ssh_user=root ansible_ssh_pass=password
```
2. palybook
```yaml
---
- hosts: hosts
  gather_facts: false
  tasks:
  # Build leader hosts list based on unique ansible_host
  - name: print debug host info
    debug:
      msg: >-
        {{ ansible_play_hosts}} {{ inventory_hostname }} {{ hostvars }}
    run_once: true
    delegate_to: localhost
  - name: 方式1
    run_once: true
    delegate_to: localhost
    block:
      - set_fact:
          inventory_leader_str: |
              {%- set combined = [] %}
              {%- for host in ansible_play_hosts %}
              {%- set item = {
                  'host_key': hostvars[host].ansible_host | default(host),
                  'inventory_hostname': host
              } %}
              {{ combined.append(item) }}
              {%- endfor %}
              {# 去重 host_key #}
              {%- set seen = [] %}
              {%- set result = [] %}
              {%- for item in combined %}
              {%- if item.host_key not in seen %}
                  {{ seen.append(item.host_key) }}
                  {{ result.append(item.inventory_hostname) }}
              {%- endif %}
              {%- endfor %}
              {{ result }}
      - set_fact:
          inventory_leader_1: "{{ inventory_leader_str|from_yaml }}"

      - name: pring inventory_leader
        debug:
          msg: >-
              {{ inventory_leader_1 }}

  - name: 方式2
    block:
      - name: Set leader_key per host
        set_fact:
          leader_key: "{{ ansible_host | default(inventory_hostname) }}"
      - name: debug 2
        debug:
          msg: >-
              {{ ansible_play_hosts | map('extract', hostvars) | unique(attribute='leader_key') | map(attribute='inventory_hostname') | list}}
        run_once: true
        delegate_to: localhost

  - name: 方式3
    block:
      - name: gather facts
        setup:
          filter: ansible_default_ipv4
      - name: debug 3
        debug:
          msg: >-
            {{ ansible_play_hosts | map('extract', hostvars) | unique(attribute='ansible_default_ipv4.address') | map(attribute='inventory_hostname') | list}}
        run_once: true
        delegate_to: localhost
```

# 解释
1. 方式1使用jinja语法，选出首次出现host_key对应的inventory_hostname
2. 方式2使用map和unique，根据leader_key去重
3. 方式3使用setup模块，获取ansible_default_ipv4.address，然后根据ip地址去重,需要连接主机获取基本信息
