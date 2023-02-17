#!/bin/sh

if ["$DEBUG" = 1]; then
    npm run dev
else
    npm start
fi
