---
title: Install Arch Linux
---
# Overview

the sections in this page cover:

1. partitioning & formatting the host computer
2. acquiring an Internet connection for the host computer
3. synchronizing the host computer's system clock with the Internet

# Partitioning & Formatting

this section covers partitioning and formatting the host computer. all existing data on the host computer will most likely unrecoverable upon completing the instructions in this section.

## System Partitions

we will be partitioning the host computer as follows:

1. this partition shall be used by the UEFI bootloader to boot up the Arch Linux operating system on boot.

    - **Device:** `/dev/sda1`
    - **Size:** `512 MB`
    - **Type:** `EFI System`
    - **Format:** `fat32`

2. this partition shall be where the overflowing data from RAM is stored.

    - **Device:** `/dev/sda2`
    - **Size:** _sizeof(RAM)_
    - **Type:** `Linux Swap`
    - **Format:** `linux swap`

3. this partition shall be used to store the root file system (`/`).

    - **Device:** `/dev/sda3`
    - **Size:** _remaining memory_
    - **Type:** `Linux Filesystem`
    - **Format:** `ext4`

## Partitioning the Host System with `cfdisk`

this section has instructions for using `cfdisk` to partition the host computer into the partitions mentioned in the previous section.

`cfdisk` provides a pseudo graphical user interface for manipulating the system's partition table. it actually uses `fdisk` under the hood to manipulate system's the partition table.

1. start `cfdisk`; enter the command below into a Terminal:

        # cfdisk

    the `cfdisk` interface should appear...

2. some brief instructions on using `cfdisk`:
    - use the `←` and `→` arrow keys to select different operations to perform
    - use the `↑` and `↓` arrow keys to select which partition to perform the operation on
    - press `enter` to execute the operation.

3. use the `Delete` operation to delete all existing partitions from the host computer.
4. use the `New` operation to allocate the three partitions discussed earlier with their appropriate sizes.
5. use the `Type` command to change the types of the allocated partitions to their appropriate types.
6. use the `Write` command to commit and apply your changes to the host computer's partition table.

    [![writing to the partition table](http://i.imgur.com/nzZKzIN.jpg)](http://i.imgur.com/nzZKzIN.jpg)

7. use the `Quit` command to exit `cfdisk`.

## Formatting the Host System with `mkswap` and `mkfs`

this section uses the `mkswap` and `mkfs` tools to format the partitions allocated in the previous section. _(beware! partition device names used in the following steps may be different in your case)_:

1. format the **EFI System Partition** on `/dev/sda1` to be **fat32**.

        # mkfs.fat -F 32 /dev/sda1

2. format the **Swap Partition** on `/dev/sda2` to be **linux swap**.

        # mkswap /dev/sda2

3. finaly, format the **Root Partition** on `/dev/sda3` to be **ext4**.

        # mk.ext4 /dev/sda3

# Acquiring an Internet Connection

skip this section if you are already able to access the Internet. you can check whether or not you have access to the Internet by pinging Google with the command `ping 8.8.8.8`.

if you do not already have an Internet connection, it is likely that you need to connect to a wireless network. this section uses the `netctl` service to do just that; however, if this is not the case, the instructions in this section can still be useful!

## Instructions

follow the steps below to set up an Internet connection:

1. create a **netctl profile** in the `/etc/netctl` directory. the name of the profile in our case is `default`. use the command below to create the profile. _an example profile is provided in the next section (**Example Netctl Profile**). more example profiles can be found in the `/etc/netctl/examples` directory._

        # nano /etc/netctl/default

2. have netctl attempt to establish a connection using your profile. this command can take a while:

        # netctl start default

3. verify that you have an Internet connection:

        # ping 8.8.8.8

    [![ping 8.8.8.8](http://i.imgur.com/h2hm6u5.jpg?1)](http://i.imgur.com/h2hm6u5.jpg?1)

## Example Netctl Profile (`/etc/netctl/default`)

below is a sanitized version of the **netctl profile** I used for my network for reference.

    Interface=wlp1s0
    Connection=wireless
    Security=wpa
    IP=dhcp
    ESSID='myHomeNetwork'
    Key='superSecurePassword'

# Synchronizing the System Clock with the Internet

follow the instructions in this section to synchronize the host computer's system clock with the Internet clock.

1. turn on network clock synchronization.

    enter the command:

        # timedatectl set-ntp true

2. verify that network clock synchronization has been enabled and acquired.

    enter the command:

        # timedatectl status

    make sure that you have `Network time on: yes` and `NTP synchronized: yes` in the output of the command above.

    [![timedatectl status output](http://i.imgur.com/XZLdZLb.jpg?1)](http://i.imgur.com/XZLdZLb.jpg?1)

# Install Arch Linux

this section assumes that:
- the **EFI System Partition** is on `/dev/sda1`
- the **Linux Swap Partition** is on `/dev/sda2`
- the **Linux Root Partition** is on `/dev/sda3`

follow the instructions below to install the Arch Linux base packages onto the host system:
1. mount the **Linux Root Partition**:

        # mount /dev/sda3 /mnt

2. create a `boot` directory for the **EFI System Partition** in the **Linux Root Partition**:

        # mkdir /mnt/boot

3. mount the **EFI System Partition** onto the `boot` directory:

        # mount /dev/sda1 /mnt/boot

2. download the Arch Linux base packages into the mounted partitions:

        # pacstrap /mnt base

# Miscellaneous System Configuration

1. generate the **fstab** file so the system will know how to mount the partitions:

        # genfstab -U /mnt > /mnt/etc/fstab

2. change the root directory of the terminal:

        # arch-chroot /mnt

3. set the locale of the system:

    1. uncomment any lines in the `/etc/locale.gen` file to enable those localizations. we uncommented `en_US.UTF-8`.
    2. generate the characters for the selected locales:

            # locale-gen

    3. create the file `locale.conf` to set the localization of the host system. _in this case, we are setting the localization of the host system to `en_US.UTF-8`_:

            # echo "LANG=en_US.UTF-8" > /etc/locale.conf

4. create the `/etc/hostname` file to set the name of the host computer by writing to the file:

        # echo "hostname" > /etc/hostname

5. if the host system will be connecting to the LAN wirelessly, run the following command to install the appropriate packages:

        # pacman -S -y iw wpa_supplicant dialog

6. set the password of the **root** user account:

        # passwd

7.  install and configure the systemd-boot bootloader:

    1. install the systemd-boot bootloader:

            # bootctl --path=/boot install

    2. modify the `/boot/loader/loader.conf` file to configure the bootloader to load the appropriate bootloader entries from the `/boot/loader/entries` directory:

            # cat << EOF > /boot/loader/loader.conf
            > default arch
            > timeout 3
            > editor 0
            > EOF

    3. discover the partition UUID of the host system's root partition _(it is assumed that `/dev/sda3` is the root partition in the command below)_:

            # blkid -s PARTUUID -o value /dev/sda3

    4. create a bootloader entry that loads Arch Linux:

            # cat << EOF > /boot/loader/entries/arch.conf
            > title Arch-Linux
            > linux /vmlinuz-linux
            > initrd /initramfs-linux.img
            > options root=PARTUUID={partition UUID} rw
            > EOF

        _replace `{partition UUID}` in the command above with the UUID from the previous step._

8. exit the chroot environment:

        # exit

9. unmount all mounted partitions:

        # umount -R /mnt

10. reboot the system:

        # reboot
