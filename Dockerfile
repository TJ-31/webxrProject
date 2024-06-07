FROM ros:kinetic

# Basic tools and dependencies and nodejs LTS PPA.
RUN apt update && apt install -y curl && curl -sL https://deb.nodesource.com/setup_16.x | bash - && apt install -y nodejs

# Install rvizweb.
WORKDIR /rvizweb_ws
ARG rvizweb_branch=master
RUN git clone https://github.com/osrf/rvizweb/ src/rvizweb -b ${rvizweb_branch}
RUN rosdep install --from-paths src --ignore-src -r -y

# Install npm, bower, polymer-cli, and ws.
RUN npm install -g bower polymer-cli --unsafe-perm=true --allow-root
RUN npm install ws --unsafe-perm=true --allow-root

WORKDIR /rvizweb_ws/src/rvizweb
RUN bower install --allow-root && bower install eventemitter2 --save --allow-root

WORKDIR /rvizweb_ws
RUN . /opt/ros/kinetic/setup.sh && catkin_make install

# Clear apt cache.
RUN apt clean

# Copy the web files to the shared directory.
WORKDIR /rvizweb_ws
RUN rm -rf /rvizweb_ws/install/shared/rvizweb/www/*
RUN cp -r /rvizweb_ws/build/rvizweb/www/* /rvizweb_ws/install/share/rvizweb/www/

# Copy WebSocket server file
COPY websocket_server.js /rvizweb_ws/

# Copy WebXR application files
WORKDIR /webxrProject
COPY src/webxr/index.html .
COPY src/webxr/js js/
COPY src/webxr/css css/

EXPOSE 8001
EXPOSE 8080

ENTRYPOINT ["/bin/bash", "-c", "node /rvizweb_ws/websocket_server.js & source /rvizweb_ws/install/setup.bash && roslaunch rvizweb rvizweb.launch"]
