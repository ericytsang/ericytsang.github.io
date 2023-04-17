---
title: Service Basics
---
# Using Services

- `systemctl enable [service]` - registers the _`[service]`_ to be `start`ed upon system bootup.
- `systemctl start [service]` - immediately `start` the _`[service]`_.
- `systemctl stop [service]` - immediately `stop` the _`[service]`_.
- `systemctl restart [service]` - immediately `stop` (if running) then `start` the _`[service]`_.

# Creating a Custom Service

## Learning Outcomes

This section walks through creating a service named `myservice` that shall:
- have a **unit file** (`/etc/systemd/system/myservice.service`) so the system can handle the service properly.
- use a **configuration file** (`/etc/myservice.conf`) to pass information to it.
- execute a **start script** (`/usr/bin/myservice/start.sh`) upon **service start up**
- execute a **stop script** (`/usr/bin/myservice/stop.sh`) upon **service shut down**
- optionally be started by the system upon boot up.

_note: all running services are stopped upon system shutdown_

## Tutorial

follow the steps below to create the service described earlier:

1. think of a name for your service. `myservice` will be used as the name of our newfangled custom service for this tutorial.
2. create the `myservice.service` service unit file in the `/etc/systemd/system` directory:

        # cat << EOF > /etc/systemd/system/myservice.service
        > [Unit]
        > Description=this service does something useful
        > After=default.target
        > ConditionPathExists=/etc/myservice.conf
        > ConditionPathExists=/usr/bin/myservice/start.sh
        > ConditionPathExists=/usr/bin/myservice/stop.sh
        > 
        > [Service]
        > Type=oneshot
        > RemainAfterExit=yes
        > EnvironmentFile=/etc/myservice.conf
        > ExecStart=/usr/bin/myservice/start.sh ${param_foo} ${param_bar}
        > ExecStop=/usr/bin/myservice/stop.sh ${param_foo} ${param_bar}
        > 
        > [Install]
        > WantedBy=default.target
        > EOF

    there are a couple of important things to note about the service declaration above:
    * `ConditionPathExists` prevents the service from executing if the path does not exist.
    * `EnvironmentFile` specifies the location of the configuration file for the service. this is where the values for _${param_foo}_ and _${param_bar}_ are loaded from.
    * `ExecStart` specifies a command to execute upon starting the service.

3. create the `myservice.conf` configuration file in the `/etc` directory:

        # cat << EOF > /etc/myservice.conf
        > param_foo=value one
        > param_bar=value2
        > EOF

    the configuration file created above defines two variables: `param_foo` with the value `value one`, and `param_bar` with the value `value2`.

4. create the `start.sh` start script that is run upon starting the service in the `/usr/bin/myservice` directory.

        # cat << EOF > /usr/bin/myservice/start.sh
        > #!/bin/bash
        > echo "param_foo is $1 and param_bar is $2. service has started."
        > EOF
        # chmod 755 /usr/bin/myservice/start.sh

    the start script logs a message involving some command-line arguments.

5. create the `stop.sh` stop script that is run upon stopping the service in the `/usr/bin/myservice` directory.

        # cat << EOF > /usr/bin/myservice/stop.sh
        > #!/bin/bash
        > echo "param_foo is $1 and param_bar is $2. service has stopped."
        > EOF
        # chmod 755 /usr/bin/myservice/stop.sh

    the stop script logs a message involving some command-line arguments.

6. start the service then check the status of the service to make sure that the service has started correctly.

        # systemctl start myservice
        # systemctl status myservice

7. stop the service then check the status of the service to make sure that the service has stopped correctly.

        # systemctl stop myservice
        # systemctl status myservice

8.  congratulations! :) you've just created yourself a service. consider enabling it to have the system automatically start up the service upon booting up.

        # systemctl enable myservice
