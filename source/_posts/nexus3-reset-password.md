---
title: Nexus3 重置密码
date: 2025-05-24 23:44:34
tags:
  - nexus3
---

# nexus3 reset password

1. 启用 h2 数据库 http 界面
   在`$datadir/etc/nexus.properties`(/nexus-data)增加配置

```ini
nexus.h2.httpListenerEnabled=true
nexus.h2.httpListenerPort=1234
```

2. 映射 1234 端口到主机端口，重启服务
3. 配置 1234 端口 ssh 映射

```
ssh -L 1234:192.168.1.10:1234 user@192.168.1.10
```

4. 访问 http://localhost:1234,使用配置连接

```yaml
Driver: org.h2.Driver
JDBC URL: jdbc:h2:file:nexus
username: <LEAVE BLANK>
password: <LEAVE BLANK>
```

5. 查找 admin 用户记录,更新为默认密码`admin123`

```sql
select * from security_user where id='admin';

update security_user SET password='$shiro1$SHA-512$1024$NE+wqQq/TmjZMvfI7ENh/g==$V4yPw8T64UQ6GfJfxYq2hLsVrBY8D1v+bktfOxGdt4b/9BthpWPNUy/CBk6V9iA0nHpzYzJFWO8v/tZFtES8CA==', status='active' WHERE id='admin';
```

6. `nexus.properties`恢复默认配置，重启服务

# 参考

1. [How to reset nexus admin password in Nexus 3 OSS](https://www.declarativesystems.com/2025/03/11/reset-nexus-admin-password.html)
2. [How to reset a forgotten admin password in Sonatype Nexus Repository 3](https://support.sonatype.com/hc/en-us/articles/213467158-How-to-reset-a-forgotten-admin-password-in-Sonatype-Nexus-Repository-3)
