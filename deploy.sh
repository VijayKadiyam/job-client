#!/bin/bash
cd ~/public_html/rms-client/


npm run build

pm2 delete rms 

pm2 start npm --name rms -- start
