#!/bin/bash
cd ~/public_html/digiloop-client/

npm run build

pm2 delete npm 

pm2 start npm --name digiloop -- start
