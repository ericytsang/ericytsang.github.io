# BIOS

Supervisor Password: password

# internet

## commands

nano /etc/netctl/home.netctlprofile
netctl start home.netctlprofile
ping 8.8.8.8

## /etc/netctl/home.netctlprofile

Description='WPA-encrypted network @ 9355 kilby street'
Interface=wlp1s0
Connection=wireless
Security=wpa
IP=dhcp
ESSID='huzzah-2.4G'
Key='l3m0nhoney'

# system clock

## commands

timedatectl
timedatectl set-ntp true
timedatectl status

# partitioning

see https://wiki.archlinux.org/index.php/partitioning#Example_layouts for examples and instructions about how to set up your partitions

##commands

cfdisk - pseudo GUI for modifying the partition table

# formatting partitions

## swap partition

[partition type] /dev/[device]

see https://wiki.archlinux.org/index.php/file_systems#Types_of_file_systems

## other partitions

mkswap /dev/[device]

# mounting filesystems

## commands

mount /dev/[device] /mnt/[directory] - mounts the specified device such that it is accessible vie the specified directory
umount /dev/[device] - unmounts the specified device

## example

assuming that the partitions on this system has been set up as:

 - /dev/sda1 - boot partition
 - /dev/sda2 - swap partition
 - /dev/sda3 - root partition

mount /dev/sda3 /mnt
mkdor /mnt/boot
mount /dev/sda1 /mnt/boot

# install


