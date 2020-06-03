# Terra Mystica (snellman) Prettifier

This is a Firefox Add-on to improve the layout of Terra Mystica (c Feuerland) games played on the website https://terra.snellman.net/.

## Features

This Add-on modifies the layout of games by drawing faction boards, resources, and bonus/favor/town/scoring tiles with images that resemble those in board game.

Not all expansions are implemented yet.
If you open a game that uses an expansion that is not implemented, the game will render as it would without the Add-on.

## Install

We have not yet made this Add-on available in the Firefox Add-on webstore because we are unsure about the copyright of the images.

### Install from file (recommended)
![](https://github.com/rarusel/terra-snellman/workflows/build%20%26%20sign%20%26%20publish/badge.svg)

Download the XPI file of the latest release: https://github.com/rarusel/terra-snellman/releases

By clicking it, Firefox will ask whether you'd like to trust GitHub to let them install an extension.
By clicking "Continue to Installation", you're not actually trusting GitHub, but us.
Click "Continue to Installation".

The XPI file is specified to check back for new releases.
If your Firefox allows automatic updating of add-ons (this is enabled by default), your copy of our extension will always be up-to-date.

### Install as temporary Add-on

If you would like to be up-to-date even in between releases, you can clone this repository and install it as temporary Add-on in Firefox, as described below.

You will be responsible to keep your copy up-to-date.

Also note that temporary Add-ons get disabled when you close your browser.

#### Clone this repo

Use the big green button in the top right corner that says `Clone or download`.
We recommend to "clone" the repository so you can get updates easily (by "pulling").
If you are unfamiliar with cloning, either
- read up on it here: https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository, or
- download the repository as zip file.
Then unpack to a folder of your choice.

In either case, remember to check back for updates regularly!

#### Add to Firefox

- Open a tab and navigate to `about:debugging`.
- On the left, select `This Firefox`.
- Click `Load temporary Add-on ...`
- Navigate to the folder where you cloned or unpacked this repo.

You can find more information here: https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/
