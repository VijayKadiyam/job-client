#!/bin/bash
cd ~/public_html/rms-client/

chmod -R 777 .git

npm run build

pm2 delete rms 

pm2 start npm --name rms -- start
