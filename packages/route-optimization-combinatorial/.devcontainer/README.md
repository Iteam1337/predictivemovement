# Development inside a Docker container with Visual Studio Code

This is the setup for the development with VSC and Docker. The complete environment is shared and setup by docker containers. You are developing inside the containers.

- [localhost setup](#localhost-setup)

  - [Build and create on localhost](#build-and-create-on-localhost)
  - [Rebuilds on localhost](#rebuilds)
  - [Run containers on localhost](#run-containers-on-localhost)
  - [Attach VSC on localhost containers](#attach-vsc-on-localhost-containers)

**Note:** _docker-compose_ has currently no GPU support, therefore we have to use _docker run_ commands instead for the setup. Please have a look at this issue for more information: <https://github.com/docker/compose/issues/6691>

## localhost setup

All the following commands assume that they are executed from the directory `.devcontainer` in the project.

### Build and create on localhost

The build and create steps had to be done only once in the beginning and every time you make changes to the image.

Library dependencies can be added to the `requirement-x.txt` files. A rebuild is need.

```bash
# build the image for the development container
docker build --force-rm --tag predictivemovement/combinatorial:1 .

# create the development container; remove '--gpus all' if no GPU support is needed
docker create \
--gpus all \
--name predictivemovement_combinatorial \
--mount type=bind,source="$(pwd)"/..,target=/workspace,consistency=delegated \
predictivemovement/combinatorial:1
```

### Rebuilds on localhost

If you need to rebuild because of changes, you have to delete the existing container and image before. This is because we have set a fixed name for them. After that, you can just run again the commands from [Build and create](#build-and-create-on-localhost).

```bash
# delete container
docker container rm predictivemovement_combinatorial

# delete image
docker rmi -f predictivemovement/combinatorial:1
```

### Run containers on localhost

Just start/stop the container to use it:

```bash
# start conatainer for your coding session
docker start predictivemovement_combinatorial

# stop conatainer when your coding session is done
docker stop predictivemovement_combinatorial
```

### Attach VSC on localhost containers

When the containers are running you can attach/detach from VSC to/from the development container `predictivemovement/combinatorial` as you like. Just use the VSC command: **Remote-Containers: Attach to Running Container...**

If the VSC FileExplorer is not recognizing the mounted source code folder automatically, please _Open Folder_ the folder `/workspace` manually in the explorer.

Also, on the first start, the VSC extensions need to be installed. If not automated recommended you can find them under recommendations in the _Extensions_. A reload of VSC may be required.
