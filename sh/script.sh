#!/usr/bin/env bash
set -e
if [ -z $1 ]; then echo Usage: $0 directory >&2; exit 2; fi
if [ ! -d $1 ]; then echo Not a directory: $1 >&2; exit 3; fi
for f in $1/*; do
  if [ -e $f ]; then
    atime=$(stat -c %X $f)
    iso=$(date -d @$atime +%Y-%m-%dT%H:%M:%S%z)
    printf %s\\t%s\\n $f $iso
  fi
done
