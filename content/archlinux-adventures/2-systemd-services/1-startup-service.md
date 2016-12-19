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

# TODO

# Tips & Tricks

- `.service` files should be saved in the `/etc/systemd/system` directory in order to be recognized by the operating system.

- `systemctl enable [service]` - registers the _`[service]`_ to be `start`ed upon system bootup.
- `systemctl start [service]` - immediately `start` the _`[service]`_.
- `systemctl stop [service]` - immediately `stop` the _`[service]`_.
- `systemctl restart [service]` - immediately `stop` (if running) then `start` the _`[service]`_.
