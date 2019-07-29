#!/bin/bash
find /opt/yodlee/*.rpm -mtime +5 -type f

if [ $? -eq 0 ]; then
   find /opt/yodlee/*.rpm -mtime +5 -type f -delete
fi
