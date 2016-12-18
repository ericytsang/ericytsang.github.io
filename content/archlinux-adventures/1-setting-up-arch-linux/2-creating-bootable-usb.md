# overview

the sections in this page covers:

1. acquiring the Arch Linux ISO
2. creating a bootable Arch Linux USB (with the ISO)
3. verifying the bootable Arch Linux USB setup

# acquiring the Arch Linux ISO

grab the BitTorrent for the Arch Linux ISO from [the official Arch Linux wiki download page](https://www.archlinux.org/download/)!

i use [qbitorrent](http://www.qbittorrent.org/download.php) to download BitTorrent downloads:

[![qtorrent in action](http://i.imgur.com/Be8k1FH.png)](http://i.imgur.com/Be8k1FH.png)

# creating a bootable Arch Linux USB

[Rufus](https://rufus.akeo.ie/) is used in this tutorial to create the bootable USB media:

1. prepare and mount an empty USB with a capacity of at last 8GB to the computer _(I'm not sure what the minimum is)_.
2. download and start [Rufus](https://rufus.akeo.ie/) _(the version I acquired is a stand-alone executable.)_
3. configure Rufus with the settings below:
    - **Device:** _your empty USB._
    - **Partition scheme and target system type:** GPT partition scheme for UEFI
    - **File system:** FAT32 (Default)
    - **Cluster size:** 8192 bytes (Default)
    - **New volume label:** _anything you like_
    - Under **Format Options**:
        1. from the drop-down menu next to the **Create a bootable disk using** item, select **ISO Image**
        2. select the **Click to select an image...** button and select the **Arch Linux ISO** we downloaded earlier.

    [![my Rufus configuration](http://i.imgur.com/L6h2oEn.png)](http://i.imgur.com/L6h2oEn.png)
4. begin formatting the USB with Rufus; press **Start** to begin formatting the USB!

    [![USB formatting in progress](http://i.imgur.com/2V3gByW.png)](http://i.imgur.com/2V3gByW.png)

5. you can exit Rufus once it's done formatting the USB.

    [![Rufus finished formatting USB](http://i.imgur.com/KfCF4C5.png)](http://i.imgur.com/KfCF4C5.png)

# verify the bootable Arch Linux USB setup

verify that the bootable Arch Linux USB has been set up properly:

1. boot into the bootable Arch Linux USB on the host machine. this may require you to [disable secure boot](http://packard-bell-scandic.custhelp.com/app/answers/detail/a_id/27071/~/how-to-enable-or-disable-secure-boot).
2. once Arch Linux has booted up, run the command:

        # ls /sys/firmware/efi/efivars

    if the directory exists and the command succeeds, you're good to go! proceed to [the next page](./index.html?contenturl=./content/archlinux-adventures/1-setting-up-arch-linux/3-prepare-2-install.md&pagetitle=Prepare%20to%20Install...) when ready.
