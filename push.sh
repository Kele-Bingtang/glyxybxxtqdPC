#!/bin/bash
GITHUB_REPO=git@github.com:Kele-Bingtang/glyxybxxtqdPC.git

comment=$1

if [ ! $comment ]; then

comment="更新项目内容"

fi

git add -A
git commit -m "${comment}"    # $1 是启动该脚本传来的参数，如 sh push.sh hello，其中 hello 就会插入到 $1 处，如果想两个参数，则加 $2
git push github
