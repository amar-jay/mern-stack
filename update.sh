#!/bin/bash


if [ -d .git ]
then
	git add .
	git commit -m "Commit: $1"
	git push
	echo "Commited $1"
else
	echo "Git repo not intialized!!!
	Commad: git init"
fi



