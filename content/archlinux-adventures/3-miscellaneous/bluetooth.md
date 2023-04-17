---
title: Bluetooth
---
# Introduction

this section has instructions on creating a service that runs upon booting into the Arch Linux system, before the login prompt is shown.

# Instructions

1. install Bluetooth drivers and utility programs:

        # pacman -S -y bluez bluez-utils

2. start the bluetooth service so we can use bluetooth now:

        # systemctl start bluetooth

3. enable the bluetooth service so it will be started upon subsequent system bootups:

        # systemctl enable bluetooth

4. power up the Bluetooth adapter

        # bluetoothctl -a << EOF
        > power on
        > EOF
