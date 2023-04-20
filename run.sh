#!/bin/bash

composedir="./compose"

# Check if we're root and re-execute if we're not.
if [ $(id -u) != "0" ]; then
  sudo bash "$0" "$@"  # Modified as suggested below.
  exit $?
fi

# Make sure a script to run was named
if [ -z "$1" ]; then
  echo "Command must be name of compose script in first parameter"
  exit 1
fi

# Construct the base command
cmd="docker-compose -f "$composedir/$1.yml" --project-directory ."
apkUpload="docker-compose -f ./tools/uploader.yml --project-directory ."

# Apk Uploader
apkLauncher() {
  case "$1" in
    "up")
      $apkUpload up -d
      echo "Launching into a session for the apk uploader."
      echo "  - sudo docker exec -it apk-uploader ash"
      sudo docker exec -it apk-uploader ash
      ;;
    "down")
      $apkUpload down -v
      ;;
    *)
      echo "Command must be up or down"
      echo "$3"
      ;;
  esac
}

# Start or stop the given compose script
case "$2" in
  "up")
    $cmd up -d
    ;;
  "uploader")
    apkLauncher $3
    ;;
  "upsync")
    $cmd up
    ;;
  "down")
    $cmd down -v
    ;;
  "restart")
    $cmd restart
    ;;
  *)
    echo "Command must be up, upsync, down, or restart in second parameter"
    ;;
esac
